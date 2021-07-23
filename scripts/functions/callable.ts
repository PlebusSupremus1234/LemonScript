import { Interpreter } from "../core/interpreter"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"

export interface Callable {
    arity: () => number;
    call: (interpreter: Interpreter, token: Token, args: TokenValue[], errorhandler: ErrorHandler) => TokenValue;
    stringify: () => string;
}