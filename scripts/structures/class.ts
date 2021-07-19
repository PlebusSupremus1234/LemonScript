import { Callable } from "./callable"
import { Instance } from "./instance"
import { Function } from "./function"

export class LSClass implements Callable {
    name: string;
    methods: Map<string, Function>;

    constructor(name: string, methods: Map<string, Function>) {
        this.name = name;
        this.methods = methods;
    }
    
    findMethod(name: string) {
        if (this.methods.has(name)) {
            let method = this.methods.get(name);
            return method === undefined ? null : method;
        }
        return null;
    }

    call() { return new Instance(this); }

    stringify() { return this.name; }

    arity() { return 0; }
}