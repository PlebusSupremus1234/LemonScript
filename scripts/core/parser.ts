import { FuncArgs } from "../functions/function"
import { TokenType as T, LSTypes } from "../data/constants"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"

import { Stmt, Block, Class, Expression, Func, If, Import, Return, Var, While } from "../data/stmt"
import { Expr, Assign, Binary, Call, Get, Grouping, Literal, Logical, Self, Set, Super, Unary, Variable } from "../expressions/expr"

export class Parser {
    pos = 0;
    tokens: Token[];
    errorhandler: ErrorHandler;

    constructor(tokens: Token[], errorhandler: ErrorHandler) {
        this.tokens = tokens;
        this.errorhandler = errorhandler;
    }

    parse(): void | Stmt[] {
        let statements: Stmt[] = [];
        while (!this.isAtEnd()) {
            let statement: Stmt;
            try { statement = this.declaration(); }
            catch(e) { return console.log(this.errorhandler.stringify(e)); }
            statements.push(statement);
        }
        return statements;
    }

    // Declarations
    declaration() {
        if (this.match(T.CLASS)) return this.classDeclaration();
        if (this.match(T.FUNC)) return this.function("function");
        if (this.match(T.VAR)) return this.varDeclaration(false);
        if (this.match(T.CONST)) return this.varDeclaration(true);
        return this.statement();
    }

    statement() {
        if (this.match(T.IF)) return this.ifStatement();
        else if (this.match(T.IMPORT)) return this.importStatement();
        else if (this.match(T.RETURN)) return this.returnStatement();
        else if (this.match(T.WHILE)) return this.whileStatement();
        else if (this.match(T.FOR)) return this.forStatement();
        else if (this.match(T.LBRACE)) return new Block(this.block(this.tokens[this.pos - 1]));

        return this.expressionStatement();
    }

    varDeclaration(constant: boolean): Var {
        let name = this.advance();
        
        if (name.type !== T.IDENTIFIER) {
            let text = `Variable name must be an identifier and cannot be a keyword, number, type or invalid symbol on line ${name.line}`;
            throw this.errorhandler.newError("Variable Error", text, name.line, name.rowpos);
        }

        let initializer: Expr | null = null;
        let valueT: Token | null = null;
        let types: LSTypes[] = [];

        if (this.match(T.EQUAL)) {
            valueT = this.tokens[this.pos];
            initializer = this.expression();
        } else {
            let token = this.tokens[this.pos];
            if (this.match(T.COLON)) {
                while (true) {
                    token = this.tokens[this.pos];
                    if (this.match(T.TYPE) && typeof token.value === "string") {
                        let type = token.value as LSTypes;
                        if (!types.includes(type)) {
                            let push = type;
                            if (type === "Array") {
                                if (this.match(T.LESS)) push = this.getTypes();
                                if (!this.match(T.GREATER)) {
                                    token = this.tokens[this.pos - 1];
                                    if (token) {
                                        let rowpos = token.rowpos + (token.value as string).length;
                                        throw this.errorhandler.newError("Syntax Error", `Expected an '>' after type on line ${token.line}`, token.line, rowpos);
                                    }
                                }
                            }
                            types.push(push);
                        }

                        token = this.tokens[this.pos];
                        if (this.match(T.EQUAL)) {
                            valueT = this.tokens[this.pos];
                            initializer = this.expression();
                        }
                        
                        if (token.type !== T.PIPE) break;
                        this.advance();
                    } else {
                        let text = `Expected a valid type on line ${token.line}`;
                        throw this.errorhandler.newError("Syntax Error", text, token.line, token.rowpos);
                    }
                }
            } else {
                let text = `Unexpected token '${token.stringify()}' detected on line ${token.line}`;
                throw this.errorhandler.newError("Syntax Error", text, token.line, token.rowpos);
            }
        }

        return new Var(name, valueT, constant, types.length > 0 ? types : ["Any"], initializer);
    }

    classDeclaration() {
        let text = `Expected a class name`;
        if (!this.check(T.IDENTIFIER)) throw this.errorhandler.newError("Class Error", text, this.tokens[this.pos].line, this.tokens[this.pos].rowpos);
        let name = this.advance();
        
        let superclass: null | Variable = null;
        if (this.match(T.EXTENDS)) {
            text = `Expected a superclass name`;
            if (!this.check(T.IDENTIFIER)) this.genSyntaxErr(this.tokens[this.pos], text, 0);
            else {
                superclass = new Variable(this.tokens[this.pos]);
                this.advance();
            }
        }

        text = `Expected a '{' after class identifier`;
        if (!this.check(T.LBRACE)) this.genSyntaxErr(this.tokens[this.pos], text, 0);
        this.advance();

        let methods = [];
        while (!this.check(T.RBRACE) && !this.isAtEnd()) methods.push(this.function("method"));
        
        text = `Expected a '}' after class body`;
        if (!this.check(T.RBRACE)) this.genSyntaxErr(this.tokens[this.pos], text, 0);
        this.advance();

        return new Class(name, superclass, methods);
    }

