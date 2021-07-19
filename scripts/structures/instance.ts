import { LSClass } from "./class";
import { Token, TokenValue } from "./token";
import { LSError } from "./errors"

export class Instance {
    _class: LSClass;
    fields: Map<string, TokenValue> = new Map();

    constructor(_class: LSClass) {
        this._class = _class;
    }

    get(name: Token, fname: string, ftext: string): TokenValue {
        if (this.fields.has(name.stringify())) {
            let val = this.fields.get(name.stringify());
            return val === undefined ? null : val;
        }

        let method = this._class.findMethod(name.stringify());
        if (method !== null) return method.bind(name, this);

        let text = `Undefined property '${name.stringify()}' on line ${name.line}`;
        throw new LSError("Class Error", text, fname, ftext, name.line, name.rowpos);
    }

    set(name: Token, val: TokenValue) { this.fields.set(name.stringify(), val); }

    stringify() { return this._class.name + " instance"; }
}