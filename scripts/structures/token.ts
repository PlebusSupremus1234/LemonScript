import { TokenType } from "../constants"
import { Callable } from "./callable"
import { Instance } from "./instance"

export type TokenValue = null | boolean | number | string | Callable | Instance;
export class Token {
    type: TokenType;
    value: TokenValue;
    rowpos: number;
    line: number;

    constructor(type: TokenType, value: TokenValue, rowpos: number, line: number) {
        this.type = type;
        this.value = value;
        this.rowpos = rowpos;
        this.line = line;
    }

    stringify(): string {
        if (!this.value) return JSON.stringify(this.value);
        return this.value.toString();
    }
}