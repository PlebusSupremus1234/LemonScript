import { Interpreter } from "../core/interpreter"
import { Token, TokenValue } from "../structures/token"

export interface Callable {
    arity: () => [number, number];
    call: (interpreter: Interpreter, token: Token, args: any[]) => TokenValue;
    stringify: () => string;
}