    function(kind: string) {
        let name: Token;
        let curr = this.tokens[this.pos];
        let overridden = false;

        if (this.check(T.OVERRIDE)) {
            if (kind !== "method") {
                let text = `Expected a function name on line ${curr.line}`;
                throw this.genFunctionErr(text, curr.line, curr.rowpos);
            } else {
                overridden = true;
                this.advance();
            }
        }

        if (!this.check(T.IDENTIFIER)) throw this.genFunctionErr(`Expected a ${kind} name on line ${curr.line}`, curr.line, curr.rowpos);
        else name = this.advance();

        if (!this.check(T.LPAREN)) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a '(' after ${kind} name`, this.tokens[this.pos - 1].stringify().length);
        else this.advance();

        let parameters: FuncArgs[] = [];
        if (!this.check(T.RPAREN)) {
            let hasOptional = false;
            do {
                curr = this.tokens[this.pos - 1];
                if (parameters.length >= 255) {
                    let text = `Function on line ${curr.line} cannot have more than 255 parameters`;
                    this.genFunctionErr(text, curr.line, curr.rowpos);
                }

                let append: Token;
                let optional = false;
                let types: LSTypes[] = ["Any"];

                if (!this.check(T.IDENTIFIER)) throw this.genFunctionErr(`Expected a parameter name`, curr.line, curr.rowpos + 1);
                else append = this.advance();

                if (this.match(T.EROTEME)) {
                    optional = true;
                    hasOptional = true;
                } else if (hasOptional) {
                    let token = this.tokens[this.pos - 1];
                    let text = `A required parameter cannot follow an optional parameter on line ${token.line}`;
                    throw this.errorhandler.newError("Invalid Function Declaration", text, token.line, token.rowpos);
                }

                if (this.match(T.COLON)) types = this.getTypes();

                if (types.length === 0) types = ["Any"];
                parameters.push({ name: append, optional, types });
            } while (this.match(T.COMMA));
        }

        if (!this.check(T.RPAREN)) this.genSyntaxErr(this.tokens[this.pos], `Expected a ')' after parameters`, 0);
        else this.advance();

        let returntypes: LSTypes[] = ["Any"];
        if (this.match(T.COLON)) returntypes = this.getTypes();

        if (!this.check(T.LBRACE)) this.genSyntaxErr(this.tokens[this.pos], `Expected a '{' before ${kind} body`, 0);
        else this.advance();

        let body = this.block(this.tokens[this.pos - 1]);
        return new Func(name, parameters, returntypes.length > 0 ? returntypes : ["Any"], body, overridden);
    }

    // Functions
    isAtEnd(): boolean { return this.tokens[this.pos].type === T.EOF; }

    genSyntaxErr(token: Token, text: string, offset: number): void {
        throw this.errorhandler.newError("Syntax Error", `${text} on line ${token.line}`, token.line, token.rowpos + offset);
    }

    genFunctionErr(text: string, line: number, rowpos: number, call?: boolean): void {
        throw this.errorhandler.newError(`Invalid Function ${call ? "Call" : "Declaration"}`, text, line, rowpos);
    }

    advance(): Token {
        if (!this.isAtEnd()) this.pos++;
        return this.tokens[this.pos - 1];
    }

    check(type: T): boolean {
        if (this.isAtEnd()) return false;
        return this.tokens[this.pos].type === type;
    }

    match(...types: T[]): boolean {
        for (let i of types) {
            if (this.check(i)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    getTypes(): LSTypes[] {
        let types: LSTypes[] = [];

        let token = this.tokens[this.pos];
        while (true) {
            token = this.tokens[this.pos];
             if (this.match(T.TYPE) && typeof token.value === "string") {
                let type = token.value as LSTypes;
                if (!types.includes(type)) {
                    let push = type;
                    if (type === "Array") {
                        if (this.match(T.LESS)) push = this.getTypes();
                            if (!this.match(T.GREATER)) {
                            token = this.tokens[this.pos - 1];
                            if (token) {
                                let rowpos = token.rowpos + (token.value as string).length;
                                throw this.errorhandler.newError("Syntax Error", `Expected an '>' after type on line ${token.line}`, token.line, rowpos);
                            }
                        }
                    }
                    types.push(push);
                }
                
                if (this.tokens[this.pos].type !== T.PIPE) break;
                this.advance();
            } else {
                let text = `Expected a valid type on line ${token.line}`;
                throw this.errorhandler.newError("Syntax Error", text, token.line, token.rowpos);
            }
        }

        return types.length > 0 ? types : ["Any"];
    }

    // Expressions
    expression(): Expr {
        return this.assignment();
    }

    assignment(): Expr {
        let t = this.tokens[this.pos];
        let expr = this.or();

        if (this.match(T.EQUAL, T.PLUSEQUAL, T.MINUSEQUAL, T.MULEQUAL, T.DIVEQUAL, T.MODEQUAL, T.CARETEQUAL)) {
            let token = this.tokens[this.pos - 1];
            let value = this.assignment();

            if (token.type !== T.EQUAL && token.value) {
                let type = T[token.type];
                let key = type.substring(0, type.length - 5) as keyof typeof T;
                let newToken = new Token(T[key], (token.value as string)[0], token.line, token.rowpos);
                value = new Binary(expr, newToken, value);
            }

            if (expr instanceof Variable) return new Assign(expr.name, value);
            else if (expr instanceof Get) return new Set(expr.obj, expr.name, value);

            this.genSyntaxErr(t, `Invalid assignment target`, 0);
        }

        return expr;
    }

    or() {
        let expr = this.and();

        while (this.match(T.OR)) {
            let operator = this.tokens[this.pos - 1];
            let right = this.and();
            expr = new Logical(expr, operator, right);
        }

        return expr;
    }

    and() {
        let expr = this.equality();

        while (this.match(T.AND)) {
            let operator = this.tokens[this.pos - 1];
            let right = this.equality();
            expr = new Logical(expr, operator, right);
        }

        return expr;
    }

    equality(): Expr {
        let expr = this.comparison();

        while (this.match(T.BANGEQUAL, T.EQUALEQUAL)) {
            let operator = this.tokens[this.pos - 1];
            let right = this.comparison();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    comparison(): Expr {
        let expr = this.term();

        while (this.match(T.GREATER, T.GREATEREQUAL, T.LESS, T.LESSEQUAL)) {
            let operator = this.tokens[this.pos - 1];
            let right = this.term();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    term(): Expr {
        let expr = this.factor();

        while (this.match(T.MINUS, T.PLUS)) {
            let operator = this.tokens[this.pos - 1];
            let right = this.factor();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    factor(): Expr {
        let expr = this.mod();

        while (this.match(T.DIV, T.MUL)) {
            let operator = this.tokens[this.pos - 1];
            let right = this.mod();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    mod(): Expr {
        let expr = this.power();

        while (this.match(T.MOD)) {
            let operator = this.tokens[this.pos - 1];
            let right = this.power();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    power(): Expr {
        let expr = this.unary();

        while (this.match(T.CARET)) {
            let operator = this.tokens[this.pos - 1];
            let right = this.unary();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    unary(): Expr {
        if (this.match(T.BANG, T.MINUS)) {
            let operator = this.tokens[this.pos - 1];
            let right = this.unary();
            return new Unary(operator, right);
        }
        return this.call();
    }

    call() {
        let expr: Expr = this.primary();
        while (true) {
            if (this.match(T.LPAREN)) expr = this.finishCall(expr);
            else if (this.match(T.DOT)) {
                if (!this.check(T.IDENTIFIER)) throw this.genSyntaxErr(this.tokens[this.pos], `Expected a property name after '.'`, 0);
                else {
                    let name = this.advance();
                    expr = new Get(expr, name);
                }
            } else break;
        }
        return expr;
    }

    primary(): Expr {
        if (this.match(T.STRING, T.NUMBER, T.BOOLEAN, T.NULL)) {
            let token = this.tokens[this.pos - 1];
            let value: TokenValue;

            if (token.type === T.NUMBER || token.type === T.STRING  ) value = token.value;
            else if (token.type === T.BOOLEAN) value = token.value === "true";
            else value = null;

            return new Literal(token.type, value, token.line, token.rowpos);
        }

        if (this.match(T.SUPER)) {
            let keyword = this.tokens[this.pos - 1];

            if (!this.check(T.DOT)) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a '.' after super`, 5);
            this.advance();

