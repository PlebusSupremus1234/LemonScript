import { LSTypes } from "../data/constants"
import { Token, TokenValue } from "./token"
import { ErrorHandler, ErrorHeader } from "./errorhandler"
import { capitilizeFirstLetter } from "../data/helper"
import { checkType, displayTypesPrimative, displayTypes } from "../data/types"

type KeyType = "VAR" | "FUNCTION" | "CLASS" | "MODULE";
export type VarKey = {
    constant: boolean;
    type: KeyType;
    types: LSTypes[];
    value: TokenValue;
}

export class Environment {
    errorhandler: ErrorHandler;
    enclosing: null | Environment = null;
    values: Map<string, VarKey> = new Map();

    constructor(enclosing: null | Environment, errorhandler: ErrorHandler) {
        this.errorhandler = errorhandler;
        if (enclosing) this.enclosing = enclosing;
    }

    define(name: Token, constant: boolean, value: TokenValue, type: KeyType, types: LSTypes[]) {
        let key = this.values.get(name.stringify());
        if (key && key.type !== "VAR") {
            let text = `Cannot redefine ${key.type.toLowerCase()} '${name.stringify()}' on line ${name.line}`;
            throw this.errorhandler.newError(`Invalid ${capitilizeFirstLetter(key.type.toLowerCase())} Declaration` as ErrorHeader, text, name.line, name.rowpos);
        }

        this.values.set(name.stringify(), { constant, value, type, types });
    }

    ancestor(distance: number) {
        let environment: Environment | undefined = this;
        for (let i = 0; i < distance; i++) {
            if (environment && environment.enclosing) environment = environment.enclosing;
        }

        return environment;
    }

    get(name: Token, error: boolean = true, whole = false): TokenValue | VarKey {
        let key = this.values.has(name.stringify()) ? this.values.get(name.stringify()) : undefined;

        if (key && key.value !== undefined) return whole ? key : key.value;
        else if (this.enclosing) return this.enclosing.get(name, whole);
        else if (error) {
            let text = `Undefined variable '${name.stringify()}' detected on line ${name.line}`;
            throw this.errorhandler.newError("Variable Error", text, name.line, name.rowpos);
        }

        return null;
    }

    getAt(distance: number, name: string, token?: Token, whole = false): TokenValue | VarKey {
        let ancestor = this.ancestor(distance);
        if (ancestor) {
            let key = ancestor.values.get(token ? token.stringify() : name);

            if (whole) return key ? key : null;
            else return key && key.value !== undefined ? key.value : null;
        }
        return null;
    }

    assign(name: Token, value: TokenValue, valueStart: Token, ancestor?: boolean, distance?: number) {
        let collection = this.values;
        if (ancestor) {
            if (!distance) return;
            let ancestorEnv = this.ancestor(distance);
            if (!ancestorEnv) return;
            collection = ancestorEnv.values;
        }

        if (collection) {
            let key = collection.get(name.stringify());
            if (key) {
                if (key.constant === true) {
                    let text = `Cannot change the value of a constant variable on line ${name.line}`;
                    throw this.errorhandler.newError("Variable Error", text, name.line, name.rowpos);
                } else {
                    if (!checkType(key.types, value)) {
                        let type = displayTypesPrimative(value);
                        let text = `Cannot assign type ${type} to a variable with type ${displayTypes(key.types)} on line ${valueStart.line}`;
                        throw this.errorhandler.newError("Type Error", text, valueStart.line, valueStart.rowpos);
                    }
                    collection.set(name.stringify(), { constant: false, value, type: key.type, types: key.types });
                }
            } else if (this.enclosing && !ancestor) this.enclosing.assign(name, value, valueStart);
            else {
                let text = `Undefined variable '${name.stringify()}' detected on line ${name.line}`;
                throw this.errorhandler.newError("Variable Error", text, name.line, name.rowpos);
            }
        }
    }
}