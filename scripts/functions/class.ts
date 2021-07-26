import { Callable } from "./callable"
import { Instance } from "./instance"
import { Function } from "./function"
import { Interpreter } from "../core/interpreter"
import { Token, TokenValue } from "../structures/token"

export class LSClass implements Callable {
    name: string;
    superclass: LSClass | null;
    methods: Map<string, Function>;

    constructor(name: string, superclass: LSClass | null, methods: Map<string, Function>) {
        this.name = name;
        this.methods = methods;
        this.superclass = superclass;
    }

    stringify() { return `<class ${this.name}>`; }

    arity() {
        let init = this.findMethod("init");
        return init === null ? 0 : init.arity();
    }

    call(interpreter: Interpreter, token: Token, args: TokenValue[]) {
        let instance = new Instance(this, interpreter.errorhandler);
        let initializer = this.findMethod("init");
        if (initializer !== null) initializer.bind(token, instance, interpreter.errorhandler).call(interpreter, token, args);
        return instance;
    }

    findMethod(name: string): null | Function {
        if (this.methods.has(name)) {
            let method = this.methods.get(name);
            return method === undefined ? null : method;
        }

        if (this.superclass !== null) return this.superclass.findMethod(name);

        return null;
    }
}