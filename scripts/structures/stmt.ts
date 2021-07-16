import { Expr } from "./expr";
import { Token } from "../structures/token"

export interface Visitor<T> {
    visitBlockStmt: (stmt: Block) => T;
    visitExpressionStmt: (stmt: Expression) => T;
    visitFuncStmt: (stmt: Func) => T;
    visitIfStmt: (stmt: If) => T;
    visitPrintStmt: (stmt: Print) => T;
    visitVarStmt: (stmt: Var) => T;
    visitWhileStmt: (stmt: While) => T;
}

export type Stmt = Block | Expression | Func | If | Print | Var | While;

export class Block {
    statements: Stmt[];

    constructor(statements: Stmt[]) {
        this.statements = statements;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitBlockStmt(this); }
}

export class Expression {
    expression: Expr;

    constructor(expression: Expr) {
        this.expression = expression;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitExpressionStmt(this); }
}

export class Func {
    name: Token;
    params: Token[];
    body: Stmt[];

    constructor(name: Token, params: Token[], body: Stmt[]) {
        this.name = name;
        this.params = params;
        this.body = body;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitFuncStmt(this); }
}

export class If {
    condition: Expr;
    thenBranch: Stmt;
    elseBranch: Stmt | null;

    constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitIfStmt(this); }
}

export class Print {
    expression: Expr;

    constructor(expression: Expr) {
        this.expression = expression;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitPrintStmt(this); }
}

export class Var {
    name: Token;
    initializer: Expr | null;

    constructor(name: Token, initializer: Expr | null) {
        this.name = name;
        this.initializer = initializer;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitVarStmt(this); }
}

export class While {
    condition: Expr;
    body: Stmt;

    constructor(condition: Expr, body: Stmt) {
        this.condition = condition;
        this.body = body;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitWhileStmt(this); }
}