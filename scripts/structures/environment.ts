import { Token, TokenValue } from "./token"
import { Callable } from "../functions/callable"
import { capitilizeFirstLetter } from "../helper"
import { ErrorHandler } from "../structures/errorhandler"

type KeyType = "VAR" | "FUNCTION" | "CLASS"
type VarKey = {
    constant: boolean;
    type: KeyType;
    value: TokenValue | Callable;
}

export class Environment {
    errorhandler: ErrorHandler;
    enclosing: null | Environment = null;
    values: Map<string, VarKey> = new Map();

    constructor(enclosing: null | Environment, errorhandler: ErrorHandler) {
        this.errorhandler = errorhandler;
        if (enclosing) this.enclosing = enclosing;
    }

    define(name: Token, constant: boolean, value: TokenValue, type: KeyType) {
        let key = this.values.get(name.stringify());
        if (key && key.type !== "VAR") {
            let text = `Cannot redefine ${key.type.toLowerCase()} '${name.stringify()}' on line ${name.line}`;
            throw this.errorhandler.newError(`Invalid ${capitilizeFirstLetter(key.type.toLowerCase())} Declaration`, text, name.line, name.rowpos);
        }
        this.values.set(name.stringify(), { constant, value, type });
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

    assign(name: Token, value: TokenValue) {
        let key = this.values.get(name.stringify());
            if (key) {
            if (key.constant === true) {
                let text = `Cannot change the value of a constant variable on line ${name.line}`;
                throw this.errorhandler.newError("Variable Error", text, name.line, name.rowpos);
            } else this.values.set(name.stringify(), { constant: false, value, type: key.type });
        } else if (this.enclosing) this.enclosing.assign(name, value);
        else {
            let text = `Undefined variable '${name.stringify()}' detected on line ${name.line}`;
            throw this.errorhandler.newError("Variable Error", text, name.line, name.rowpos);
        }
    }

    assignAt(distance: number, name: Token, value: TokenValue) {
        let ancestor = this.ancestor(distance);
        if (ancestor) {
            let key = ancestor.values.get(name.stringify());
            if (key) {
                if (key.constant === true) {
                    let text = `Cannot change the value of a constant variable on line ${name.line}`;
                    throw this.errorhandler.newError("Variable Error", text, name.line, name.rowpos);
                } else ancestor.values.set(name.stringify(), { constant: false, value, type: key.type });
            } else {
                let text = `Undefined variable '${name.stringify()}' detected on line ${name.line}`;
                throw this.errorhandler.newError("Variable Error", text, name.line, name.rowpos);
            }
        }
    }
}