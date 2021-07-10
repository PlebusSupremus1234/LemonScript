import { LSNode } from "./ast"

class Stmt {}
export type LSStmt = Expression | Print;

export class Expression extends Stmt {
    expression: LSNode;

    constructor(expression: LSNode) {
        super();
        this.expression = expression;
    }
}

export class Print extends Stmt {
    expression: LSNode;

    constructor(expression: LSNode) {
        super();
        this.expression = expression;
    }
}