import { TokenValue } from "./token";

export class ReturnException {
    value: TokenValue;

    constructor(value: TokenValue) {
        this.value = value;
    }
}