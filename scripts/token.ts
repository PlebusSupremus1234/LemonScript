import { TokenType } from "./constants"

export class Token {
    type: TokenType;
    value: number | string;

    constructor(type: TokenType, value: number | string) {
        this.type = type;
        this.value = value;
    }

    stringify(): string {
        return `${this.type}: ${this.value}`;
    }
}