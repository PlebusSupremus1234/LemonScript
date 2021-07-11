import { Visitor as ExprVisitor, Expr, Literal, Grouping, Unary, Binary, Variable } from "../structures/expr"
import { Visitor as StmtVisitor, Stmt, Expression, Print, Var } from "../structures/stmt"
import { Token, TokenValue } from "../structures/token"
import { Errors, TypeError } from "../structures/errors"
import { capitilizeFirstLetter } from "../helper"
import { Environment } from "../structures/environment"

export class Interpreter implements ExprVisitor<TokenValue>, StmtVisitor<void> {
    fname: string;
    tokens: Token[];
    text: string;
    error: null | Errors = null;
    environment: Environment;

    constructor(fname: string, text: string, tokens: Token[]) {
        this.fname = fname;
        this.text = text;
        this.tokens = tokens;
        this.environment = new Environment(this.fname, tokens);
    }

    interpret(statements: Stmt[]) {
        try {
            for (const statement of statements) this.execute(statement);
        } catch(e) {
            console.log(e.stringify());
        }
    }

    // Functions
    execute(stmt: Stmt) {
        stmt.accept(this);
    }

    evaluate(expr: Expr): TokenValue {
        return expr.accept<TokenValue>(this);
    }
    
    binaryErr(kw1: string, kw2: string, v1: TokenValue, v2: TokenValue, op: Token, left: TokenValue) {
        let text = `Cannot ${kw1} type ${capitilizeFirstLetter(typeof v2)} ${kw2} type ${capitilizeFirstLetter(typeof v1)} on line ${op.line}`;
        let token = this.tokens[this.tokens.findIndex(i => i.line === op.line && i.rowpos === op.rowpos) + (typeof left !== "number" ? -1 : 1)];
        throw new TypeError(this.fname, text, op.line, token.rowpos, this.text.split("\n")[op.line - 1]);
    }    

    // Visit Expressions
    visitLiteralExpr(expr: Literal) { return expr.value; }
    visitGroupingExpr(expr: Grouping) { return this.evaluate(expr.expression); }
    visitVariableExpr(expr: Variable) { return this.environment.get(expr.name, this.text); }
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
            this.binaryErr("add", "to", l, r, o, l);
        } else if (o.type === "MINUS") {
            if (typeof l === "number" && typeof r === "number") return l - r;
            this.binaryErr("subtract", "from", l, r, o, l);
        } else if (o.type === "MUL") {
            if (typeof l === "number" && typeof r === "number") return l * r;
            if (typeof l === "string" && typeof r === "number") {
                if (r % 1 !== 0) {
                    let text = `Cannot multiply a string by a non-int value on line ${o.line}`;
                    let token = this.tokens[this.tokens.findIndex(i => i.line === o.line && i.rowpos === o.rowpos) + 1].rowpos;
                    throw new TypeError(this.fname, text, o.line, token, this.text.split("\n")[o.line - 1]);
                }
                else return Array(r).fill(l).join("");
            } else this.binaryErr("multiply", "to", l, r, o, l);
        } else if (o.type === "DIV") {
            if (typeof l === "number" && typeof r === "number") return l / r;
            this.binaryErr("divide", "from", l, r, o, l);
        } else if (o.type === "GREATER") {
            if (typeof l === "number" && typeof r === "number") return l > r;
            this.binaryErr("compare", "with", r, l, o, l);
        } else if (o.type === "GREATEREQUAL") {
            if (typeof l === "number" && typeof r === "number") return l >= r;
            this.binaryErr("compare", "with", r, l, o, l);
        } else if (o.type === "LESS") {
            if (typeof l === "number" && typeof r === "number") return l < r;
            this.binaryErr("compare", "with", r, l, o, l);
        } else if (o.type === "LESSEQUAL") {
            if (typeof l === "number" && typeof r === "number") return l <= r;
            this.binaryErr("compare", "with", r, l, o, l);
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
    visitVarStmt(stmt: Var) {
        let value: TokenValue = null;
        if (stmt.initializer !== null) value = this.evaluate(stmt.initializer);

        if (stmt.name.value) this.environment.define(stmt.name.value.toString(), value);
    }
}