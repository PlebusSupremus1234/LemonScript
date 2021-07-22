import { TokenValue } from "../structures/token";

export class ReturnException {
    value: TokenValue;

    constructor(value: TokenValue) {
        this.value = value;
    }
}