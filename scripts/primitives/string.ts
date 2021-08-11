import { Method } from "../modules/types"
import { Interpreter } from "../core/interpreter"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"

export class LSString {
    content: string;
    methods: Map<string, Method>;
    properties: Map<string, TokenValue>;

    constructor(content: string) {
        this.content = content;

        this.methods = initializeMethods(content);
        this.properties = initializeProperties(content);
    }

    get(name: string | number) {
        if (typeof name === "number") return this.content[name];
        else {
            let result = this.properties.get(name);
            if (result) return result;

            result = this.methods.get(name);
            return result ? result : null;
        }
    }

    stringify() { return this.content; }
}

function initializeProperties(content: string) {
    let p: Map<string, TokenValue> = new Map();

    p.set("length", content.length);
    return p;
}

function initializeMethods(content: string) {
    let methods = new Map<string, Method>();

    for (let i of StringMethods) {
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

let StringMethods = [
    {
        name: "index",
        arguments: [{ name: "string", types: ["String"] }],
        arity: [1, 1],
        call(content: string, args: { token: Token, value: TokenValue }[]) {
            let output = content.indexOf((args[0] as any).value);
            return output === -1 ? null : output;
        }
    },
    {
        name: "trim",
        arguments: [{ name: "character", types: ["String"] }],
        arity: [0, 1],
        call(content: string, args: { token: Token, value: TokenValue }[], e: ErrorHandler) {
            if (args.length === 0) return content.trim();
            else {
                let trim = (args[0] as any).value;

                if (trim.length !== 1) {
                    let token = (args[0] as any).token;
                    throw e.newError("Invalid Function Call", `Expected a single character on line ${token.line}`, token.line, token.rowpos);
                }

                let output = content;

                while (output[0] === trim) output = output.substring(1);
                while (output[output.length - 1] === trim) output = output.substring(0, output.length - 1);

                return output;
            }
        }
    },
    { name: "upper", arguments: [], arity: [0, 0], call(content: string, args: { token: Token, value: TokenValue }[]) { return content.toUpperCase(); } },
    { name: "lower", arguments: [], arity: [0, 0], call(content: string, args: { token: Token, value: TokenValue }[]) { return content.toLowerCase(); } },
    {
        name: "substr",
        arguments: [{ name: "min", types: ["Number"] }, { name: "max", types: ["Number"] }],
        arity: [1, 2],
        call(content: string, args: { token: Token, value: TokenValue }[], e: ErrorHandler) {
            let min = (args[0] as any).value;
            let max = args.length === 1 ? content.length : (args[1] as any).value;
            let token: null | Token = null;

            if (min % 1 !== 0) token = (args[0] as any).token;
            else if (max % 1 !== 0) token = (args[1] as any).token;
            if (token) throw e.newError("Invalid Function Call", `Expected an integer on line ${token.line}`, token.line, token.rowpos);

            if (min < 0) min = content.length + min;
            if (max < 0) max = content.length + max;

            token = (args[0] as any).token;
            if ((min < 0 || min > content.length) && token) throw e.newError("Invalid Function Call", `Min index out of range on line ${token.line}`, token.line, token.rowpos);
            token = args[1] ? (args[1] as any).token : null;
            if ((max < 0 || max > content.length) && token) throw e.newError("Invalid Function Call", `Max index out of range on line ${token.line}`, token.line, token.rowpos);

            token = (args[0] as any).token;
            if (min > max && token) throw e.newError("Invalid Function Call", `Min index is greater than max index on line ${token.line}`, token.line, token.rowpos);

            return content.substring(min, max);
        }
    },
    {
        name: "replace",
        arguments: [{ name: "search", types: ["String"] }, { name: "replace", types: ["String"] }],
        arity: [2, 2],
        call(content: string, args: { token: Token, value: TokenValue }[]) {
            let search = (args[0] as any).value;
            let replace = (args[1] as any).value;

            return content.replace(new RegExp(search, "g"), replace);
        }
    },
    {
        name: "get",
        arguments: [{ name: "index", types: ["Number"] }],
        arity: [1, 1],
        call(content: string, args: { token: Token, value: TokenValue }[], e: ErrorHandler) {
            let index = (args[0] as any).value;
            let token = (args[0] as any).token;

            if (index % 1 !== 0) throw e.newError("Invalid Function Call", `Expected a whole integer on line ${token.line}`, token.line, token.rowpos);

            if (index < 0) index = content.length + index;
            if (index >= content.length) throw e.newError("Invalid Function Call", `Index out of range on line ${token.line}`, token.line, token.rowpos);

            return content[index];
        }
    }
];