import { LSClass } from "./class"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"

export class Instance {
    _class: LSClass;
    errorhandler: ErrorHandler;
    fields: Map<string, TokenValue> = new Map();

    constructor(_class: LSClass, errorhandler: ErrorHandler) {
        this._class = _class;
        this.errorhandler = errorhandler;
    }

    stringify() { return `<instance ${this._class.name}>`; }
    set(name: Token, val: TokenValue) { this.fields.set(name.stringify(), val); }

    get(name: Token): TokenValue {
        if (this.fields.has(name.stringify())) {
            let val = this.fields.get(name.stringify());
            return val === undefined ? null : val;
        }

        let method = this._class.findMethod(name.stringify());
        if (method !== null) return method.bind(name, this, this.errorhandler);

        let text = `Undefined property '${name.stringify()}' on line ${name.line}`;
        throw this.errorhandler.newError("Class Error", text, name.line, name.rowpos);
    }
}