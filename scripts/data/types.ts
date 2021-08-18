import { LSTypes } from "./constants"
import { Callable } from "../functions/callable"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"

export type Argument = {
    name: string;
    types: LSTypes[];
};

export type Method = {
    name: string;
    arguments: Argument[];
} & Callable;

export type ModuleMethodsMap = Map<string, Method>;

type PropetyType = {
    name: string;
    value: TokenValue;
};

export type ModuleType = {
    name: string;
    properties: PropetyType[];
    methods: Method[];
};

export type ModuleObj = { [name: string]: ModuleType; }

export type InputMethod = {
    name: string;
    arguments?: Argument[];
    arity: [number, number];
    call: (args: { token: Token, value: TokenValue }[], errorhandler: ErrorHandler, token: Token) => TokenValue;
};

// Functions
import { capitilizeFirstLetter } from "./helper"

export function getType(value: TokenValue): string {
    if (value === null) return "null";
    else if (Array.isArray(value)) return "array";
    else return typeof value;
}

export function displayTypes(types: LSTypes[]): string {
    let output: string[] = [];

    for (let i of types) {
        if (Array.isArray(i)) output.push(`Array<${displayTypes(i)}>`);
        else output.push(i);
    }

    return output.join(" | ");
}

export function displayTypesPrimative(value: TokenValue, t = false): string {
    if (Array.isArray(value)) {
        let types: (string | TokenValue)[] = [];

        for (let i of value) {
            if (Array.isArray(i)) types.push(i);
            else {
                let type = capitilizeFirstLetter(getType(i));
                if (!types.includes(type)) types.push(type);
            }
        }

        return `Array<${types.map(i => displayTypesPrimative(i, true)).join(" | ")}>`;
    } else return t ? value as string : capitilizeFirstLetter(getType(value));
}

export function checkType(types: LSTypes[], value: TokenValue): boolean {
    let type = typeof value;
    
    for (let i = 0; i < types.length; i++) {
        if (types[i] === "Any" ||
            (type === "number" && types[i] === "Number") ||
            (type === "string" && types[i] === "String") ||
            (type === "boolean" && types[i] === "Boolean") ||
            (value === null && types[i] === "Null")
        ) return true;

        if (Array.isArray(types[i])) {
            if (!Array.isArray(value)) return false;

            let valid = true;
            for (let j of value) {
                if (!checkType(types[i] as LSTypes[], j)) valid = false;
            }

            return valid;
        }
    }

    return false;
}

export function checkArgType(name: string, types: LSTypes[], arg: any, errorhandler: ErrorHandler) {
    if (arg && !checkType(types, arg.value)) {
        let expected = displayTypes(types);
        let text = `Expected type ${expected} for argument '${name}' but recieved type ${displayTypesPrimative(arg.value)} on line ${arg.token.line}`;
        throw errorhandler.newError("Invalid Function Call", text, arg.token.line, arg.token.rowpos);
    }
}