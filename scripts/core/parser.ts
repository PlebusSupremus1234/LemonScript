import { Token } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"
import { TokenType, LSTypes } from "../constants"

import { Stmt, Block, Class, Expression, Func, If, Print, Return, Var, While } from "../structures/stmt"
import { Expr, Assign, Binary, Call, Get, Grouping, Literal, Logical, Self, Set, Super, Unary, Variable } from "../structures/expr"

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
            catch(e) { return console.log(this.errorhandler.stringify()); }
            statements.push(statement);
        }
        return statements;
    }

    // Declarations
    declaration() {
        if (this.match(["CLASS"])) return this.classDeclaration();
        if (this.match(["FUNC"])) return this.function("function");
        if (this.match(["VAR"])) return this.varDeclaration(false);
        if (this.match(["CONST"])) return this.varDeclaration(true);
        return this.statement();
    }

    statement() {
        if (this.match(["IF"])) return this.ifStatement();
        if (this.match(["PRINT"])) return this.printStatement();
        if (this.match(["RETURN"])) return this.returnStatement();
        if (this.match(["WHILE"])) return this.whileStatement();
        if (this.match(["FOR"])) return this.forStatement();
        if (this.match(["LBRACE"])) return new Block(this.block(this.tokens[this.pos - 1]));

        return this.expressionStatement();
    }

    varDeclaration(constant: boolean): Var {
        let name = this.advance();

        if (name.type !== "IDENTIFIER") {
            let text = `Variable name must be an identifier and cannot be a keyword, number, type or invalid symbol on line ${name.line}`;
            throw this.errorhandler.newError("Invalid Variable Name", text, name.line, name.rowpos);
        }

        let initializer: Expr | null = null;
        let type: LSTypes = "ANY";

        if (this.match(["EQUAL"])) initializer = this.expression();
        else {
            let token = this.tokens[this.pos];
            if (this.match(["COLON"])) {
                token = this.tokens[this.pos];
                if (this.match(["TYPE"]) && typeof token.value === "string") {
                    type = token.value;
                    token = this.tokens[this.pos];
                    if (this.match(["EQUAL"])) initializer = this.expression();
                } else {
                    let text = `Expected a valid type after colon on on line ${token.line}`;
                    throw this.errorhandler.newError("Syntax Error", text, token.line, token.rowpos);
                }
            } else {
                let text = `Unexpected token '${token.stringify()}' detected on line ${token.line}`;
                throw this.errorhandler.newError("Syntax Error", text, token.line, token.rowpos);
            }
        }

        return new Var(name, constant, type, initializer);
    }

    classDeclaration() {
        let text = `Expected a class name`;
        if (!this.check("IDENTIFIER")) throw this.errorhandler.newError("Class Error", text, this.tokens[this.pos].line, this.tokens[this.pos].rowpos);
        let name = this.advance();
        
        let superclass: null | Variable = null;
        if (this.match(["LESS"])) {
            text = `Expected a superclass name`;
            if (!this.check("IDENTIFIER")) this.genSyntaxErr(this.tokens[this.pos], text, 0);
            else {
                superclass = new Variable(this.tokens[this.pos]);
                this.advance();
            }
        }

        text = `Expected a '{' after class identifier`;
        if (!this.check("LBRACE")) this.genSyntaxErr(this.tokens[this.pos], text, 0);
        this.advance();

        let methods = [];
        while (!this.check("RBRACE") && !this.isAtEnd()) methods.push(this.function("method"));
        
        text = `Expected a '}' after class body`;
        if (!this.check("RBRACE")) this.genSyntaxErr(this.tokens[this.pos], text, 0);
        this.advance();

        return new Class(name, superclass, methods);
    }

    function(kind: string) {
        let name: Token;
        let curr = this.tokens[this.pos];
        let overridden = false;

        if (this.check("OVERRIDE")) {
            if (kind !== "method") {
                let text = `Expected a function name on line ${curr.line}`;
                throw this.genFunctionErr(text, curr.line, curr.rowpos);
            } else {
                overridden = true;
                this.advance();
            }
        }

        if (!this.check("IDENTIFIER")) throw this.genFunctionErr(`Expected a ${kind} name on line ${curr.line}`, curr.line, curr.rowpos);
        else name = this.advance();

        if (!this.check("LPAREN")) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a '(' after ${kind} name`, this.tokens[this.pos - 1].stringify().length);
        else this.advance();

        let parameters = [];
        if (!this.check("RPAREN")) {
            do {
                curr = this.tokens[this.pos - 1];
                if (parameters.length >= 255) {
                    let text = `Function on line ${curr.line} cannot have more than 255 parameters`;
                    this.genFunctionErr(text, curr.line, curr.rowpos);
                }
                let append: Token;
                if (!this.check("IDENTIFIER")) throw this.genFunctionErr(`Expected a parameter name`, curr.line, curr.rowpos + 1);
                else append = this.advance();
                parameters.push(append);
            } while (this.match(["COMMA"]));
        }

        if (!this.check("RPAREN")) this.genSyntaxErr(this.tokens[this.pos], `Expected a ')' after parameters`, 0);
        else this.advance();
        if (!this.check("LBRACE")) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a '{' before ${kind} body`, 1);
        else this.advance();

        let body = this.block(this.tokens[this.pos - 1]);
        return new Func(name, parameters, body, overridden);
    }

    // Functions
    isAtEnd(): boolean { return this.tokens[this.pos].type === "EOF"; }

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

    check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.tokens[this.pos].type === type;
    }

    match(types: TokenType[]=[]): boolean {
        for (let i of types) {
            if (this.check(i)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    // Expressions
    expression(): Expr {
        return this.assignment();
    }

    assignment(): Expr {
        let t = this.tokens[this.pos];
        let expr = this.or();

        if (this.match(["EQUAL"])) {
            let value = this.assignment();

            if (expr instanceof Variable) return new Assign(expr.name, value);
            else if (expr instanceof Get) return new Set(expr.obj, expr.name, value);

            this.genSyntaxErr(t, `Invalid assignment target on line`, 0);
        }
        return expr;
    }

    or() {
        let expr = this.and();

        while (this.match(["OR"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.and();
            expr = new Logical(expr, operator, right);
        }

        return expr;
    }

    and() {
        let expr = this.equality();

        while (this.match(["AND"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.equality();
            expr = new Logical(expr, operator, right);
        }

        return expr;
    }

    equality(): Expr {
        let expr = this.comparison();

        while (this.match(["BANGEQUAL", "EQUALEQUAL"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.comparison();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    comparison(): Expr {
        let expr = this.term();

        while (this.match(["GREATER", "GREATEREQUAL", "LESS", "LESSEQUAL"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.term();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    term(): Expr {
        let expr = this.mod();

        while (this.match(["MINUS", "PLUS"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.mod();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    mod(): Expr {
        let expr = this.factor();

        while (this.match(["MOD"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.factor();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    factor(): Expr {
        let expr = this.power();

        while (this.match(["DIV", "MUL"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.power();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    power(): Expr {
        let expr = this.unary();

        while (this.match(["CARET"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.unary();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    unary(): Expr {
        if (this.match(["BANG", "MINUS"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.unary();
            return new Unary(operator, right);
        }
        return this.call();
    }

    call() {
        let expr: Expr = this.primary();
        while (true) {
            if (this.match(["LPAREN"])) expr = this.finishCall(expr);
            else if (this.match(["DOT"])) {
                if (!this.check("IDENTIFIER")) throw this.genSyntaxErr(this.tokens[this.pos], `Expected a property name after '.'`, 0);
                else {
                    let name = this.advance();
                    expr = new Get(expr, name);
                }
            } else break;
        }
        return expr;
    }

    primary(): Expr {
        if (this.match(["TRUE"])) return new Literal("TRUE", true);        
        if (this.match(["FALSE"])) return new Literal("FALSE", false);
        if (this.match(["NUMBER", "STRING"])) return new Literal("NUMBER", this.tokens[this.pos - 1].value);
        if (this.match(["NULL"])) return new Literal("NULL", null);

        if (this.match(["SUPER"])) {
            let keyword = this.tokens[this.pos - 1];

            if (!this.check("DOT")) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a '.' after super`, 5);
            this.advance();

            let text = `Expected a superclass method name on line ${this.tokens[this.pos].line}`;
            if (!this.check("IDENTIFIER")) throw this.errorhandler.newError("Class Error", text, this.tokens[this.pos].line, this.tokens[this.pos].rowpos);
            let method = this.advance();

            return new Super(keyword, method);
        }

        if (this.match(["SELF"])) return new Self(this.tokens[this.pos - 1]);
        if (this.match(["IDENTIFIER"])) return new Variable(this.tokens[this.pos - 1]);

        let lparenpos = this.pos;
        if (this.match(["LPAREN"])) {
            let expr = this.expression();
            if (this.check("RPAREN")) {
                this.advance();
                return new Grouping(expr);
            } else this.genSyntaxErr(this.tokens[lparenpos], `Expected a ')' after expression`, 0);
        }

        let prev = this.tokens[this.pos - 1];
        if (!prev) prev = this.tokens[this.pos];
        let text = `Expected an expression`;
        throw this.genSyntaxErr(prev, text, 0);
    }

    // Statements
    expressionStatement(): Expression {
        let expr = this.expression();
        return new Expression(expr);
    }

    forStatement(): Stmt {
        if (!this.check("LPAREN")) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a '(' after 'for' statement`, 3);
        this.advance();

        let initializer: Stmt | null = null;
        if (this.match(["SEMICOLON"])) initializer = null;
        else if (this.match(["VAR"])) {
            initializer = this.varDeclaration(false);
            this.advance();
        } else if (this.match(["CONST"])) {
            initializer = this.varDeclaration(true);
            this.advance();
        } else {
            initializer = this.expressionStatement();
            this.advance();
        }

        let condition: Expr | null = null;
        if (!this.check("SEMICOLON")) condition = this.expression();
        if (!this.check("SEMICOLON")) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a ';' after 'for' condition`, 3);
        else this.advance();

        let increment: Expr | null = null;
        if (!this.check("RPAREN")) increment = this.expression();
        if (!this.check("RPAREN")) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a ')' after 'for' clauses`, 3);
        else this.advance();

        let body: Stmt = this.statement();
        if (increment !== null) body = new Block([body, new Expression(increment)]);

        if (condition === null) condition = new Literal("TRUE", true);
        body = new While(condition, body);
        if (initializer !== null) body = new Block([initializer, body]);

        return body;
    }

    ifStatement(): If {
        if (!this.check("LPAREN")) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a '(' after 'if' statement`, 2);
        let condition = this.expression();

        let thenBranch: Stmt = this.statement();
        let elseBranch: Stmt | null = null;
        if (this.match(["ELSE"])) elseBranch = this.statement();

        return new If(condition, thenBranch, elseBranch);
    }

    printStatement(): Print {
        if (!this.check("LPAREN")) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a '(' after 'print' func`, 5);
        let value = this.expression();
        return new Print(value);
    }

    returnStatement(): Return {
        let keyword = this.tokens[this.pos - 1];
        let value: Expr | null = null;
        if (this.tokens[this.pos].line === keyword.line) value = this.expression();

        return new Return(keyword, value);
    }

    whileStatement(): While {
        if (!this.check("LPAREN")) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a '(' after 'while' statement`, 5);

        let condition = this.expression();
        let body: Stmt = this.statement();

        return new While(condition, body);
    }

    // Other
    block(lbrace: Token): Stmt[] {
        let statements: Stmt[] = [];
        while (!this.check("RBRACE") && !this.isAtEnd()) statements.push(this.declaration());

        if (!this.check("RBRACE")) throw this.genSyntaxErr(lbrace, `Expected a closing '}' after scope`, 0);
        else {
            this.advance();
            return statements;
        }
    }

    finishCall(callee: Expr) {
        let args = [];
        if (!this.check("RPAREN")) {
            do {
                if (args.length >= 255) {
                    let current = this.tokens[this.pos];
                    this.genFunctionErr(`Function call cannot have more than 255 arguments`, current.line, current.rowpos, true);
                }
                args.push(this.expression());
            } while (this.match(["COMMA"]));
        }

        let paren: Token;
        if (!this.check("RPAREN")) throw this.genSyntaxErr(this.tokens[this.pos], `Expect ')' after function arguments`, 0);
        else paren = this.advance();

        return new Call(callee, paren, args);
    }
}