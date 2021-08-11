import { Instance } from "./instance"
import { Callable } from "./callable"
import { LSTypes } from "../constants"
import { Func } from "../visitors/stmt"
import { Token } from "../structures/token"
import { Interpreter } from "../core/interpreter"
import { ReturnException } from "./return-exception"
import { Environment } from "../structures/environment"
import { ErrorHandler } from "../structures/errorhandler"
import { getType, checkType, capitilizeFirstLetter, checkArgType } from "../helper"

export type FuncArgs = {
    name: Token;
    types: LSTypes[];
    optional: boolean;
};

export class Function implements Callable {
    isInit: boolean;
    declaration: Func;
    closure: Environment;
    returntypes: LSTypes[];

    constructor(declaration: Func, closure: Environment, isInit: boolean, returntypes: LSTypes[]) {
        this.isInit = isInit;
        this.closure = closure;
        this.declaration = declaration;
        this.returntypes = returntypes;
    }

    bind(token: Token, instance: Instance, errorhandler: ErrorHandler) {
        let environment = new Environment(this.closure, errorhandler);
        environment.define(new Token("SELF", "self", token.line, token.rowpos), false, instance, "VAR", ["Any"]);
        return new Function(this.declaration, environment, this.isInit, this.returntypes);
    }

    arity(): [number, number] {
        let optional = this.declaration.params.filter(i => i.optional).length;
        return [this.declaration.params.length - optional, this.declaration.params.length];
    }

    call(interpreter: Interpreter, token: Token, args: any[]) {
        let environment = new Environment(this.closure, interpreter.errorhandler);

        for (let i = 0; i < this.declaration.params.length; i++) {
            let param = this.declaration.params[i];
            checkArgType(param.name.stringify(), param.types, args[i], interpreter.errorhandler);
            
            environment.define(param.name, false, args[i] ? args[i].value : null, "VAR", ["Any"]);
        }

        try { interpreter.executeBlock(this.declaration.body, environment); }
        catch (e) {
            if (e instanceof ReturnException) {
                if (!checkType(this.returntypes, e.value)) {
                    let text: string;
                    let t: Token;
                    if (e.token) {
                        t = e.token;
                        let type = capitilizeFirstLetter(getType(e.value));
                        text = `Expected return type ${this.returntypes.join(" | ")}, but got type ${type} on line ${t.line}`;
                    } else {
                        t = e.keyword;
                        text = `Expected return type ${this.returntypes.join(" | ")} but didn't recieve a return value on line ${t.line}`;
                    }
                    throw interpreter.errorhandler.newError("Invalid Function Declaration", text, t.line, t.rowpos);
                }
                return e.value;
            } else throw e;
        }

        if (this.isInit) return this.closure.getAt(0, "self");        
        
        if (!checkType(this.returntypes, null)) {
            let t = this.declaration.name;
            let text = `Expected return type ${this.returntypes.join(" | ")} but didn't recieve any for function '${t.value}' on line ${t.line}`;
            throw interpreter.errorhandler.newError("Invalid Function Declaration", text, t.line, t.rowpos);
        }

        return null;
    }

    stringify(): string { return `<func ${this.declaration.name.stringify()}>`; }
}