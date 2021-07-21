import { Token, TokenValue } from "./token";
import { LSError } from "./errors";
import { Callable } from "./callable"

type KeyType = "VAR" | "FUNCTION" | "CLASS"
type VarKey = {
    constant: boolean;
    type: KeyType;
    value: TokenValue | Callable;
}

export class Environment {
    fname: string;
    ftext: string;
    values: Map<string, VarKey> = new Map();
    error: null | LSError = null;
    enclosing: null | Environment = null;

    constructor(fname: string, ftext: string, enclosing: null | Environment) {
        this.fname = fname;
        this.ftext = ftext;
        if (enclosing) this.enclosing = enclosing;
    }

    define(name: Token, constant: boolean, value: TokenValue, type: KeyType) {
        let key = this.values.get(name.stringify());
        if (key && key.type !== "VAR") {
            let text = `Cannot redefine ${key.type.toLowerCase()} '${name.stringify()}' on line ${name.line}`;
            throw new LSError("Invalid Function Declaration", text, this.fname, this.ftext, name.line, name.rowpos);
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

    get(name: Token, ftext: string): TokenValue {
        let key = this.values.has(name.stringify()) ? this.values.get(name.stringify()) : undefined;
        if (key && key.value !== undefined) return key.value;
        else if (this.enclosing) return this.enclosing.get(name, ftext);
        else {
            let text = `Undefined variable '${name.stringify()}' detected on line ${name.line}`;
            throw new LSError("Variable Error", text, this.fname, this.ftext, name.line, name.rowpos);
        }
    }

    getAt(distance: number, name: string, token?: Token) {
        let ancestor = this.ancestor(distance);
        if (ancestor) {
            let key = ancestor.values.get(token ? token.stringify() : name);
            return key && key.value !== undefined ? key.value : null;
        } else return null;
    }

    assign(name: Token, value: TokenValue, ftext: string) {
        let key = this.values.get(name.stringify());
        if (key) {
            if (key.constant === true) {
                let text = `Cannot change the value of a constant variable on line ${name.line}`;
                throw new LSError("Variable Error", text, this.fname, this.ftext, name.line, name.rowpos);
            } else this.values.set(name.stringify(), { constant: false, value, type: key.type });
        } else if (this.enclosing) this.enclosing.assign(name, value, ftext);
        else {
            let text = `Undefined variable '${name.stringify()}' detected on line ${name.line}`;
            throw new LSError("Variable Error", text, this.fname, this.ftext, name.line, name.rowpos);
        }
    }

    assignAt(distance: number, name: Token, value: TokenValue) {
        let ancestor = this.ancestor(distance);
        if (ancestor) {
            let key = ancestor.values.get(name.stringify());
            if (key) {
                if (key.constant === true) {
                    let text = `Cannot change the value of a constant variable on line ${name.line}`;
                    throw new LSError("Variable Error", text, this.fname, this.ftext, name.line, name.rowpos);
                } else ancestor.values.set(name.stringify(), { constant: false, value, type: key.type });
            } else {
                let text = `Undefined variable '${name.stringify()}' detected on line ${name.line}`;
                throw new LSError("Variable Error", text, this.fname, this.ftext, name.line, name.rowpos);
            }
        }
    }
}