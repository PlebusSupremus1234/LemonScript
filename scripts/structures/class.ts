import { Callable } from "./callable"
import { Instance } from "./instance"
import { Function } from "./function"
import { Token, TokenValue } from "./token"
import { Interpreter } from "../core/interpreter"

export class LSClass implements Callable {
    name: string;
    methods: Map<string, Function>;

    constructor(name: string, methods: Map<string, Function>) {
        this.name = name;
        this.methods = methods;
    }

    stringify() { return this.name; }

    arity() {
        let init = this.findMethod("init");
        return init == null ? 0 : init.arity();
    }

    call(interpreter: Interpreter, token: Token, args: TokenValue[]) {
        let instance = new Instance(this);
        let initializer = this.findMethod("init");
        if (initializer !== null) initializer.bind(token, instance).call(interpreter, token, args);
        return instance;
    }

    findMethod(name: string) {
        if (this.methods.has(name)) {
            let method = this.methods.get(name);
            return method === undefined ? null : method;
        }
        return null;
    }
}