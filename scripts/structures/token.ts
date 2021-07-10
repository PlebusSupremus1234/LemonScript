import { TokenType } from "../constants"

export type TokenValue = null | boolean | number | string;
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
}