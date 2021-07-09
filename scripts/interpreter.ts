import { capitilizeFirstLetter } from "./helpers"
import { Errors, TypeError } from "./structures/errors"
import { Grouping, Literal, Unary, LSNode, Binary } from "./trees/ast";
import { Token, TokenValue } from "./structures/token";

export class Interpreter {
    fname: string;
    tokens: Token[];
    text: string;
    error: null | Errors;

    constructor(fname: string, tokens: Token[], text: string) {
        this.fname = fname;
        this.tokens = tokens;
        this.text = text;
        this.error = null;
    }

    interpret(expr: LSNode) {
        let res;
        try { res = this.visit(expr.constructor.name, expr); }
        catch(e) { res = null; }
        return [res, this.error ? this.error : null];
    }

    visit(type: string, input: LSNode) {
        let method = `visit${type}Expr`;
        if ((this as any)[method]) return (this as any)[method](input);
        else return null;
    }

    visitLiteralExpr(expr: Literal): TokenValue {
        return expr.value;
    }

    visitGroupingExpr(expr: Grouping) {
        return this.visit(expr.expression.constructor.name, expr.expression);
    }

    visitUnaryExpr(expr: Unary) {
        let right = this.visit(expr.right.constructor.name, expr.right);

        if (expr.operator.type === "BANG") return !right;
        if (expr.operator.type === "MINUS") return -right;

        return null;
    }

    visitBinaryExpr(expr: Binary) {
        let l = this.visit(expr.left.constructor.name, expr.left);
        let r = this.visit(expr.right.constructor.name, expr.right);
        let o = expr.operator;

        if (o.type === "PLUS")  {
            if (typeof l === "number" && typeof r === "number") return l + r;
            if (typeof l === "string" && typeof r === "string") return l + r;
            this.error = new TypeError(...this.genError(this.binaryErrString("add", "to", l, r, o.line), o.line, o, l));
        } else if (o.type === "MINUS") {
            if (typeof l === "number" && typeof r === "number") return l - r;
            this.error = new TypeError(...this.genError(this.binaryErrString("subtract", "from", l, r, o.line), o.line, o, l));
        } else if (o.type === "MUL") {
            if (typeof l === "number" && typeof r === "number") return l * r;
            if (typeof l === "string" && typeof r === "number") {
                if (r % 1 !== 0) this.error = new TypeError(...this.genError(`Cannot multiply a string by a non-int value on line ${o.line}`, o.line, o, l));
                else return Array(r).fill(l).join("");
            } else this.error = new TypeError(...this.genError(this.binaryErrString("multiply", "to", l, r, o.line), o.line, o, l));
        } else if (o.type === "DIV") {
            if (typeof l === "number" && typeof r === "number") return l / r;
            this.error = new TypeError(...this.genError(this.binaryErrString("divide", "from", l, r, o.line), o.line, o, l));
        } else if (o.type === "GREATER") {
            if (typeof l === "number" && typeof r === "number") return l > r;
            this.error = new TypeError(...this.genError(this.binaryErrString("compare", "with", r, l, o.line), o.line, o, l));
        } else if (o.type === "GREATEREQUAL") {
            if (typeof l === "number" && typeof r === "number") return l >= r;
            this.error = new TypeError(...this.genError(this.binaryErrString("compare", "with", r, l, o.line), o.line, o, l));
        } else if (o.type === "LESS") {
            if (typeof l === "number" && typeof r === "number") return l < r;
            this.error = new TypeError(...this.genError(this.binaryErrString("compare", "with", r, l, o.line), o.line, o, l));
        } else if (o.type === "LESSEQUAL") {
            if (typeof l === "number" && typeof r === "number") return l <= r;
            this.error = new TypeError(...this.genError(this.binaryErrString("compare", "with", r, l, o.line), o.line, o, l));
        } else if (o.type === "BANGEQUAL") return l !== r;
        else if (o.type === "EQUALEQUAL") return l === r;

        return null;
    }

    genError(text: string, line: number, operator: Token, left: TokenValue): [string, string, number, number, string] {
        let token = this.tokens[this.tokens.findIndex(i => i.line === operator.line && i.rowpos === operator.rowpos) + (typeof left !== "number" ? -1 : 1)];
        return [this.fname, text, line, token.rowpos, this.text.split("\n")[line - 1]];
    }

    binaryErrString(kword1: string, kword2: string, v1: TokenValue, v2: TokenValue, line: number): string {
        return `Cannot ${kword1} type ${capitilizeFirstLetter(typeof v2)} ${kword2} type ${capitilizeFirstLetter(typeof v1)} on line ${line}`;
    }
}