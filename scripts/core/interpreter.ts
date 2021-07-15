import { Visitor as ExprVisitor, Expr, Assign, Literal, Logical, Grouping, Unary, Binary, Variable } from "../structures/expr"
import { Visitor as StmtVisitor, Stmt, Block, Expression, If, Print, Var, While } from "../structures/stmt"
import { Token, TokenValue } from "../structures/token"
import { Errors, TypeError } from "../structures/errors"
import { capitilizeFirstLetter } from "../helper"
import { Environment } from "../structures/environment"

export class Interpreter implements ExprVisitor<TokenValue>, StmtVisitor<void> {
    fname: string;
    tokens: Token[];
    text: string;
    environment: Environment;

    constructor(fname: string, text: string, tokens: Token[]) {
        this.fname = fname;
        this.text = text;
        this.tokens = tokens;
        this.environment = new Environment(this.fname, null);
    }

    interpret(statements: Stmt[]) {
        try {
            for (let statement of statements) this.execute(statement);
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
    visitAssignExpr(expr: Assign) {
        let value = this.evaluate(expr.value);
        this.environment.assign(expr.name, value, this.text);
        return value;
    }
    visitUnaryExpr(expr: Unary) {
        let rightRaw = this.evaluate(expr.right);
        let right = rightRaw !== null ? rightRaw.toString() : "null";

        if (expr.operator.type === "BANG") return !rightRaw;
        if (expr.operator.type === "MINUS") return -(parseFloat(right));

        return null;
    }
    visitLogicalExpr(expr: Logical) {
        let left = this.evaluate(expr.left);

        if (expr.operator.type === "OR") {
            if (left) return left;
        } else {
            if (!left) return left;
        }

        return this.evaluate(expr.right);
    }
    visitBinaryExpr(expr: Binary) {
        let l = this.evaluate(expr.left);
        let r = this.evaluate(expr.right);
        let o = expr.operator;

        switch (o.type) {
            case "PLUS":
                if (typeof l === "number" && typeof r === "number") return l + r;
                if ((typeof l === "number" || typeof l === "string") && (typeof r === "number" || typeof r === "string")) return String(l) + String(r);
                this.binaryErr("add", "to", l, r, o, l);
            case "MINUS":
                if (typeof l === "number" && typeof r === "number") return l - r;
                this.binaryErr("subtract", "from", l, r, o, l);
            case "MUL":
                if (typeof l === "number" && typeof r === "number") return l * r;
                if (typeof l === "string" && typeof r === "number") {
                    if (r % 1 !== 0) {
                        let text = `Cannot multiply a string by a non-int value on line ${o.line}`;
                        let token = this.tokens[this.tokens.findIndex(i => i.line === o.line && i.rowpos === o.rowpos) + 1].rowpos;
                        throw new TypeError(this.fname, text, o.line, token, this.text.split("\n")[o.line - 1]);
                    }
                    else return Array(r).fill(l).join("");
                } else this.binaryErr("multiply", "to", l, r, o, l);
            case "DIV":
                if (typeof l === "number" && typeof r === "number") return l / r;
                this.binaryErr("divide", "from", l, r, o, l);
            case "MOD":
                if (typeof l === "number" && typeof r === "number") return l % r;
                this.binaryErr("modulate", "from", l, r, o, l);
            case "GREATER":
                if (typeof l === "number" && typeof r === "number") return l > r;
                this.binaryErr("compare", "with", r, l, o, l);
            case "GREATEREQUAL":
                if (typeof l === "number" && typeof r === "number") return l >= r;
                this.binaryErr("compare", "with", r, l, o, l);
            case "LESS":
                if (typeof l === "number" && typeof r === "number") return l < r;
                this.binaryErr("compare", "with", r, l, o, l);
            case "LESSEQUAL":
                if (typeof l === "number" && typeof r === "number") return l <= r;
                this.binaryErr("compare", "with", r, l, o, l);
            case "BANGEQUAL": return l !== r;
            case "EQUALEQUAL": return l === r;
        }
        
        return null;
    }

    // Visit Statements
    visitBlockStmt(stmt: Block) {
        this.executeBlock(stmt.statements, new Environment(this.fname, this.environment));
        return null;
    }
    visitExpressionStmt(stmt: Expression) {
        this.evaluate(stmt.expression);
    }
    visitIfStmt(stmt: If) {
        if (this.evaluate(stmt.condition)) this.execute(stmt.thenBranch);
        else if (stmt.elseBranch !== null) this.execute(stmt.elseBranch);
        return null;
    }
    visitPrintStmt(stmt: Print) {
        let value = this.evaluate(stmt.expression);
        console.log(value);
    }
    visitVarStmt(stmt: Var) {
        let value: TokenValue = null;        
        if (stmt.initializer !== null) value = this.evaluate(stmt.initializer);

        if (stmt.name.value) this.environment.define(stmt.name.stringify(), value);
    }
    visitWhileStmt(stmt: While) {
        while (this.evaluate(stmt.condition)) this.execute(stmt.body);
    }

    // Other
    executeBlock(statements: Stmt[], environment: Environment) {
        let previous = this.environment;
        try {
            this.environment = environment;

            for (let statement of statements) this.execute(statement);
        } finally {
            this.environment = previous;
        }
    }
}