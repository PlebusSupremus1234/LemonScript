import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"
import { ModuleMethodsMap } from "../data/types"

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