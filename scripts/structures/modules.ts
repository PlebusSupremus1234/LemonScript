import { ModuleObj } from "./funcs"
import { Interpreter } from "../core/interpreter"
import { Token, TokenValue } from "../structures/token"

type ModuleType = {
    [name: string]: {
        name: string;
        methods: ModuleObj[];
    };
};

export let Modules: ModuleType = {
    "random": {
        name: "random",
        methods: [
            {
                name: "randint",
                func: {
                    arity() { return [2, 2]; },
                    call(interpreter: Interpreter, token: Token, args: { token: Token, value: TokenValue }[]) {
                        return "test"
                    },
                    stringify() { return "<func randint>"; }
                }
            }
        ]
    }
};