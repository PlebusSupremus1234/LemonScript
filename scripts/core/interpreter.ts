import { Visitor as ExprVisitor, Expr, Assign, Binary, Call, Get, Grouping, Literal, Logical, Self, Set, Unary, Variable } from "../structures/expr"
import { Visitor as StmtVisitor, Stmt, Block, Class, Expression, Func, If, Print, Return, Var, While } from "../structures/stmt"
import { Token, TokenValue } from "../structures/token"
import { LSError } from "../structures/errors"
import { capitilizeFirstLetter } from "../helper"
import { Environment } from "../structures/environment"
import { Callable } from "../structures/callable"
import { Function } from "../structures/function"
import { LSClass } from "../structures/class"
import { Instance } from "../structures/instance"
import { ReturnException } from "../structures/return-exception"

export class Interpreter implements ExprVisitor<TokenValue>, StmtVisitor<void> {
    fname: string;
    ftext: string;
    tokens: Token[];
    globals: Environment;
    environment: Environment;
    locals: Map<Expr, number> = new Map();

    constructor(fname: string, ftext: string, tokens: Token[]) {
        this.fname = fname;
        this.ftext = ftext;
        this.tokens = tokens;

        this.globals = new Environment(this.fname, this.ftext, null);
        this.environment = this.globals;
    }

    interpret(statements: Stmt[]) {
        for (let statement of statements) {
            try { this.execute(statement); }
            catch(e) { return console.log(e.stringify()); }
        }
    }

    // Functions
    execute(stmt: Stmt) { stmt.accept(this); }
    resolve(expr: Expr, depth: number) { this.locals.set(expr, depth); }
    evaluate(expr: Expr): TokenValue { return expr.accept<TokenValue>(this); }
    
    isCallable(callee: any): callee is Callable {
        return callee.call && (typeof callee.call === "function") && callee.arity && (typeof callee.arity === "function");
    }

    functionErr(text: string, type: string, line: number, pos: number) {
        throw new LSError(`Invalid Function ${type}`, text, this.fname, this.ftext, line, pos);
    }

    binaryErr(kw1: string, kw2: string, v1: TokenValue, v2: TokenValue, op: Token, left: TokenValue) {
        let text = `Cannot ${kw1} type ${capitilizeFirstLetter(typeof v2)} ${kw2} type ${capitilizeFirstLetter(typeof v1)} on line ${op.line}`;
        let token = this.tokens[this.tokens.findIndex(i => i.line === op.line && i.rowpos === op.rowpos) + (typeof left !== "number" ? -1 : 1)];
        throw new LSError("Type Error", text, this.fname, this.ftext, token.line, token.rowpos);
    }

    // Visit Expressions
    visitAssignExpr(expr: Assign) {
        let value = this.evaluate(expr.value);
        let distance = this.locals.get(expr);

        if (distance !== undefined) this.environment.assignAt(distance, expr.name, value);
        else this.globals.assign(expr.name, value, this.ftext);

        return value;
    }

    visitBinaryExpr(expr: Binary) {
        let l = this.evaluate(expr.left);
        let r = this.evaluate(expr.right);
        let o = expr.operator;

        switch (o.type) {
            case "PLUS":
                if (typeof l === "number" && typeof r === "number") return l + r;
                if ((typeof l === "number" || typeof l === "string") && (typeof r === "number" || typeof r === "string")) return String(l) + String(r);
                this.binaryErr("add", "to", l, r, o, l);
            case "MINUS":
                if (typeof l === "number" && typeof r === "number") return l - r;
                this.binaryErr("subtract", "from", l, r, o, l);
            case "MUL":
                if (typeof l === "number" && typeof r === "number") return l * r;
                if (typeof l === "string" && typeof r === "number") {
                    if (r % 1 !== 0) {
                        let text = `Cannot multiply a string by a non-int value on line ${o.line}`;
                        let pos = this.tokens[this.tokens.findIndex(i => i.line === o.line && i.rowpos === o.rowpos) + 1].rowpos;
                        throw new LSError("Type Error", text, this.fname, this.ftext, o.line, pos);
                    }
                    else return Array(r).fill(l).join("");
                } else this.binaryErr("multiply", "to", l, r, o, l);
            case "DIV":
                if (typeof l === "number" && typeof r === "number") return l / r;
                this.binaryErr("divide", "from", l, r, o, l);
            case "MOD":
                if (typeof l === "number" && typeof r === "number") return l % r;
                this.binaryErr("modulate", "from", l, r, o, l);
            case "CARET":
                if (typeof l === "number" && typeof r === "number") return l ** r;
                this.binaryErr("exponentialize", "from", l, r, o, l);
            case "GREATER":
                if (typeof l === "number" && typeof r === "number") return l > r;
                this.binaryErr("compare", "with", r, l, o, l);
            case "GREATEREQUAL":
                if (typeof l === "number" && typeof r === "number") return l >= r;
                this.binaryErr("compare", "with", r, l, o, l);
            case "LESS":
                if (typeof l === "number" && typeof r === "number") return l < r;
                this.binaryErr("compare", "with", r, l, o, l);
            case "LESSEQUAL":
                if (typeof l === "number" && typeof r === "number") return l <= r;
                this.binaryErr("compare", "with", r, l, o, l);
            case "BANGEQUAL": return l !== r;
            case "EQUALEQUAL": return l === r;
        }
        
        return null;
    }

