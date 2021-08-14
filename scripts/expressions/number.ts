import { Method } from "../data/types"
import { Interpreter } from "../core/interpreter"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"

export class LSNumber {
    content: number;
    methods: Map<string, Method>;
    properties: Map<string, TokenValue>;

    constructor(content: number) {
        this.content = content;

        this.methods = initializeMethods(content);
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

function initializeMethods(content: number) {
    let methods = new Map<string, Method>();

    for (let i of numberMethods) {
        methods.set(i.name, {
            name: i.name,
            arguments: i.arguments,
            arity() { return i.arity as [number, number]; },
            stringify() { return `<method ${i.name}>`; },
            call(e: Interpreter, t: Token, args: { token: Token, value: TokenValue }[]) {
                return i.call(content, args, e.errorhandler);
            }
        });
    }

    return methods;
}

let numberMethods = [
    {
        name: "string",
        arguments: [],
        arity: [0, 0],
        call(content: number, args: { token: Token, value: TokenValue }[], e?: ErrorHandler) {
            return content.toString();
        }
    }
];