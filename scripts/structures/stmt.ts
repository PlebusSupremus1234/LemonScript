import { Expr } from "./expr";

export interface Visitor<T> {
    visitExpressionStmt: (stmt: Expression) => T;
    visitPrintStmt: (stmt: Print) => T;
}

export type Stmt = Expression | Print;

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