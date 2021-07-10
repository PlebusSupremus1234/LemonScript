import { Token, TokenValue } from "./token";
import { TokenType } from "../constants"

export interface Visitor<T> {
    visitBinaryExpr: (expr: Binary) => T;
    visitGroupingExpr: (expr: Grouping) => T;
    visitLiteralExpr: (expr: Literal) => T;
    visitUnaryExpr: (expr: Unary) => T;
}

export type Expr = Binary | Grouping | Literal | Unary;

export class Binary {
    left: Expr;
    operator: Token;
    right: Expr;

    constructor(left: Expr, operator: Token, right: Expr) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitBinaryExpr(this); }
}

export class Grouping {
    expression: Expr;

    constructor(expression: Expr) {
        this.expression = expression;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitGroupingExpr(this); }
}

export class Literal {
    type: TokenType;
    value: TokenValue;

    constructor(type: TokenType, value: TokenValue) {
        this.type = type;
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitLiteralExpr(this); }
}

export class Unary {
    operator: Token;
    right: Expr;

    constructor(operator: Token, right: Expr) {
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitUnaryExpr(this); }
}