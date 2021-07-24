import { Callable } from "./callable"
import { Instance } from "./instance"
import { Func } from "../structures/stmt"
import { Token } from "../structures/token"
import { Interpreter } from "../core/interpreter"
import { ReturnException } from "./return-exception"
import { Environment } from "../structures/environment"
import { ErrorHandler } from "../structures/errorhandler"

export class Function implements Callable {
    isInit: boolean;
    declaration: Func;
    closure: Environment;

    constructor(declaration: Func, closure: Environment, isInit: boolean) {
        this.isInit = isInit;
        this.closure = closure;
        this.declaration = declaration;
    }

    bind(token: Token, instance: Instance, errorhandler: ErrorHandler) {
        let environment = new Environment(this.closure, errorhandler);
        environment.define(new Token("SELF", "self", token.line, token.rowpos), false, instance, null, "VAR");
        return new Function(this.declaration, environment, this.isInit);
    }

    arity() { return this.declaration.params.length; }

    call(interpreter: Interpreter, token: Token, args: any[], errorhandler: ErrorHandler) {
        let environment = new Environment(this.closure, errorhandler);
        for (let i = 0; i < this.declaration.params.length; i++) environment.define(this.declaration.params[i], false, args[i], null, "VAR");

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