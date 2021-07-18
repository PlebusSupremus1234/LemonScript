import { Token, TokenValue } from "./token";
import { TokenType } from "../constants"

export interface Visitor<T> {
    visitAssignExpr: (expr: Assign) => T;
    visitBinaryExpr: (expr: Binary) => T;
    visitCallExpr: (expr: Call) => T;
    visitGroupingExpr: (expr: Grouping) => T;
    visitLiteralExpr: (expr: Literal) => T;
    visitLogicalExpr: (expr: Logical) => T;
    visitUnaryExpr: (expr: Unary) => T;
    visitVariableExpr: (expr: Variable) => T;
}

export type Expr = Assign | Binary | Call | Grouping | Literal | Logical | Unary | Variable;

export class Assign {
    name: Token;
    value: Expr;

    constructor(name: Token, value: Expr) {
        this.name = name;
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitAssignExpr(this); }
}

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

export class Call {
    callee: Expr;
    paren: Token;
    args: Expr[];

    constructor(callee: Expr, paren: Token, args: Expr[]) {
        this.callee = callee;
        this.paren = paren;
        this.args = args;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitCallExpr(this); }
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

export class Logical {
    left: Expr;
    operator: Token;
    right: Expr;

    constructor(left: Expr, operator: Token, right: Expr) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    public accept<T>(visitor: Visitor<T>): T { return visitor.visitLogicalExpr(this); }
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

export class Variable {
    name: Token;

    constructor(name: Token) {
        this.name = name;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitVariableExpr(this); }
}