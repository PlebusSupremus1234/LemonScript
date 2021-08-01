import { ModuleType } from "./types"
import { Interpreter } from "../core/interpreter"
import { Token, TokenValue } from "../structures/token"

export let Modules: ModuleType = {
    "random": {
        name: "random",
        methods: [
            {
                name: "random",
                arguments: [{ name: "min", types: ["Number"] }, { name: "max", types: ["Number"] }],
                arity() { return [0, 2]; },
                call(interpreter: Interpreter, token: Token, args: { token: Token, value: TokenValue }[]) {
                    if (args.length === 1) {
                        let text = `Expected a max value on line ${token.line}`;
                        throw interpreter.errorhandler.newError("Invalid Function Call", text, token.line, token.rowpos);
                    }

                    let min = args[0] ? (args[0].value as number) : 0;
                    let max = args[1] ? (args[1].value as number) : 1;
                    if (min > max) [min, max] = [max, min];

                    return Math.random() * (max - min) + min;
                },
                stringify() { return "<func random>"; }
            },
            {
                name: "randint",
                arguments: [{ name: "min", types: ["Number"] }, { name: "max", types: ["Number"] }],
                arity() { return [2, 2]; },
                call(interpreter: Interpreter, token: Token, args: { token: Token, value: TokenValue }[]) {
                    for (let i = 0; i < args.length; i++) {
                        if (args[i].value as any % 1 !== 0) {
                            let text = `Expected an integer value on line ${args[i].token.line}`;
                            throw interpreter.errorhandler.newError("Invalid Function Call", text, args[i].token.line, args[i].token.rowpos);
                        }
                    }

                    let min = args[0].value as number;
                    let max = args[1].value as number;
                    if (min > max) [min, max] = [max, min];

                    return Math.floor(Math.random() * (max - min + 1) + min);
                },
                stringify() { return "<func randint>"; }
            },
            {
                name: "randomGaussian",
                arguments: [{ name: "mean", types: ["Number"] }, { name: "standarddev", types: ["Number"] }],
                arity() { return [0, 2]; },
                call(interpreter: Interpreter, token: Token, args: { token: Token, value: TokenValue }[]) {
                    let mean = args[0] ? args[0].value as number : 0;
                    let standarddev = args[1] ? args[1].value as number : 1;

                    // Using Box Muller Implementation
                    let u1 = 1 - Math.random();
                    let u2 = 1 - Math.random();
                    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * standarddev + mean;
                },
                stringify() { return "<func randomGaussian>"; }
            }
        ]
    }
};