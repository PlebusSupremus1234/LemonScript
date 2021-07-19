import { Callable } from "./callable"
import { Environment } from "./environment"
import { Func } from "./stmt"
import { Interpreter } from "../core/interpreter"
import { ReturnException } from "./return-exception"
import { Instance } from "./instance"
import { Token } from "./token"

export class Function implements Callable {
    fname: string;
    text: string;
    declaration: Func;
    closure: Environment;
    isInit: boolean;

    constructor(fname: string, text: string, declaration: Func, closure: Environment, isInit: boolean) {
        this.fname = fname;
        this.text = text;
        this.declaration = declaration;
        this.closure = closure;
        this.isInit = isInit;
    }

    bind(token: Token, instance: Instance) {
        let environment = new Environment(this.fname, this.text, this.closure);
        environment.define(new Token("THIS", "this", token.line, token.rowpos), false, instance, "VAR");
        return new Function(this.fname, this.text, this.declaration, environment, this.isInit);
    }

    arity() { return this.declaration.params.length; }

    call(interpreter: Interpreter, args: any[]) {
        let environment = new Environment(this.fname, this.text, this.closure);
        
        for (let i = 0; i < this.declaration.params.length; i++) environment.define(this.declaration.params[i], false, args[i], "FUNCTION");

        try { interpreter.executeBlock(this.declaration.body, environment); }
        catch (e) { if (e instanceof ReturnException) return e.value; }

        return null;
    }

    stringify(): string { return `<func ${this.declaration.name.stringify()}>`; }
}