import { Visitor as ExprVisitor, Expr, Literal, Grouping, Unary, Binary } from "../structures/expr"
import { Visitor as StmtVisitor, Stmt, Expression, Print } from "../structures/stmt"
import { Token, TokenValue } from "../structures/token"
import { Errors, TypeError } from "../structures/errors"
import { capitilizeFirstLetter } from "../helper"

export class Interpreter implements ExprVisitor<TokenValue>, StmtVisitor<void> {
    fname: string;
    tokens: Token[];
    text: string;
    error: null | Errors = null;

    constructor(fname: string, text: string, tokens: Token[]) {
        this.fname = fname;
        this.text = text;   
        this.tokens = tokens;
    }

    interpret(statements: Stmt[]) {
        try {
            for (const statement of statements) this.execute(statement);
        } catch(e) {
            console.log(e);
        }
    }

    // Functions
    execute(stmt: Stmt) {
        stmt.accept(this);
    }

    evaluate(expr: Expr): TokenValue {
        return expr.accept<TokenValue>(this);
    }

    genError(text: string, line: number, operator: Token, left: TokenValue): [string, string, number, number, string] {
        let token = this.tokens[this.tokens.findIndex(i => i.line === operator.line && i.rowpos === operator.rowpos) + (typeof left !== "number" ? -1 : 1)];
        return [this.fname, text, line, token.rowpos, this.text.split("\n")[line - 1]];
    }

    binaryErrString(kword1: string, kword2: string, v1: TokenValue, v2: TokenValue, line: number): string {
        return `Cannot ${kword1} type ${capitilizeFirstLetter(typeof v2)} ${kword2} type ${capitilizeFirstLetter(typeof v1)} on line ${line}`;
    }

    // Visit Expressions
    visitLiteralExpr(expr: Literal) { return expr.value; }
    visitGroupingExpr(expr: Grouping) { return this.evaluate(expr.expression); }
    visitUnaryExpr(expr: Unary) {
        let rightRaw = this.evaluate(expr.right);
        let right = rightRaw !== null ? rightRaw.toString() : "null";

        if (expr.operator.type === "BANG") return !rightRaw;
        if (expr.operator.type === "MINUS") return -(parseFloat(right));

        return null;
    }
    visitBinaryExpr(expr: Binary) {
        let l = this.evaluate(expr.left);
        let r = this.evaluate(expr.right);
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

    // Visit Statements
    visitExpressionStmt(stmt: Expression) {
        this.evaluate(stmt.expression);
    }
    visitPrintStmt(stmt: Print) {
        let value = this.evaluate(stmt.expression);
        console.log(value);
    }
}