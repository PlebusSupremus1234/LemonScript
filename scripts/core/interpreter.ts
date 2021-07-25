import { Environment } from "../structures/environment"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"
import { capitilizeFirstLetter, getType } from "../helper"

import { LSClass } from "../functions/class"
import { Callable } from "../functions/callable"
import { Function } from "../functions/function"
import { Instance } from "../functions/instance"
import { ReturnException } from "../functions/return-exception"

import { Visitor as StmtVisitor, Stmt, Block, Class, Expression, Func, If, Print, Return, Var, While } from "../structures/stmt"
import { Visitor as ExprVisitor, Expr, Assign, Binary, Call, Get, Grouping, Literal, Logical, Self, Set, Super, Unary, Variable } from "../structures/expr"

export class Interpreter implements ExprVisitor<TokenValue>, StmtVisitor<void> {
    tokens: Token[];
    globals: Environment;
    environment: Environment;
    errorhandler: ErrorHandler;
    locals: Map<Expr, number> = new Map();

    constructor(tokens: Token[], errorhandler: ErrorHandler) {
        this.tokens = tokens;
        this.errorhandler = errorhandler;
        this.globals = new Environment(null, errorhandler);
        this.environment = this.globals;
    }

    interpret(statements: Stmt[]) {
        for (let statement of statements) {
            try { this.execute(statement); }
            catch(e) { return console.log(this.errorhandler.stringify()); }
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
        throw this.errorhandler.newError(`Invalid Function ${type}`, text, line, pos);
    }

    binaryErr(kw1: string, kw2: string, v1: TokenValue, v2: TokenValue, op: Token, left: TokenValue) {
        let text = `Cannot ${kw1} type ${capitilizeFirstLetter(getType(v2))} ${kw2} type ${capitilizeFirstLetter(getType(v1))} on line ${op.line}`;
        let token = this.tokens[this.tokens.findIndex(i => i.line === op.line && i.rowpos === op.rowpos) + (getType(left) !== "number" ? -1 : 1)];
        throw this.errorhandler.newError("Type Error", text, token.line, token.rowpos);
    }

    // Visit Expressions
    visitAssignExpr(expr: Assign) {
        let value = this.evaluate(expr.value);
        let distance = this.locals.get(expr);

        if (distance !== undefined) this.environment.assign(expr.name, value, this.tokens, true, distance);
        else this.globals.assign(expr.name, value, this.tokens);

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
                        let token = this.tokens[this.tokens.findIndex(i => i.line === o.line && i.rowpos === o.rowpos) + 1];
                        throw this.errorhandler.newError("Type Error", text, token.line, token.rowpos);
                    }
                    else return Array(r).fill(l).join("");
                } else this.binaryErr("multiply", "to", l, r, o, l);
            case "DIV":
                if (typeof l === "number" && typeof r === "number") {
                    if (r === 0) {
                        let text = `Cannot divide a number by 0 on line ${o.line}`;                        
                        let token = this.tokens[this.tokens.findIndex(i => i.line === o.line && i.rowpos === o.rowpos) + 1];
                        throw this.errorhandler.newError("Zero Division Error", text, token.line, token.rowpos);
                    }
                    return l / r;
                }
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

