import { getType } from "../helper"
import { LSTypes } from "../constants"
import { Token, TokenValue } from "./token"
import { capitilizeFirstLetter } from "../helper"
import { ErrorHandler } from "../structures/errorhandler"

type KeyType = "VAR" | "FUNCTION" | "CLASS"
type varValType = LSTypes | null;
type VarKey = {
    constant: boolean;
    vartype: KeyType;
    type: varValType;
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

    define(name: Token, constant: boolean, value: TokenValue, type: varValType, vartype: KeyType) {
        let key = this.values.get(name.stringify());
        if (key && key.vartype !== "VAR") {
            let text = `Cannot redefine ${key.vartype.toLowerCase()} '${name.stringify()}' on line ${name.line}`;
            throw this.errorhandler.newError(`Invalid ${capitilizeFirstLetter(key.vartype.toLowerCase())} Declaration`, text, name.line, name.rowpos);
        }
        this.values.set(name.stringify(), { constant, value, type, vartype });
    }

    ancestor(distance: number) {
        let environment: Environment | undefined = this;
        for (let i = 0; i < distance; i++) {
            if (environment && environment.enclosing) environment = environment.enclosing;
        }

        return environment;
    }

    get(name: Token): TokenValue {
        let key = this.values.has(name.stringify()) ? this.values.get(name.stringify()) : undefined;
        if (key && key.value !== undefined) return key.value;
        else if (this.enclosing) return this.enclosing.get(name);
        else {
            let text = `Undefined variable '${name.stringify()}' detected on line ${name.line}`;
            throw this.errorhandler.newError("Variable Error", text, name.line, name.rowpos);
        }
    }

    getAt(distance: number, name: string, token?: Token) {
        let ancestor = this.ancestor(distance);
        if (ancestor) {
            let key = ancestor.values.get(token ? token.stringify() : name);
            return key && key.value !== undefined ? key.value : null;
        } else return null;
    }

    assign(name: Token, value: TokenValue, tokens: Token[], ancestor?: boolean, distance?: number) {
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
                    if (key.type === "Number" && typeof value !== "number" ||
                        key.type === "String" && typeof value !== "string" ||
                        key.type === "Boolean" && typeof value !== "boolean" ||
                        key.type === "Null" && value !== null) {
                        let token = tokens[tokens.findIndex(i => i.line === name.line && i.rowpos === name.rowpos) + 2];
                        let text = `Cannot assign type ${capitilizeFirstLetter((typeof value).toString())} to a variable with type ${key.type} on line ${token.line}`;
                        throw this.errorhandler.newError("Type Error", text, token.line, token.rowpos);
                    }
                    collection.set(name.stringify(), { constant: false, value, type: key.type, vartype: key.vartype });
                }
            } else if (this.enclosing && !ancestor) this.enclosing.assign(name, value, tokens);
            else {
                let text = `Undefined variable '${name.stringify()}' detected on line ${name.line}`;
                throw this.errorhandler.newError("Variable Error", text, name.line, name.rowpos);
            }
        }
    }
}