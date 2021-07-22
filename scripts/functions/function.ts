import { Callable } from "./callable"
import { Instance } from "./instance"
import { Func } from "../structures/stmt"
import { Token } from "../structures/token"
import { Interpreter } from "../core/interpreter"
import { ReturnException } from "./return-exception"
import { Environment } from "../structures/environment"

export class Function implements Callable {
    fname: string;
    text: string;
    isInit: boolean;
    declaration: Func;
    closure: Environment;

    constructor(fname: string, text: string, declaration: Func, closure: Environment, isInit: boolean) {
        this.fname = fname;
        this.text = text;
        this.declaration = declaration;
        this.closure = closure;
        this.isInit = isInit;
    }

    bind(token: Token, instance: Instance) {
        let environment = new Environment(this.fname, this.text, this.closure);
        environment.define(new Token("SELF", "self", token.line, token.rowpos), false, instance, "VAR");
        return new Function(this.fname, this.text, this.declaration, environment, this.isInit);
    }

    arity() { return this.declaration.params.length; }

    call(interpreter: Interpreter, token: Token, args: any[]) {
        let environment = new Environment(this.fname, this.text, this.closure);        
        for (let i = 0; i < this.declaration.params.length; i++) environment.define(this.declaration.params[i], false, args[i], "VAR");

        try { interpreter.executeBlock(this.declaration.body, environment); }
        catch (e) {
            if (e instanceof ReturnException) return e.value;
            else throw e;
        }
        if (this.isInit) return this.closure.getAt(0, "self");        
        return null;
    }

    stringify(): string { return `<func ${this.declaration.name.stringify()}>`; }
}