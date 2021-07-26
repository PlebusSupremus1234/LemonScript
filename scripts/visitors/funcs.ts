import { Expr } from "./expr"
import { TokenValue } from "../structures/token"

export interface Visitor {
    visitPrintFunc: (func: Print) => void;
    visitTypeofFunc: (func: Typeof) => TokenValue;
}

export type FuncStmts = Print;
export type FuncExprs = Typeof;
export let Funcs = ["PRINT", "TYPEOF"];

export class Print {
    expression: Expr;

    constructor(expression: Expr) { this.expression = expression; }

    accept<T>(visitor: Visitor): void { return visitor.visitPrintFunc(this); }
}

export class Typeof {
    expression: Expr;

    constructor(expression: Expr) { this.expression = expression; }

    accept<T>(visitor: Visitor): TokenValue { return visitor.visitTypeofFunc(this); }
}