import { ModuleType } from "../types"
import { copyMathMethod, createMethod } from "../helper"
import { Token, TokenValue } from "../../structures/token"
import { ErrorHandler } from "../../structures/errorhandler"

export let MathModule: ModuleType = {
    name: "math",
    properties: [
        { name: "PI", value: Math.PI },
        { name: "E", value: Math.E },
        { name: "PHI", value: (Math.sqrt(5) + 1) / 2 },
        { name: "SQRT2", value: Math.SQRT2 }
    ],
    methods: [
        copyMathMethod("absolute", "abs"),

        copyMathMethod("round", "round"),
        copyMathMethod("floor", "floor"),
        copyMathMethod("ceil", "ceil"),

        copyMathMethod("sin", "sin"),
        copyMathMethod("cos", "cos"),
        copyMathMethod("tan", "tan"),
        copyMathMethod("asin", "asin"),
        copyMathMethod("acos", "acos"),
        copyMathMethod("atan", "atan"),

        createMethod({ name: "radtodeg", arity: [1, 1],
            call(args: { token: Token, value: TokenValue }[]) { return (args[0] as any).value * 180 / Math.PI; }
        }),
        createMethod({ name: "degtorad", arity: [1, 1],
            call(args: { token: Token, value: TokenValue }[]) { return (args[0] as any).value * Math.PI / 180; }
        }),

        createMethod({ name: "min", arity: [1, 255],
            call(args: { token: Token, value: TokenValue }[]) { return Math.min(...args.map(i => i.value as any)); }
        }),
        createMethod({ name: "max", arity: [1, 255],
            call(args: { token: Token, value: TokenValue }[]) { return Math.max(...args.map(i => i.value as any)); }
        }),

        createMethod({ name: "log", arguments: [{ name: "num", types: ["Number"] }, { name: "base", types: ["Number"] }], arity: [1, 2],
            call(args: { token: Token, value: TokenValue }[]) {
                let num = (args[0] as any).value;
                let base = args[1] ? (args[1] as any).value : Math.E;

                return Math.log(num) / Math.log(base);
            }
        }),
        createMethod({ name: "sqrt", arity: [1, 1],
            call(args: { token: Token, value: TokenValue }[], e: ErrorHandler) {
                let num = (args[0] as any).value;
                if (num < 0) {
                    let token = (args[0] as any).token;
                    let text = `Cannot take root of a negative number on line ${token.line}`;
                    throw e.newError("Math Error", text, token.line, token.rowpos);
                }

                return Math.sqrt(num);
            }
        }),
        createMethod({ name: "factorial", arity: [1, 1],
            call(args: { token: Token, value: TokenValue }[], e: ErrorHandler) {
                let num = (args[0] as any).value;
                let token = (args[0] as any).token;

                if (num < 0) throw e.newError("Math Error", `Cannot take factorial of a negative number on line ${token.line}`, token.line, token.rowpos);
                if (num % 1 !== 0) throw e.newError("Math Error", `Cannot take factorial of a float on line ${token.line}`, token.line, token.rowpos);

                let res = 1;
                for (let i = 2; i <= num; i++) res *= i;

                return res;
            }
        }),
        createMethod({ name: "power", arguments: [{ name: "num", types: ["Number"] }, { name: "power", types: ["Number"] }], arity: [2, 2],
            call(args: { token: Token, value: TokenValue }[], e: ErrorHandler) {
                let num = (args[0] as any).value;
                let power = (args[1] as any).value;

                if (num < 0 && power < 1 && power > 0) {
                    let token = (args[0] as any).token;
                    let text = `Cannot take root of a negative number on line ${token.line}`;
                    throw e.newError("Math Error", text, token.line, token.rowpos);
                }

                return Math.pow(num, power);
            }
        }),
        createMethod({ name: "root", arguments: [{ name: "num", types: ["Number"] }, { name: "root", types: ["Number"] }], arity: [2, 2],
            call(args: { token: Token, value: TokenValue }[], e: ErrorHandler) {
                let num = (args[0] as any).value;
                let power = (args[1] as any).value;

                if (num < 0) {
                    let token = (args[0] as any).token;
                    let text = `Cannot take root of a negative number on line ${token.line}`;
                    throw e.newError("Math Error", text, token.line, token.rowpos);
                }

                return Math.pow(num, 1 / power);
            }
        }),
        createMethod({ name: "dist", arity: [4, 4], arguments: [{ name: "x1", types: ["Number"] }, { name: "y1", types: ["Number"] },
        { name: "x2", types: ["Number"] }, { name: "y2", types: ["Number"] }],
            call(args: { token: Token, value: TokenValue }[]) {
                let x1 = (args[0] as any).value;
                let y1 = (args[1] as any).value;
                let x2 = (args[2] as any).value;
                let y2 = (args[3] as any).value;

                return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            }
        })
    ]
};