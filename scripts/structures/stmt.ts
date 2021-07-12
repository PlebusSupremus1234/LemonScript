import { Expr } from "./expr";
import { Token } from "../structures/token"

export interface Visitor<T> {
    visitBlockStmt: (stmt: Block) => T;
    visitExpressionStmt: (stmt: Expression) => T;
    visitPrintStmt: (stmt: Print) => T;
    visitVarStmt: (stmt: Var) => T;
}

export type Stmt = Block | Expression | Print | Var;

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