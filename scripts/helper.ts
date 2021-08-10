import { LSTypes } from "./constants"
import { Callable } from "./functions/callable"
import { TokenValue } from "./structures/token"
import { ErrorHandler } from "./structures/errorhandler"

export function red(txt: string): string { return `\x1b[31m${txt}\x1b[0m`; }
export function yellow(txt: string): string { return `\x1b[33m${txt}\x1b[0m`; }
export function cyan(txt: string): string { return `\x1b[36m${txt}\x1b[0m`; }
export function blue(txt: string): string { return `\x1b[34m${txt}\x1b[0m`; }
export function bold(txt: string): string { return `\x1b[1m${txt}\x1b[0m`; }

export function capitilizeFirstLetter(txt: string) { return txt.charAt(0).toUpperCase() + txt.slice(1); }

export function isTruthy(value: TokenValue): boolean {
    if (value === 0) return true;
    
    if (value) return true;
    else return false;
}

export function isCallable(callee: any): callee is Callable {
    return callee && callee.call && (typeof callee.call === "function") && callee.arity && (typeof callee.arity === "function");
}

export function getType(type: TokenValue): string {
    if (type === null || type === "null") return "null";
    else return typeof type;
}

export function checkType(types: LSTypes[], type: TokenValue) {
    if (types.includes("Any")) return true;
    
    if ((!types.includes("Number") && typeof type === "number") ||
        (!types.includes("String") && typeof type === "string") ||
        (!types.includes("Boolean") && typeof type === "boolean") ||
        (!types.includes("Null") && type === null)) return false;

    return true;
}

export function checkArgType(name: string, types: LSTypes[], arg: any, errorhandler: ErrorHandler) {
    if (arg && !checkType(types, arg.value)) {
        let expected = types.join(" | ");
        let text = `Expected type ${expected} for argument '${name}' but recieved type ${capitilizeFirstLetter(getType(arg.value))} on line ${arg.token.line}`;
        throw errorhandler.newError("Invalid Function Call", text, arg.token.line, arg.token.rowpos);
    }
}