            let text = `Expected a superclass method name on line ${this.tokens[this.pos].line}`;
            if (!this.check(T.IDENTIFIER)) throw this.errorhandler.newError("Class Error", text, this.tokens[this.pos].line, this.tokens[this.pos].rowpos);
            let method = this.advance();

            return new Super(keyword, method);
        }

        if (this.match(T.LBRACKET)) {
            let args: Expr[] = [];
            if (!this.check(T.RBRACKET)) {
                do args.push(this.expression());
                while (this.match(T.COMMA));
            }

            let paren: Token;
            if (!this.check(T.RBRACKET)) throw this.genSyntaxErr(this.tokens[this.pos], `Expected a ']' after array`, 0);
            else paren = this.advance();

            return args;
        }

        if (this.match(T.SELF)) return new Self(this.tokens[this.pos - 1]);
        if (this.match(T.IDENTIFIER)) return new Variable(this.tokens[this.pos - 1]);

        let lparenpos = this.pos;
        if (this.match(T.LPAREN)) {
            let expr = this.expression();
            if (this.check(T.RPAREN)) {
                this.advance();
                return new Grouping(expr);
            } else this.genSyntaxErr(this.tokens[lparenpos], `Expected a ')' after expression`, 0);
        }

        let token = this.tokens[this.pos];
        let text = `Expected an expression`;
        throw this.genSyntaxErr(token, text, 0);
    }

    // Statements
    expressionStatement(): Expression {
        let expr = this.expression();
        return new Expression(expr);
    }

    forStatement(): Stmt {
        if (!this.check(T.LPAREN)) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a '(' after 'for' statement`, 3);
        this.advance();

        let initializer: Stmt | null = null;
        if (this.match(T.SEMICOLON)) initializer = null;
        else {
            if (this.match(T.VAR)) initializer = this.varDeclaration(false);
            else if (this.match(T.CONST)) initializer = this.varDeclaration(true);
            else initializer = this.expressionStatement();

            this.advance();
        }

        let condition: Expr | null = null;
        if (!this.check(T.SEMICOLON)) condition = this.expression();
        if (!this.check(T.SEMICOLON)) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a ';' after 'for' condition`, 3);
        else this.advance();

        let increment: Expr | null = null;
        if (!this.check(T.RPAREN)) increment = this.expression();
        if (!this.check(T.RPAREN)) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a ')' after 'for' clauses`, 3);
        else this.advance();

        let body: Stmt = this.statement();
        if (increment !== null) body = new Block([body, new Expression(increment)]);

        if (condition === null) condition = new Literal(T.BOOLEAN, true, 0, 0);
        body = new While(condition, body);
        if (initializer !== null) body = new Block([initializer, body]);

        return body;
    }

    ifStatement(): If {
        if (!this.check(T.LPAREN)) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a '(' after 'if' statement`, 2);
        let condition = this.expression();

        let thenBranch: Stmt = this.statement();
        let elseBranch: Stmt | null = null;

        if (this.match(T.ELIF)) elseBranch = this.ifStatement();
        else if (this.match(T.ELSE)) elseBranch = this.statement();

        return new If(condition, thenBranch, elseBranch);
    }

    importStatement(): Import {
        let token = this.tokens[this.pos];
        let text = `Expected a valid import name on line ${token.line}`;
        if (!this.check(T.IDENTIFIER)) throw this.errorhandler.newError("Syntax Error", text, token.line, token.rowpos);

        let name = this.advance();
        let variablename: null | Token = null;

        if (this.match(T.AS)) {
            token = this.tokens[this.pos];
            text = `Expected a valid variable name on line ${token.line}`;
            if (!this.check(T.IDENTIFIER)) throw this.errorhandler.newError("Syntax Error", text, token.line, token.rowpos);
            variablename = this.advance();
        }

        return new Import(name, variablename ? variablename : name);
    }

    returnStatement(): Return {
        let keyword = this.tokens[this.pos - 1];
        let value: Expr | null = null;
        if (this.tokens[this.pos].line === keyword.line) value = this.expression();

        return new Return(keyword, value);
    }

    whileStatement(): While {
        if (!this.check(T.LPAREN)) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a '(' after 'while' statement`, 5);

        let condition = this.expression();
        let body: Stmt = this.statement();

        return new While(condition, body);
    }

    // Other
    block(lbrace: Token): Stmt[] {
        let statements: Stmt[] = [];
        while (!this.check(T.RBRACE) && !this.isAtEnd()) statements.push(this.declaration());

        if (!this.check(T.RBRACE)) throw this.genSyntaxErr(lbrace, `Expected a closing '}' after scope`, 0);
        else {
            this.advance();
            return statements;
        }
    }

    finishCall(callee: Expr) {
        let args: Expr[] = [];
        if (!this.check(T.RPAREN)) {
            do {
                if (args.length >= 255) {
                    let current = this.tokens[this.pos];
                    this.genFunctionErr(`Function call cannot have more than 255 arguments`, current.line, current.rowpos, true);
                }
                args.push(this.expression());
            } while (this.match(T.COMMA));
        }

        let paren: Token;
        if (!this.check(T.RPAREN)) throw this.genSyntaxErr(this.tokens[this.pos], `Expected a ')' after function arguments`, 0);
        else paren = this.advance();

        return new Call(callee, paren, args);
    }
}