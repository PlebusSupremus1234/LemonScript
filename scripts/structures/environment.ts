import { Token, TokenValue } from "./token";
import { Errors, UndefinedVariable } from "./errors";

export class Environment {
    values: Map<string, TokenValue> = new Map();
    fname: string;
    error: null | Errors = null;
    tokens: Token[];

    constructor(fname: string, tokens: Token[]) {
        this.fname = fname;
        this.tokens = tokens;
    }

    define(name: string, value: TokenValue) {
        this.values.set(name, value);
    }

    get(name: Token, ftext: string) {
        let value: TokenValue | undefined = this.values.get(name.stringify());
        if (value !== undefined) return value;

        throw new UndefinedVariable(this.fname, name.stringify(), this.tokens, ftext);
    }
}