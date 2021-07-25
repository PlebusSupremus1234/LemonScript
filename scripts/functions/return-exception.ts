import { Token, TokenValue } from "../structures/token";

export class ReturnException {
    keyword: Token;
    value: TokenValue;
    token: null | Token;

    constructor(value: TokenValue, keyword: Token, token: null | Token) {
        this.value = value;
        this.token = token;
        this.keyword = keyword;
    }
}