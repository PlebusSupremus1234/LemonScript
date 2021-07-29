import { LSClass } from "./class"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"

export class Instance {
    _class: LSClass;
    fields: Map<string, TokenValue> = new Map();

    constructor(_class: LSClass) {
        this._class = _class;
        console.log(_class)
    }

    stringify() { return `<instance ${this._class.name}>`; }
    set(name: Token, val: TokenValue) { this.fields.set(name.stringify(), val); }

    get(name: Token, errorhandler: ErrorHandler): TokenValue {
        if (this.fields.has(name.stringify())) {
            let val = this.fields.get(name.stringify());
            return val === undefined ? null : val;
        }

        let method = this._class.findMethod(name.stringify());
        if (method !== null) return method.bind(name, this, errorhandler);

        let text = `Undefined property '${name.stringify()}' on line ${name.line}`;
        throw errorhandler.newError("Class Error", text, name.line, name.rowpos);
    }
}