    visitCallExpr(expr: Call) {
        let callee = this.evaluate(expr.callee);
        
        let args = [];
        for (let arg of expr.args) args.push(this.evaluate(arg));

        let index = this.tokens.findIndex(i => i.line === expr.paren.line && i.rowpos === expr.paren.rowpos);
        let current = this.tokens[index - 2];
        if (!this.isCallable(callee)) throw this.functionErr("Can only call functions and classes", "Call", current.line, current.rowpos);

        let fn = callee;
        current = this.tokens[index];
        if (args.length !== fn.arity()) throw this.functionErr(`Expected ${fn.arity()} arguments but got ${args.length}`, "Call", current.line, current.rowpos);

        return fn.call(this, current, args);
    }

    visitGetExpr(expr: Get) {
        let obj = this.evaluate(expr.obj);

        if (obj instanceof Instance) {
            return obj.get(expr.name, this.fname, this.ftext);
        }

        let text = `Only instances have properties on line ${expr.name.line}`;
        throw new LSError("Type Error", text, this.fname, this.ftext, expr.name.line, expr.name.rowpos);
    }

    visitGroupingExpr(expr: Grouping) { return this.evaluate(expr.expression); }

    visitLiteralExpr(expr: Literal) { return expr.value; }

    visitLogicalExpr(expr: Logical) {
        let left = this.evaluate(expr.left);

        if (expr.operator.type === "OR") {
            if (left) return left;
        } else {
            if (!left) return left;
        }

        return this.evaluate(expr.right);
    }

    visitSelfExpr(expr: Self) { return this.lookupVariable(expr.keyword, expr); }
    
    visitSetExpr(expr: Set) {
        let obj = this.evaluate(expr.obj);

        if (!(obj instanceof Instance)) {
            let text = `Only instances have fields on line ${expr.name.line}`;
            throw new LSError("Type Error", text, this.fname, this.ftext, expr.name.line, expr.name.rowpos);
        }

        let val = this.evaluate(expr.val);
        obj.set(expr.name, val);
        return val;
    }

    visitUnaryExpr(expr: Unary) {
        let rightRaw = this.evaluate(expr.right);
        let right = rightRaw !== null ? rightRaw.toString() : "null";

        if (expr.operator.type === "BANG") return !rightRaw;
        if (expr.operator.type === "MINUS") return -(parseFloat(right));

        return null;
    }

    visitVariableExpr(expr: Variable) { return this.lookupVariable(expr.name, expr); }

    // Visit Statements
    visitBlockStmt(stmt: Block) {
        this.executeBlock(stmt.statements, new Environment(this.fname, this.ftext, this.environment));
        return null;
    }

    visitClassStmt(stmt: Class) {
        let methods: Map<string, Function> = new Map();
        for (let method of stmt.methods) {
            let func = new Function(this.fname, this.ftext, method, this.environment, method.name.stringify() === "init");
            if (methods.has(method.name.stringify())) {console.log("yes")}
            methods.set(method.name.stringify(), func);
        }

        let _class = new LSClass(stmt.name.stringify(), methods);
        this.environment.define(stmt.name, true, _class, "CLASS");
    }

    visitExpressionStmt(stmt: Expression) {
        this.evaluate(stmt.expression);
    }

    visitFuncStmt(stmt: Func) {
        let func = new Function(this.fname, this.ftext, stmt, this.environment, false);
        this.environment.define(stmt.name, true, func, "FUNCTION");
    }

    visitIfStmt(stmt: If) {
        if (this.evaluate(stmt.condition)) this.execute(stmt.thenBranch);
        else if (stmt.elseBranch !== null) this.execute(stmt.elseBranch);
        return null;
    }

    visitPrintStmt(stmt: Print) {
        let value = this.evaluate(stmt.expression);
        console.log(value);
    }

    visitReturnStmt(stmt: Return) {
        let value: TokenValue = null;
        if (stmt.value !== null) value = this.evaluate(stmt.value); 

        throw new ReturnException(value);
    }

    visitVarStmt(stmt: Var) {
        let value: TokenValue = null;
        if (stmt.initializer !== null) value = this.evaluate(stmt.initializer);

        if (stmt.name.value) this.environment.define(stmt.name, stmt.constant, value, "VAR");
    }

    visitWhileStmt(stmt: While) {
        while (this.evaluate(stmt.condition)) this.execute(stmt.body);
    }

    // Other
    executeBlock(statements: Stmt[], environment: Environment) {
        let previous = this.environment;
        this.environment = environment;
        try { for (let statement of statements) this.execute(statement); }
        finally { this.environment = previous; }
    }

    lookupVariable(name: Token, expr: Expr) {
        let distance = this.locals.get(expr);
        if (distance !== undefined) return this.environment.getAt(distance, "", name);
        else return this.globals.get(name, this.ftext);
    }
}