        return fn.call(this, current, args, this.errorhandler);
    }

    visitGetExpr(expr: Get) {
        let obj = this.evaluate(expr.obj);

        if (obj instanceof Instance) return obj.get(expr.name);

        let text = `Only instances have properties on line ${expr.name.line}`;
        throw this.errorhandler.newError("Type Error", text, expr.name.line, expr.name.rowpos);
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
            throw this.errorhandler.newError("Type Error", text, expr.name.line, expr.name.rowpos);
        }

        let val = this.evaluate(expr.val);
        obj.set(expr.name, val);
        return val;
    }

    visitSuperExpr(expr: Super) {
        let distance = this.locals.get(expr);
        if (distance) {
            let superclass = this.environment.getAt(distance, "super");
            if (superclass instanceof LSClass) {
                let object = this.environment.getAt(distance - 1, "self");
                let method = superclass.findMethod(expr.method.stringify());
                if (method !== null) {
                    if (object instanceof Instance) return method.bind(expr.keyword, object, this.errorhandler);
                    else {
                        let text = `'self' does not point to an instance in the superclass on line ${expr.keyword.line}`;
                        throw this.errorhandler.newError("Class Error", text, expr.keyword.line, expr.keyword.rowpos);
                    }
                } else {
                    let text = `Undefined property ${expr.method.stringify()} on line ${expr.method.line}`;
                    throw this.errorhandler.newError("Class Error", text, expr.method.line, expr.method.rowpos);
                }
            } else {
                let text = `Super does not point to a class on line ${expr.keyword.line}`;
                throw this.errorhandler.newError("Class Error", text, expr.keyword.line, expr.keyword.rowpos);
            }
        } else {
            let text = `Unresolved super expression on line ${expr.keyword.line}`;
            throw this.errorhandler.newError("Syntax Error", text, expr.keyword.line, expr.keyword.rowpos);
        }
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
        this.executeBlock(stmt.statements, new Environment(this.environment, this.errorhandler));
        return null;
    }

    visitClassStmt(stmt: Class) {
        let superclass = null;
        if (stmt.superclass !== null) {
            superclass = this.evaluate(stmt.superclass);
            if (!(superclass instanceof LSClass)) {
                let text = `Superclass must be a class on line ${stmt.superclass.name.line}`;
                throw this.errorhandler.newError("Class Error", text, stmt.superclass.name.line, stmt.superclass.name.rowpos)
            }
        }

        if (stmt.superclass !== null) {
            this.environment = new Environment(this.environment, this.errorhandler);
            let s = <Token>stmt.superclass.name;
            let index = this.tokens.findIndex(i => i.line === s.line && i.rowpos === s.rowpos);
            let token = this.tokens[index + 2];
            this.environment.define(new Token("SUPER", "super", token.line, token.rowpos), true, superclass, "VAR", []);
        }

        let methods: Map<string, Function> = new Map();
        for (let method of stmt.methods) {
            if (superclass && superclass.methods.has(method.name.stringify()) && method.name.stringify() !== "init" && !method.overridden) {
                let text = `Method '${method.name.stringify()}' is already defined in the superclass on line ${method.name.line}`
                this.errorhandler.newError("Class Error", text, method.name.line, method.name.rowpos);
                text = `You can override it with a 'override' keyword in front of the method name`;
                throw this.errorhandler.newHelp(text);
            }
            let func = new Function(method, this.environment, method.name.stringify() === "init");
            methods.set(method.name.stringify(), func);
        }

        let _class = new LSClass(stmt.name.stringify(), superclass, methods, this.errorhandler);
        if (superclass !== null) this.environment = this.environment.enclosing ? this.environment.enclosing : this.environment;
        this.environment.define(stmt.name, true, _class, "CLASS", []);
    }

    visitExpressionStmt(stmt: Expression) {
        this.evaluate(stmt.expression);
    }

    visitFuncStmt(stmt: Func) {
        let func = new Function(stmt, this.environment, false);
        this.environment.define(stmt.name, true, func, "FUNCTION", []);
    }

    visitIfStmt(stmt: If) {
        if (this.evaluate(stmt.condition)) this.execute(stmt.thenBranch);
        else if (stmt.elseBranch !== null) this.execute(stmt.elseBranch);
        return null;
    }

    visitPrintStmt(stmt: Print) {
        let value = this.evaluate(stmt.expression);
        if (value instanceof Function || value instanceof LSClass || value instanceof Instance) value = value.stringify();

        console.log(value);
    }

    visitReturnStmt(stmt: Return) {
        let value: TokenValue = null;
        if (stmt.value !== null) value = this.evaluate(stmt.value); 

        throw new ReturnException(value);
    }

    visitVarStmt(stmt: Var) {
        let value: TokenValue = null;
        if (stmt.initializer !== null) {
            value = this.evaluate(stmt.initializer);

            let token = this.tokens[this.tokens.findIndex(i => i.line === stmt.name.line && i.rowpos === stmt.name.rowpos) + 4];
            if ((!stmt.types.includes("Number") && typeof value === "number") ||
                (!stmt.types.includes("String") && typeof value === "string") ||
                (!stmt.types.includes("Boolean") && typeof value === "boolean") ||
                (!stmt.types.includes("Null") && value === null)) {
                let type = capitilizeFirstLetter((typeof value).toString());
                let text = `Cannot assign type ${type} to a variable with type ${stmt.types.join(" | ")} on line ${token.line}`;
                throw this.errorhandler.newError("Type Error", text, token.line, token.rowpos);
            }
        }

        if (stmt.name.value) this.environment.define(stmt.name, stmt.constant, value, "VAR", stmt.types);
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
        else return this.globals.get(name);
    }
}