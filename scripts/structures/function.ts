import { Callable } from "./callable"
import { Environment } from "./environment"
import { Func } from "./stmt"
import { Interpreter } from "../core/interpreter"
import { ReturnException } from "./return-exception"

export class Function implements Callable {
    fname: string;
    declaration: Func;
    closure: Environment;

    constructor(fname: string, declaration: Func, closure: Environment) {
        this.fname = fname;
        this.declaration = declaration;
        this.closure = closure;
    }

    arity() {
        return this.declaration.params.length;
    }

    call(interpreter: Interpreter, args: any[]) {
        let environment = new Environment(this.fname, this.closure);
        
        for (let i = 0; i < this.declaration.params.length; i++) environment.define(this.declaration.params[i].stringify(), args[i]);

        try {
            interpreter.executeBlock(this.declaration.body, environment);
        } catch (e) {
            if (e instanceof ReturnException) return e.value;
        }
        return null;
    }

    stringify(): string {
        return `<func ${this.declaration.name.stringify()}>`;
    }
}