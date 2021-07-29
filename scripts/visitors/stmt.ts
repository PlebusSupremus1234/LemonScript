import { LSTypes } from "../constants"
import { Expr, Variable } from "./expr"
import { Token } from "../structures/token"
import { FuncArgs } from "../functions/function"

export interface Visitor<T> {
    visitBlockStmt: (stmt: Block) => T;
    visitClassStmt: (stmt: Class) => T;
    visitExpressionStmt: (stmt: Expression) => T;
    visitFuncStmt: (stmt: Func) => T;
    visitIfStmt: (stmt: If) => T;
    visitImportStmt: (stmt: Import) => T;
    visitReturnStmt: (stmt: Return) => T;
    visitVarStmt: (stmt: Var) => T;
    visitWhileStmt: (stmt: While) => T;
}

export type Stmt = Block | Class | Expression | Func | If | Import | Return | Var | While;

export class Block {
    statements: Stmt[];

    constructor(statements: Stmt[]) { this.statements = statements; }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitBlockStmt(this); }
}

export class Class {
    name: Token;
    methods: Func[];
    superclass: null | Variable;

    constructor(name: Token, superclass: null | Variable, methods: Func[]) {
        this.name = name;
        this.methods = methods;
        this.superclass = superclass;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitClassStmt(this); }
}

export class Expression {
    expression: Expr;

    constructor(expression: Expr) { this.expression = expression; }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitExpressionStmt(this); }
}

export class Func {
    name: Token;
    body: Stmt[];
    params: FuncArgs[];
    overridden: boolean;
    returntypes: LSTypes[];

    constructor(name: Token, params: FuncArgs[], returntypes: LSTypes[], body: Stmt[], overridden: boolean = false) {
        this.name = name;
        this.body = body;
        this.params = params;
        this.overridden = overridden;
        this.returntypes = returntypes;
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

export class Import {
    module: Token;
    name: Token;

    constructor(module: Token, name: Token) {
        this.module = module;
        this.name = name;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitImportStmt(this); }
}

export class Return {
    keyword: Token;
    value: Expr | null;

    constructor(keyword: Token, value: Expr | null) {
        this.keyword = keyword;
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): T { return visitor.visitReturnStmt(this); }
}

export class Var {
    name: Token;
    types: LSTypes[];
    constant: boolean;
    initializer: Expr | null;

    constructor(name: Token, constant: boolean, types: LSTypes[], initializer: Expr | null) {
        this.name = name;
        this.types = types;
        this.constant = constant;
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