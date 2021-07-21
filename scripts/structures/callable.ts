import { Interpreter } from "../core/interpreter";
import { Token, TokenValue } from "./token";

export interface Callable {
    arity: () => number;
    call: (interpreter: Interpreter, token: Token, args: TokenValue[]) => TokenValue;
    stringify: () => string;
}