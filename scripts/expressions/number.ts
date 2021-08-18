import { Method } from "../data/types"
import { initializeMethods } from "../data/helper"

import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"

export class LSNumber {
    content: number;
    methods: Map<string, Method>;
    properties: Map<string, TokenValue>;

    constructor(content: number) {
        this.content = content;

        this.methods = initializeMethods(NumberMethods, content, ["Any"], false);
        this.properties = initializeProperties(content);
    }

    get(name: string) {
        let result = this.properties.get(name);
        if (result) return result;

        result = this.methods.get(name);
        return result ? result : null;
    }
}

function initializeProperties(content: number) {
    let p: Map<string, TokenValue> = new Map();

    return p;
}

let NumberMethods = [
    { name: "string", arguments: [], arity: [0, 0],
        call(content: number, args: { token: Token, value: TokenValue }[], e?: ErrorHandler) { return content.toString(); }
    }
];