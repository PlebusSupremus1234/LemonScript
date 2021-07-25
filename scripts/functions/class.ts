import { Callable } from "./callable"
import { Instance } from "./instance"
import { Function } from "./function"
import { Interpreter } from "../core/interpreter"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"

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

    call(interpreter: Interpreter, token: Token, args: TokenValue[], errorhandler: ErrorHandler) {
        let instance = new Instance(this, errorhandler);
        let initializer = this.findMethod("init");
        if (initializer !== null) initializer.bind(token, instance, errorhandler).call(interpreter, token, args, errorhandler);
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