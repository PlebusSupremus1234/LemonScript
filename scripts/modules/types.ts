import { LSTypes } from "../constants"
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