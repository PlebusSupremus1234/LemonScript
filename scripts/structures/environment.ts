import { Token, TokenValue } from "./token";
import { Errors, UndefinedVariable } from "./errors";

export class Environment {
    values: Map<string, TokenValue> = new Map();
    fname: string;
    error: null | Errors = null;
    enclosing: null | Environment = null;

    constructor(fname: string, enclosing: null | Environment) {
        this.fname = fname;

        if (enclosing) this.enclosing = enclosing;
    }

    define(name: string, value: TokenValue) {
        this.values.set(name, value);
    }

    get(name: Token, ftext: string): TokenValue {
        let value = this.values.has(name.stringify()) ? this.values.get(name.stringify()) : undefined;
        if (value !== undefined) return value;
        else if (this.enclosing) return this.enclosing.get(name, ftext);
        else throw new UndefinedVariable(this.fname, name, ftext);
    }

    assign(name: Token, value: TokenValue, ftext: string) {
        if (this.values.has(name.stringify())) this.values.set(name.stringify(), value);
        else if (this.enclosing) this.enclosing.assign(name, value, ftext);
        else throw new UndefinedVariable(this.fname, name, ftext);
    }
}