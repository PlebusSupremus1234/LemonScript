import { Token } from "../structures/token"
import { Interpreter } from "./interpreter"
import { ErrorHandler } from "../structures/errorhandler"

type ClassType = "NONE" | "CLASS" | "SUBCLASS";
type visitable = { accept: (visitor: any) => any; };
type FunctionType = "NONE" | "FUNCTION" | "METHOD" | "INITIALIZER";

import { Visitor as StmtVisitor, Stmt, Block, Class, Expression, Func, If, Import, Return, Var, While } from "../visitors/stmt"
import { Visitor as ExprVisitor, Expr, Assign, Binary, Call, Get, Grouping, Literal, Logical, Self, Set, Super, Unary, Variable } from "../visitors/expr"

import { LSString } from "../primitives/string"
import { handlePrimitive, Primitives } from "../primitives/primitives"

export class Resolver implements ExprVisitor<void>, StmtVisitor<void> {
    interpreter: Interpreter;
    errorhandler: ErrorHandler;
    currentClass: ClassType = "NONE";
    currentFunction: FunctionType = "NONE";
    scopes: Array<Map<string, boolean>> = [];

    constructor(interpreter: Interpreter, errorhandler: ErrorHandler) {
        this.interpreter = interpreter;
        this.errorhandler = errorhandler;
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
            this.declare(param.name);
            this.define(param.name);
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

    visitSuperExpr(expr: Super) {
        if (this.currentClass === "NONE") {
            let text = `Cannot use 'super' outside of a class on line ${expr.keyword.line}`;
            throw this.errorhandler.newError("Syntax Error", text, expr.keyword.line, expr.keyword.rowpos);
        } else if (this.currentClass !== "SUBCLASS") {
            let text = `Cannot use 'super' in a class with no superclasses on line ${expr.keyword.line}`;
            throw this.errorhandler.newError("Class Error", text, expr.keyword.line, expr.keyword.rowpos);
        }

        this.resolveLocal(expr, expr.keyword);
        return null;
    }

    visitUnaryExpr(expr: Unary) { this.resolve(expr.right); }

    visitVariableExpr(expr: Variable) {
        let length = this.scopes.length;
        if ((length !== 0) && this.scopes[length - 1].get(expr.name.stringify()) === false) {
            let text = `Cannot read local variable in its own initializer on line ${expr.name.line}`;
            throw this.errorhandler.newError("Variable Error", text, expr.name.line, expr.name.rowpos);
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

        if (stmt.superclass !== null && stmt.name.stringify() === stmt.superclass.name.stringify()) {
            let text = `A class cannot inherit from itself on line ${stmt.name.line}`;
            throw this.errorhandler.newError("Class Error", text, stmt.name.line, stmt.name.rowpos);
        }
        if (stmt.superclass !== null) {
            this.currentClass = 'SUBCLASS';
            this.resolve(stmt.superclass);
        }
        if (stmt.superclass !== null) {
            this.beginScope();
            this.scopes[this.scopes.length - 1].set("super", true);
        }

        this.beginScope();
        this.scopes[this.scopes.length - 1].set("self", true);

        for (let method of stmt.methods) {
            let declaration: FunctionType = "METHOD";
            if (method.name.stringify() === "init") declaration = "INITIALIZER";
            this.resolveFunction(method, declaration);
        }

        this.endScope();
        if (stmt.superclass !== null) this.endScope();

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

    visitImportStmt(stmt: Import) {}

    visitReturnStmt(stmt: Return) {
        let t = stmt.keyword;
        let text = `Cannot return in top-level code on line ${t.line}`;
        if (this.currentFunction === "NONE") throw this.errorhandler.newError("Invalid Function Declaration", text, t.line, t.rowpos);
        if (stmt.value !== null) {
            if (this.currentFunction === "INITIALIZER") {
                text = `Cannot return in an initializer function`;
                throw this.errorhandler.newError("Invalid Function Declaration", text, t.line, t.rowpos);
            }
            this.resolve(stmt.value);
        }
    }

    visitVarStmt(stmt: Var) {
        this.declare(stmt.name)
        if (stmt.initializer !== null) this.resolve(stmt.initializer);
        this.define(stmt.name);
    }

    visitWhileStmt(stmt: While) {
        this.resolve(stmt.condition);
        this.resolve(stmt.body);
    }
}