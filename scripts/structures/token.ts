import { TokenType } from "../constants"
import { Module } from "../modules/module"
import { Callable } from "../functions/callable"
import { Instance } from "../functions/instance"
import { Primitives } from "../primitives/primitives"

export type TokenValue = null | boolean | number | string | Callable | Instance | Module | Primitives;
export class Token {
    type: TokenType;
    value: TokenValue;
    line: number;
    rowpos: number;

    constructor(type: TokenType, value: TokenValue, line: number, rowpos: number) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.rowpos = rowpos;
    }

    stringify(): string {
        if (!this.value) return JSON.stringify(this.value);
        return this.value.toString();
    }
}