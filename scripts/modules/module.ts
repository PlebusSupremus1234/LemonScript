import { Interpreter } from "../core/interpreter"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"
import { Method, ModuleMethodsMap, InputMethod, Argument } from "./types"

export class Module {
    name: string;
    methods: ModuleMethodsMap;
    properties: Map<string, TokenValue>;

    constructor(name: string, methods: ModuleMethodsMap, properties: Map<string, TokenValue>) {
        this.name = name;
        this.methods = methods;
        this.properties = properties;
    }

    get(name: Token, errorhandler: ErrorHandler) {
        let result = this.properties.get(name.stringify());
        if (result) return result;

        result = this.methods.get(name.stringify());
        if (result) return result;

        throw errorhandler.newError(
            "Property Error",
            `Property '${name.stringify()}' does not exist on module '${this.name}' on line ${name.line}`,
            name.line, name.rowpos
        );
    }

    stringify() { return `<module ${this.name}>`; }
}

export function copyMathMethod(name: string, methodname: string, args: Argument[] = [{ name: "num", types: ["Number"] }]) {
    return createMethod({ name, arguments: args, arity: [args.length, args.length],
        call(args: { token: Token, value: TokenValue }[]) {
            return (Math as any)[methodname](...args.map(i => (i as any).value));
        }
    });
}

export function createMethod(obj: InputMethod): Method {
    return {
        name: obj.name,
        arguments: obj.arguments = [{ name: "num", types: ["Number"] }],
        arity() { return obj.arity },
        stringify() { return `<func ${obj.name}>` },
        call(i: Interpreter, t: Token, args: { token: Token, value: TokenValue }[]) { return obj.call(args, i.errorhandler, t); }
    };
}