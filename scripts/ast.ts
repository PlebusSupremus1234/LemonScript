import { Token, TokenValue } from "./token";

class Expr {}
export type LSNode = Expr | Binary | Grouping | Literal | Unary;

export class Binary extends Expr {
    left: Expr;
    operator: Token;
    right: Expr;

    constructor(left: Expr, operator: Token, right: Expr) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}

export class Grouping extends Expr {
    expression: Expr;

    constructor(expression: Expr) {
        super();
        this.expression = expression;
    }
}

export class Literal extends Expr {
    value: TokenValue;

    constructor(value: TokenValue) {
        super();
        this.value = value;
    }
}

export class Unary extends Expr {
    operator: Token;
    right: Expr;

    constructor(operator: Token, right: Expr) {
        super();
        this.operator = operator;
        this.right = right;
    }
}