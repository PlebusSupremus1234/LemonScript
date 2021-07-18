import { Token, TokenValue } from "./token";
import { Errors, UndefinedVariable } from "./errors";
import { Callable } from "./callable"

export class Environment {
    values: Map<string, TokenValue | Callable> = new Map();
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

    ancestor(distance: number) {
        let environment: Environment | undefined = this;
        for (let i = 0; i < distance; i++) {
            if (environment && environment.enclosing) environment = environment.enclosing;
        }

        return environment;
    }

    get(name: Token, ftext: string): TokenValue {
        let value = this.values.has(name.stringify()) ? this.values.get(name.stringify()) : undefined;
        if (value !== undefined) return value;
        else if (this.enclosing) return this.enclosing.get(name, ftext);
        else throw new UndefinedVariable(this.fname, ftext, name);
    }

    getAt(distance: number, name: Token) {
        let ancestor = this.ancestor(distance);
        if (ancestor) {
            let val = ancestor.values.get(name.stringify());
            return val !== undefined ? val : null;
        } else return null;
    }

    assign(name: Token, value: TokenValue, ftext: string) {
        if (this.values.has(name.stringify())) this.values.set(name.stringify(), value);
        else if (this.enclosing) this.enclosing.assign(name, value, ftext);
        else throw new UndefinedVariable(this.fname, ftext, name);
    }

    assignAt(distance: number, name: Token, value: TokenValue) {
        let ancestor = this.ancestor(distance);
        if (ancestor) ancestor.values.set(name.stringify(), value);
    }
}