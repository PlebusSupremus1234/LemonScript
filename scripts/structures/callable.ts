import { Interpreter } from "../core/interpreter";
import { TokenValue } from "./token";

export interface Callable {
    arity: () => number;
    call: (interpreter: Interpreter, args: TokenValue[]) => TokenValue;
}