import { LSTypes } from "./constants"
import { Callable } from "../functions/callable"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"

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

export function getType(type: TokenValue): string {
    if (type === null || type === "null") return "null";
    else if (Array.isArray(type)) return "array";
    else return typeof type;
}

export function checkType(types: LSTypes[], type: TokenValue) {
    if (types.includes("Any")) return true;
    
    if ((!types.includes("Number") && typeof type === "number") ||
        (!types.includes("String") && typeof type === "string") ||
        (!types.includes("Boolean") && typeof type === "boolean") ||
        (!types.includes("Null") && type === null) ||
        !types.includes("Array") && Array.isArray(type)) return false;

    return true;
}

export function checkArgType(name: string, types: LSTypes[], arg: any, errorhandler: ErrorHandler) {
    if (arg && !checkType(types, arg.value)) {
        let expected = types.join(" | ");
        let text = `Expected type ${expected} for argument '${name}' but recieved type ${capitilizeFirstLetter(getType(arg.value))} on line ${arg.token.line}`;
        throw errorhandler.newError("Invalid Function Call", text, arg.token.line, arg.token.rowpos);
    }
}

export function isEqual(v1: any, v2: any) {
    if (Array.isArray(v1) && Array.isArray(v2)) return JSON.stringify(v1) === JSON.stringify(v2);
    else return v1 === v2;
}

import { Interpreter } from "../core/interpreter"
import { Method, InputMethod, Argument } from "./types"

export function copyMathMethod(name: string, methodname: string, args: Argument[] = [{ name: "num", types: ["Number"] }]) {
    return createMethod({ name, arguments: args, arity: [args.length, args.length],
        call(args: { token: Token, value: TokenValue }[]) {
            return (Math as any)[methodname](...args.map(i => (i as any).value));
        }
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