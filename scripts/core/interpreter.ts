import { LSTypes } from "../data/constants"
import { Funcs } from "../data/funcs"
import { Environment } from "../structures/environment"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler, ErrorHeader } from "../structures/errorhandler"
import { capitilizeFirstLetter, isTruthy, isCallable, getType, checkType, checkArgType, accept, isEqual } from "../data/helper"

import { Method } from "../data/types"
import { Module } from "../expressions/module"
import { Modules } from "../data/modules/modules"

import { LSClass } from "../functions/class"
import { Function } from "../functions/function"
import { Instance } from "../functions/instance"
import { ReturnException } from "../functions/return-exception"

import { LSString } from "../expressions/string"
import { LSNumber } from "../expressions/number"
import { LSArray } from "../expressions/array"

import { Visitor as StmtVisitor, Stmt, Block, Class, Expression, Func, If, Import, Return, Var, While } from "../data/stmt"
import { Visitor as ExprVisitor, Expr, Assign, Binary, Call, Get, Grouping, Literal, Logical, Self, Set, Super, Unary, Variable } from "../expressions/expr"

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

        for (let i of Funcs) this.globals.define(new Token("NATIVEFUNC", i.name, 0, 0), true, i.func, "FUNCTION", ["Any"]);
    }

    interpret(statements: Stmt[]) {
        for (let statement of statements) {
            try { this.execute(statement); }
            catch(e) { return console.log(this.errorhandler.stringify(e)); }
        }
    }

    // Functions
    execute(stmt: Stmt) { stmt.accept(this); }
    resolve(expr: Expr, depth: number) { this.locals.set(expr, depth); }
    evaluate(expr: Expr): TokenValue { return accept(expr, this); }

    functionErr(text: string, type: string, line: number, pos: number) {
        throw this.errorhandler.newError(`Invalid Function ${type}` as ErrorHeader, text, line, pos);
    }

    binaryErr(kw1: string, kw2: string, v1: TokenValue, v2: TokenValue, op: Token, left: TokenValue) {
        let text = `Cannot ${kw1} type ${capitilizeFirstLetter(getType(v2))} ${kw2} type ${capitilizeFirstLetter(getType(v1))} on line ${op.line}`;
        let token = this.tokens[this.tokens.findIndex(i => i.line === op.line && i.rowpos === op.rowpos) + 1];
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
                if (Array.isArray(l)) return [...l, r];
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
                        throw this.errorhandler.newError("Math Error", text, token.line, token.rowpos);
                    }
                    return l / r;
                }
                this.binaryErr("divide", "from", l, r, o, l);
            case "MOD":
                if (typeof l === "number" && typeof r === "number") return l % r;
                this.binaryErr("modulate", "from", l, r, o, l);
            case "CARET":
                if (typeof l === "number" && typeof r === "number") {
                    if (l < 0 && r < 1 && r > 0) {
                        let text = `Cannot take root of a negative number on line ${o.line}`;
                        let token = this.tokens[this.tokens.findIndex(i => i.line === o.line && i.rowpos === o.rowpos) + 1];
                        throw this.errorhandler.newError("Math Error", text, token.line, token.rowpos);
                    }
                    return l ** r;
                }
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
            case "BANGEQUAL": return !isEqual(l, r);
            case "EQUALEQUAL": return isEqual(l, r);
        }
        
        return null;
    }

    visitCallExpr(expr: Call) {
        let callee = this.evaluate(expr.callee);
        let token: Token;
        
        if (expr.callee instanceof Variable) token = (expr.callee as Variable).name;
        else if (expr.callee instanceof Super) token = (expr.callee as Super).method;
        else token = (expr.callee as Get).name;

        let idx = this.tokens.findIndex(i => i.line === token.line && i.rowpos === token.rowpos) + 2;

        let args = [];
        for (let arg of expr.args) {
            args.push({ token: this.tokens[idx], value: this.evaluate(arg) });

            while (this.tokens[idx] && this.tokens[idx].type !== "COMMA") idx++;
            idx++;
        }

        let current = (expr.callee as any).name;
        if (!isCallable(callee)) throw this.functionErr("Can only call functions and classes", "Call", current.line, current.rowpos);

        let fn = callee;
        current = expr.paren;
        
        let arity = fn.arity();
        let expected = arity[0] === arity[1] ? arity[0] : `${arity[0]}-${arity[1]}`;
        let text = `Expected ${expected} arguments but got ${args.length}`;
        if (args.length < arity[0] || args.length > arity[1]) throw this.functionErr(text, "Call", current.line, current.rowpos);

        let funcArgs = (fn as any).arguments;

        if (!(fn instanceof Function) && funcArgs) {
            let defaultArgType: LSTypes[] = ["Any"]; // This is just for conserving the argument type in module methods

            for (let i = 0; i < args.length; i++) {
                let arg = funcArgs[i];
                let name = arg ? arg.name : `arg${i + 1}`;
                let types = arg ? arg.types : defaultArgType;
                defaultArgType = types;

                checkArgType(name, types, args[i], this.errorhandler);
            }
        }

        return fn.call(this, current, args);
    }

    visitGetExpr(expr: Get) {
        let obj = this.evaluate(expr.obj);

        if (typeof obj === "string") return new LSString(obj).get(expr.name.stringify());
        if (typeof obj === "number") return new LSNumber(obj).get(expr.name.stringify());
        if (Array.isArray(obj)) return new LSArray(obj).get(expr.name.stringify());

        if (obj instanceof Instance) return obj.get(expr.name, this.errorhandler);

        if (obj instanceof Module) return obj.get(expr.name, this.errorhandler);

        let text = `Property '${expr.name.stringify()}' does not exist on '${obj}' on line ${expr.name.line}`;
        throw this.errorhandler.newError("Type Error", text, expr.name.line, expr.name.rowpos);
    }

    visitGroupingExpr(expr: Grouping) { return this.evaluate(expr.expression); }

    visitLiteralExpr(expr: Literal) { return expr.value; }

    visitLogicalExpr(expr: Logical) {
        let left = this.evaluate(expr.left);

        if (expr.operator.type === "OR") {
            if (isTruthy(left)) return left;
        } else {
            if (!isTruthy(left)) return left;
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

        if (expr.operator.type === "BANG") return !isTruthy(rightRaw);
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
            this.environment.define(new Token("SUPER", "super", token.line, token.rowpos), true, superclass, "VAR", ["Any"]);
        }

        let methods: Map<string, Function> = new Map();
        for (let method of stmt.methods) {
            if (superclass && superclass.methods.has(method.name.stringify()) && method.name.stringify() !== "init" && !method.overridden) {
                let text = `Method '${method.name.stringify()}' is already defined in the superclass on line ${method.name.line}`
                this.errorhandler.newError("Class Error", text, method.name.line, method.name.rowpos);
                text = `You can override it with a 'override' keyword in front of the method name`;
                throw this.errorhandler.newHelp(text);
            }
            let func = new Function(method, this.environment, method.name.stringify() === "init", method.returntypes);
            methods.set(method.name.stringify(), func);
        }

        let _class = new LSClass(stmt.name.stringify(), superclass, methods);
        if (superclass !== null) this.environment = this.environment.enclosing ? this.environment.enclosing : this.environment;
        this.environment.define(stmt.name, true, _class, "CLASS", ["Any"]);
    }

    visitExpressionStmt(stmt: Expression) { this.evaluate(stmt.expression); }

    visitFuncStmt(stmt: Func) {
        let func = new Function(stmt, this.environment, false, stmt.returntypes);
        this.environment.define(stmt.name, true, func, "FUNCTION", ["Any"]);
    }

    visitIfStmt(stmt: If) {
        if (isTruthy(this.evaluate(stmt.condition))) this.execute(stmt.thenBranch);
        else if (stmt.elseBranch !== null) this.execute(stmt.elseBranch);
        return null;
    }

    visitImportStmt(stmt: Import) {
        if (!Modules[stmt.module.stringify()]) {
            let text = `Module '${stmt.module.stringify()}' does not exist on line ${stmt.module.line}`;
            throw this.errorhandler.newError("Import Error", text, stmt.module.line, stmt.module.rowpos);
        }

        let key = this.environment.get(new Token("IDENTIFIER", stmt.module.stringify(), 0, 0), false);
        if (key && stmt.name.stringify() === stmt.module.stringify()) {
            let text = `Variable with the name '${stmt.module.stringify()}' already exists when importing module on line ${stmt.module.line}`;
            this.errorhandler.newError("Import Error", text, stmt.module.line, stmt.module.rowpos);
            throw this.errorhandler.newHelp("You can add a 'as' keyword followed by an identifier to rename the module");
        }

        let module = Modules[stmt.module.stringify()];

        let properties = new Map<string, TokenValue>();
        for (let i of module.properties) properties.set(i.name, i.value);

        let methods = new Map<string, Method>();        
        for (let i of module.methods) methods.set(i.name, i);

        this.environment.define(stmt.name, true, new Module(stmt.name.stringify(), methods, properties), "MODULE", ["Any"]);
    }

    visitReturnStmt(stmt: Return) {
        let value: TokenValue = null;
        if (stmt.value !== null) value = this.evaluate(stmt.value); 

        let token = stmt.value ? this.tokens[this.tokens.findIndex(i => i.line === stmt.keyword.line && i.rowpos === stmt.keyword.rowpos) + 1] : null;
        throw new ReturnException(value, stmt.keyword, token);
    }

    visitVarStmt(stmt: Var) {
        let value: TokenValue = null;
        if (stmt.initializer !== null) {
            value = this.evaluate(stmt.initializer);
            let token = stmt.initializer as Literal;
            if (!checkType(stmt.types, value)) {
                let type = capitilizeFirstLetter((typeof value).toString());
                let text = `Cannot assign type ${type} to a variable with type ${stmt.types.join(" | ")} on line ${token.line}`;
                throw this.errorhandler.newError("Type Error", text, token.line, token.rowpos);
            }
        }

        if (stmt.name.value) this.environment.define(stmt.name, stmt.constant, value, "VAR", stmt.types);
    }

    visitWhileStmt(stmt: While) {
        while (isTruthy(this.evaluate(stmt.condition))) this.execute(stmt.body);
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
        let key: TokenValue = distance !== undefined ? this.environment.getAt(distance, "", name) : this.globals.get(name);
        
        if (isTruthy(key)) return key;
        else return null;
    }
}