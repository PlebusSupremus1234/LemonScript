import { Token } from "../structures/token"
import { Interpreter } from "./interpreter"
import { LSError } from "../structures/errors"

type visitable = { accept: (visitor: any) => any; };
type FunctionType = "NONE" | "FUNCTION" | "METHOD" | "INITIALIZER";
type ClassType = "NONE" | "CLASS";
import { Visitor as ExprVisitor, Expr, Assign, Binary, Call, Get, Grouping, Literal, Logical, Self, Set, Unary, Variable } from "../structures/expr"
import { Visitor as StmtVisitor, Stmt, Block, Class, Expression, Func, If, Print, Return, Var, While } from "../structures/stmt"

export class Resolver implements ExprVisitor<void>, StmtVisitor<void> {
    fname: string;
    ftext: string;
    interpreter: Interpreter;
    scopes: Array<Map<string, boolean>> = [];
    currentFunction: FunctionType = "NONE";
    currentClass: ClassType = "NONE";

    constructor(fname: string, ftext: string, interpreter: Interpreter) {
        this.fname = fname;
        this.ftext = ftext;
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
        let enclosingFunction = this.currentFunction;
        this.currentFunction = type;

        this.beginScope();
        for (let param of func.params) {
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

    visitGetExpr(expr: Get) { this.resolve(expr.obj); }

    visitGroupingExpr(expr: Grouping) { this.resolve(expr.expression); }

    visitLiteralExpr() {}

    visitLogicalExpr(expr: Logical) {
        this.resolve(expr.left);
        this.resolve(expr.right);
    }

    visitSelfExpr(expr: Self) {
        if (this.currentClass !== "NONE") this.resolveLocal(expr, expr.keyword);
    }

    visitSetExpr(expr: Set) {
        this.resolve(expr.val);
        this.resolve(expr.obj);
    }

    visitUnaryExpr(expr: Unary) { this.resolve(expr.right); }

    visitVariableExpr(expr: Variable) {
        let length = this.scopes.length;
        if ((length !== 0) && this.scopes[length - 1].get(expr.name.stringify()) === false) {
            let text = `Cannot read local variable in its own initializer on line ${expr.name.line}`;
            throw new LSError("Variable Error", text, this.fname, this.ftext, expr.name.line, expr.name.rowpos);
        }

        this.resolveLocal(expr, expr.name);
    }

    // Visit Statements
    visitBlockStmt(stmt: Block) {
        this.beginScope();
        this.resolve(...stmt.statements);
        this.endScope();
    }

    visitClassStmt(stmt: Class) {
        let enclosing = this.currentClass;
        this.currentClass = "CLASS";

        this.declare(stmt.name);
        this.define(stmt.name);

        this.beginScope();
        this.scopes[this.scopes.length - 1].set("self", true);

        for (let method of stmt.methods) {
            let declaration: FunctionType = "METHOD";
            if (method.name.stringify() === "init") declaration = "INITIALIZER";
            this.resolveFunction(method, declaration);
        }

        this.endScope();
        this.currentClass = enclosing;
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
        if (this.currentFunction === "NONE") throw new LSError("Invalid Return", text, this.fname, this.ftext, t.line, t.rowpos);
        if (stmt.value !== null) {
            if (this.currentFunction === "INITIALIZER") {
                text = `Cannot return in an initializer function`;
                throw new LSError("Invalid Function Declaration", text, this.fname, this.ftext, t.line, t.rowpos);
            }
            this.resolve(stmt.value);
        }
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