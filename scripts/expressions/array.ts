import { isEqual, getType } from "../data/helper"
import { Interpreter } from "../core/interpreter"
import { Argument, Method } from "../data/types"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"

export class LSArray {
    content: TokenValue[];
    methods: Map<string, Method>;
    properties: Map<string, TokenValue>;

    constructor(content: TokenValue[]) {
        this.content = content;

        this.methods = initializeMethods(content);
        this.properties = initializeProperties(content);
    }

    get(name: string): TokenValue {
        let result = this.properties.get(name);
        if (result) return result;
        
        result = this.methods.get(name);
        return result ? result : null;
    }
}

function initializeProperties(content: TokenValue[]) {
    let p: Map<string, TokenValue> = new Map();

    p.set("length", content.length);
    return p;
}

function initializeMethods(content: TokenValue[]) {
    let methods = new Map<string, Method>();

    for (let i of ArrayMethods) {
        methods.set(i.name, {
            name: i.name,
            arguments: i.arguments as Argument[],
            arity() { return i.arity as [number, number]; },
            stringify() { return `<method ${i.name}>`; },
            call(e: Interpreter, t: Token, args: { token: Token, value: TokenValue }[]) {
                return i.call(content, args, e.errorhandler);
            }
        });
    }

    return methods;
}

let ArrayMethods = [
    { name: "get", arguments: [{ name: "index", types: ["Number"] }], arity: [1, 1],
        call(content: TokenValue[], args: { token: Token, value: TokenValue }[], e: ErrorHandler) {
            let index = (args[0] as any).value;
            let token = (args[0] as any).token;

            if (index % 1 !== 0) throw e.newError("Invalid Function Call", `Expected a whole integer on line ${token.line}`, token.line, token.rowpos);

            if (index < 0) index = content.length + index;
            if (index >= content.length) {
                e.newError("Invalid Function Call", `Index out of range on line ${token.line}`, token.line, token.rowpos);
                throw e.newHelp("Indices in LemonScript start at 0");
            }

            return content[index];
        }
    },
    { name: "join", arguments: [{ name: "joiner", types: ["String"] }], arity: [1, 1],
        call(content: TokenValue[], args: { token: Token, value: TokenValue }[]) {
            return content.join(args[0].value as string);
        }
    },
    { name: "push", arguments: [], arity: [1, 255],
        call(content: TokenValue[], args: { token: Token, value: TokenValue }[]) {
            content.push(...args.map(i => i.value));
            return null;
        }
    },
    { name: "pop", arguments: [], arity: [0, 0],
        call(content: TokenValue[]) {
            let output = content.pop();
            return output ? output : null;
        }
    },
    { name: "index", arguments: [{ name: "value", types: ["Any"] }], arity: [1, 1],
        call(content: TokenValue[], args: { token: Token, value: TokenValue }[]) {
            for (let i = 0; i < content.length; i++) {
                if (isEqual(content[i], args[0].value)) return i;
            }

            return null;
        }
    },
    { name: "sort", arguments: [], arity: [0, 0],
        call(content: TokenValue[]) {
            let sorted = content.sort((a, b) => (a as any) - (b as any));
            let strings = sorted.filter(i => typeof i === "string").sort((a, b) => (a as string).localeCompare(b as string));
            
            return [
                ...sorted.filter(i => typeof i === "number"),
                ...strings,
                ...sorted.filter(i => i === null),
                ...sorted.filter(i => typeof i === "boolean")
            ];
        }
    },
    { name: "contains", arguments: [{ name: "element", types: ["Any"] }], arity: [1, 1],
        call(content: TokenValue[], args: { token: Token, value: TokenValue }[]) {
            for (let i = 0; i < content.length; i++) {
                if (isEqual(content[i], args[0].value)) return true;
            }
            return false;
        }
    },
    { name: "reverse", arguments: [], arity: [0, 0],
        call(content: TokenValue[], args: { token: Token, value: TokenValue }[]) {
            let temp = JSON.parse(JSON.stringify(content));
            return temp.reverse();
        }
    },
    { name: "remove", arguments: [{ name: "value", types: ["Any"] }], arity: [1, 1],
        call(content: TokenValue[], args: { token: Token, value: TokenValue }[]) {
            let arg = args[0].value;
            
            for (let i = 0; i < content.length; i++) {
                if (!content[i]) break;
                if (isEqual(content[i], arg)) {
                    content.splice(i, 1);
                    i--;
                }
            }

            return null;
        }
    },
    { name: "slice", arguments: [{ name: "min", types: ["Number"] }, { name: "max", types: ["Number"] }], arity: [1, 2],
        call(content: TokenValue[], args: { token: Token, value: TokenValue }[], e: ErrorHandler) {
            let min = (args[0] as any).value;
            let max = args.length === 1 ? content.length : (args[1] as any).value;
            let token: null | Token = null;

            if (min % 1 !== 0) token = (args[0] as any).token;
            else if (max % 1 !== 0) token = (args[1] as any).token;
            if (token) throw e.newError("Invalid Function Call", `Expected an integer on line ${token.line}`, token.line, token.rowpos);

            if (min < 0) min = content.length + min;
            if (max < 0) max = content.length + max;

            token = (args[0] as any).token;
            let errored = false;

            if ((min < 0 || min > content.length) && token) {
                e.newError("Invalid Function Call", `Min index out of range on line ${token.line}`, token.line, token.rowpos);
                errored = true;
            }
            token = args[1] ? (args[1] as any).token : null;
            if ((max < 0 || max > content.length) && token) {
                e.newError("Invalid Function Call", `Max index out of range on line ${token.line}`, token.line, token.rowpos);
                errored = true;
            }

            if (errored) throw e.newHelp("Indices in LemonScript start at 0");

            token = (args[0] as any).token;
            if (min > max && token) throw e.newError("Invalid Function Call", `Min index is greater than max index on line ${token.line}`, token.line, token.rowpos);

            return content.slice(min, max);
        }
    },
    { name: "set", arguments: [{ name: "index", types: ["Any"] }, { name: "value", types: ["Any"] }], arity: [2, 2],
        call(content: TokenValue[], args: { token: Token, value: TokenValue }[], e: ErrorHandler) {
            let index = args[0].value;
            let value = args[1].value;

            if (index && index > content.length - 1) {
                let token = args[0].token;
                e.newError("Invalid Function Call", `Index out of range on line ${token.line}`, token.line, token.rowpos);
                throw e.newHelp("Indices in LemonScript start at 0");
            }

            content.splice(index as number, 1, value);

            return null;
        }
    },
    { name: "concat", arguments: [{ name: "array", types: ["Any"] }], arity: [1, 1],
        call(content: TokenValue[], args: { token: Token, value: TokenValue }[], e: ErrorHandler) {
            let token = args[0].token;

            if (getType(args[0].value) !== "array") {
                e.newError("Invalid Function Call", `Expected an array input on line ${token.line}`, token.line, token.rowpos);
                throw e.newHelp("To append values to the array, you can use the push method");
            }

            return [...content, ...args[0].value as Array<TokenValue>];
        }
    },
    { name: "shuffle", arguments: [], arity: [0, 0],
        call(content: TokenValue[]) {
            let array = JSON.parse(JSON.stringify(content));
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    },
    { name: "copy", arguments: [], arity: [0, 0], call(content: TokenValue[]) { return JSON.parse(JSON.stringify(content)); } }
];