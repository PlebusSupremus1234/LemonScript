import { Token } from "../structures/token"
import { Interpreter } from "./interpreter"
import { LSError, SyntaxError, UndefinedVariable } from "../structures/errors"

type visitable = { accept: (visitor: any) => any; };
type FunctionType = "NONE" | "FUNCTION";
import { Visitor as ExprVisitor, Expr, Assign, Binary, Call, Literal, Logical, Grouping, Unary, Variable } from "../structures/expr"
import { Visitor as StmtVisitor, Stmt, Block, Expression, Func, If, Print, Return, Var, While } from "../structures/stmt"

export class Resolver implements ExprVisitor<void>, StmtVisitor<void> {
    fname: string;
    text: string;

    interpreter: Interpreter;
    scopes: Array<Map<string, boolean>> = [];
    currentFunction: FunctionType = "NONE";

    constructor(fname: string, text: string, interpreter: Interpreter) {
        this.fname = fname;
        this.text = text;
        this.interpreter = interpreter;
    }

    // Functions
    beginScope() { this.scopes.push(new Map<string, boolean>()); }
    endScope() { this.scopes.pop(); }
    resolve(...args: Array<visitable>) {
        for (let s of args) {
            try { s.accept(this); }
            catch (e) {
                console.log(e.stringify());
                return true;
            }
        }
    }

    define(name: Token) {
        if (this.scopes.length === 0) return;
        this.scopes[this.scopes.length - 1].set(name.stringify(), true);
    }
    //make a common func for these
    declare(name: Token) {
        if (this.scopes.length === 0) return;
        this.scopes[this.scopes.length - 1].set(name.stringify(), false);
    }

    resolveLocal(expr: Expr, name: Token) {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].has(name.stringify())) {
                this.interpreter.resolve(expr, this.scopes.length - 1 - i);
                return;
            }
        }
    }

    resolveFunction(func: Func, type: FunctionType) {
        const enclosingFunction = this.currentFunction;
        this.currentFunction = type;

        this.beginScope();
        for (const param of func.params) {
            this.declare(param);
            this.define(param);
        }
        this.resolve(...func.body);
        this.endScope();

        this.currentFunction = enclosingFunction;
    }

    // Visit Expressions
    visitAssignExpr(expr: Assign) {
        this.resolve(expr.value);
        this.resolveLocal(expr, expr.name);
    }

    visitBinaryExpr(expr: Binary) {
        this.resolve(expr.left);
        this.resolve(expr.right);
    }

    visitCallExpr(expr: Call) {
        this.resolve(expr.callee);
        for (let s of expr.args) this.resolve(s);
    }

    visitGroupingExpr(expr: Grouping) { this.resolve(expr.expression); }

    visitLiteralExpr() {}

    visitLogicalExpr(expr: Logical) {
        this.resolve(expr.left);
        this.resolve(expr.right);
    }

    visitUnaryExpr(expr: Unary) { this.resolve(expr.right); }

    visitVariableExpr(expr: Variable) {
        let length = this.scopes.length;
        if ((length !== 0) && this.scopes[length - 1].get(expr.name.stringify()) === false) {
            let text = `Cannot read local variable in its own initializer on line ${expr.name.line}`;
            throw new UndefinedVariable(this.fname, this.text, expr.name, text);
        }

        this.resolveLocal(expr, expr.name);
    }

    // Visit Statements
    visitBlockStmt(stmt: Block) {
        this.beginScope();
        this.resolve(...stmt.statements);
        this.endScope();
    }

    visitExpressionStmt(stmt: Expression) { this.resolve(stmt.expression); }

    visitFuncStmt(stmt: Func) {
        this.declare(stmt.name);
        this.define(stmt.name);

        this.resolveFunction(stmt, "FUNCTION");
    }

    visitIfStmt(stmt: If) {
        this.resolve(stmt.condition);
        this.resolve(stmt.thenBranch);
        if (stmt.elseBranch !== null) this.resolve(stmt.elseBranch);
    }

    visitPrintStmt(stmt: Print) { this.resolve(stmt.expression); }

    visitReturnStmt(stmt: Return) {
        let t = stmt.keyword;
        let text = `Cannot return in top-level code on line ${t.line}`;
        if (this.currentFunction === "NONE") throw new SyntaxError(this.fname, text, t.line, t.rowpos, this.text.split("\n")[t.line - 1]);
        if (stmt.value !== null) this.resolve(stmt.value);
    }

    visitVarStmt(stmt: Var) {
        this.declare(stmt.name)
        if (stmt.initializer != null) this.resolve(stmt.initializer);
        this.define(stmt.name);
    }

    visitWhileStmt(stmt: While) {
        this.resolve(stmt.condition);
        this.resolve(stmt.body);
    }
}