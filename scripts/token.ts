import { Constants, TokenType } from "./constants"

class Token {
    type: TokenType;
    value: string;
    literal: object;
    line: number;

    constructor(type: TokenType, value: string, literal: object, line: number) {
        this.type = type;
        this.value = value;
        this.literal = literal;
        this.line = line;
    }

    stringify(): string {
        return `${this.type}: ${this.value}`;
    }
}