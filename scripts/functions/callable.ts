import { Interpreter } from "../core/interpreter";
import { Token, TokenValue } from "../structures/token";

export interface Callable {
    arity: () => number;
    call: (interpreter: Interpreter, token: Token, args: TokenValue[]) => TokenValue;
    stringify: () => string;
}