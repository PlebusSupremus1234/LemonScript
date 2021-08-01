import { LSTypes } from "../constants"
import { LSClass } from "../functions/class"
import { Function } from "../functions/function"
import { Instance } from "../functions/instance"
import { Interpreter } from "../core/interpreter"
import { Token, TokenValue } from "../structures/token"
import { capitilizeFirstLetter, getType } from "../helper"

export type FuncObj = {
    arity(): [number, number],
    call(interpreter: Interpreter, token: Token, args: { token: Token, value: TokenValue }[]): any,
    stringify(): string
};

export type ModuleObj = {
    name: string;
    func: FuncObj;
};

export let Funcs: ModuleObj[] = [
    {
        name: "print",
        func: {
            arity() { return [1, 255]; },
            call(interpreter: Interpreter, token: Token, args: { token: Token, value: TokenValue }[]) {
                let outputs = args.map(i => {
                    let value = i.value;
                    if (value instanceof Function || value instanceof LSClass || value instanceof Instance) value = value.stringify();
                    return value;
                });
                

                console.log(...outputs);
                return null;
            },
            stringify() { return "<nativefunc print>"; }
        }
    },
    {
        name: "typeof",
        func: {
            arity() { return [1, 1]; },
            call(interpreter: Interpreter, token: Token, args: { token: Token, value: TokenValue }[]) {
                return capitilizeFirstLetter(getType(args[0].value));
            },
            stringify() { return "<nativefunc typeof>"; }
        }
    }
];