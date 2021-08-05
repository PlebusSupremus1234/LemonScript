import { ModuleMethod, ModuleMethodsMap, InputMethod, Argument } from "./types"
import { Interpreter } from "../core/interpreter"
import { Token, TokenValue } from "../structures/token"

export class Module {
    name: string;
    methods: ModuleMethodsMap;
    properties: Map<string, TokenValue>;

    constructor(name: string, methods: ModuleMethodsMap, properties: Map<string, TokenValue>) {
        this.name = name;
        this.methods = methods;
        this.properties = properties;
    }

    get(name: string) {
        let result = this.properties.get(name);
        if (result) return result;

        result = this.methods.get(name);
        if (!result) return null;
        else return result;
    }
}

export function copyMathMethod(name: string, methodname: string, args: Argument[] = [{ name: "num", types: ["Number"] }]) {
    return createMethod({ name, arguments: args, arity: [args.length, args.length],
        call(args: { token: Token, value: TokenValue }[]) {
            return (Math as any)[methodname](...args.map(i => (i as any).value));
        }
    });
}

export function createMethod(obj: InputMethod): ModuleMethod {
    return {
        name: obj.name,
        arguments: obj.arguments = [{ name: "num", types: ["Number"] }],
        arity() { return obj.arity },
        stringify() { return `<func ${obj.name}>` },
        call(i: Interpreter, t: Token, args: { token: Token, value: TokenValue }[]) { return obj.call(args, i.errorhandler, t); }
    };
}