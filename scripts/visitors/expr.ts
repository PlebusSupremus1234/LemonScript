import { TokenType } from "../constants"
import { Token, TokenValue } from "../structures/token";

export interface Visitor<T> {
    visitAssignExpr: (expr: Assign) => T;
    visitBinaryExpr: (expr: Binary) => T;
    visitCallExpr: (expr: Call) => T;
    visitGetExpr: (expr: Get) => T;
    visitGroupingExpr: (expr: Grouping) => T;
    visitLiteralExpr: (expr: Literal) => T;
    visitLogicalExpr: (expr: Logical) => T;
    visitSelfExpr: (expr: Self) => T;
    visitSetExpr: (expr: Set) => T;
    visitSuperExpr: (expr: Super) => T;
    visitUnaryExpr: (expr: Unary) => T;
    visitVariableExpr: (expr: Variable) => T;
}

export type Expr = Assign | Binary | Call | Get | Grouping | Literal | Logical | Self | Set | Super | Unary | Variable;

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

export class Get {
    obj: Expr;
    name: Token;

    constructor(obj: Expr, name: Token) {
        this.obj = obj;
        this.name = name;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitGetExpr(this); }
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

    accept<T>(visitor: Visitor<T>): T { return visitor.visitLogicalExpr(this); }
}

export class Self {
    keyword: Token;

    constructor(keyword: Token) {
        this.keyword = keyword;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitSelfExpr(this); }
}

export class Set {
    obj: Expr;
    name: Token;
    val: Expr;

    constructor(obj: Expr, name: Token, val: Expr) {
        this.obj = obj;
        this.name = name;
        this.val = val;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitSetExpr(this); }
}

export class Super {
    keyword: Token;
    method: Token;

    constructor(keyword: Token, method: Token) {
        this.keyword = keyword;
        this.method = method;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitSuperExpr(this); }
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