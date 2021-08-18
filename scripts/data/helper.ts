import { Callable } from "../functions/callable"
import { Token, TokenValue } from "../structures/token"

export function red(txt: string): string { return `\x1b[31m${txt}\x1b[0m`; }
export function yellow(txt: string): string { return `\x1b[33m${txt}\x1b[0m`; }
export function cyan(txt: string): string { return `\x1b[36m${txt}\x1b[0m`; }
export function blue(txt: string): string { return `\x1b[34m${txt}\x1b[0m`; }
export function bold(txt: string): string { return `\x1b[1m${txt}\x1b[0m`; }

export function capitilizeFirstLetter(txt: string) { return txt.charAt(0).toUpperCase() + txt.slice(1); }

export function isTruthy(value: TokenValue): boolean {
    if (value === 0) return true;
    if (value === "") return true;
    
    if (value) return true;
    else return false;
}

export function isCallable(callee: any): callee is Callable {
    return callee && callee.call && (typeof callee.call === "function") && callee.arity && (typeof callee.arity === "function");
}

export function isEqual(v1: any, v2: any) {
    if (Array.isArray(v1) && Array.isArray(v2)) return JSON.stringify(v1) === JSON.stringify(v2);
    else return v1 === v2;
}

import { Stmt } from "../data/stmt"
import { isExpr, Expr, Visitor } from "../expressions/expr"

export function accept(value: Stmt | Expr, visitor: Visitor<TokenValue>): TokenValue {
    if (isExpr(value)) {
        if (!Array.isArray(value)) return value.accept<TokenValue>(visitor as any);

        let output = [];
        for (let i of value) output.push(accept(i, visitor));
        return output;
    } else return (value as any).accept(visitor);
}

import { Interpreter } from "../core/interpreter"
import { Method, InputMethod, Argument } from "./types"

export function copyMathMethod(name: string, methodname: string, args: Argument[] = [{ name: "num", types: ["Number"] }]) {
    return createMethod({ name, arguments: args, arity: [args.length, args.length],
        call(args: { token: Token, value: TokenValue }[]) { return (Math as any)[methodname](...args.map(i => (i as any).value)); }
    });
}

export function createMethod(obj: InputMethod): Method {
    return {
        name: obj.name,
        arguments: obj.arguments = [{ name: "num", types: ["Number"] }],
        arity() { return obj.arity },
        stringify() { return `<method ${obj.name}>` },
        call(i: Interpreter, t: Token, args: { token: Token, value: TokenValue }[]) { return obj.call(args, i.errorhandler, t); }
    };
}

import { LSTypes } from "./constants"

export function initializeMethods(input: any, content: any, types: LSTypes[], constant: boolean) {
    let methods = new Map<string, Method>();

    for (let i of input) {
        methods.set(i.name, {
            name: i.name,
            arguments: i.arguments as Argument[],
            arity() { return i.arity as [number, number]; },
            stringify() { return `<method ${i.name}>`; },
            call(e: Interpreter, t: Token, args: { token: Token, value: TokenValue }[]) {
                return i.call(content, args, e.errorhandler, types, constant);
            }
        });
    }

    return methods;
}