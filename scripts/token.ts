import { TokenType } from "./constants"

export class Token {
    type: TokenType;
    value: number | string;
    rowpos: number;
    line: number;

    constructor(type: TokenType, value: number | string, rowpos: number, line: number) {
        this.type = type;
        this.value = value;
        this.rowpos = rowpos;
        this.line = line;
    }

    stringify(): string {
        return `${this.type}: ${this.value}`;
    }
}