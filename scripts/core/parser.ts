import { Expr, Assign, Binary, Call, Grouping, Literal, Logical, Unary, Variable } from "../structures/expr"
import { Stmt, Block, Expression, Func, If, Print, Return, Var, While } from "../structures/stmt"

import { Token } from "../structures/token";
import { TokenType } from "../constants";
import { SyntaxError, InvalidFunction } from "../structures/errors"

export class Parser {
    text: string;
    fname: string;
    tokens: Token[];
    pos = 0;

    constructor(fname: string, text: string, tokens: Token[]) {
        this.fname = fname;
        this.text = text;
        this.tokens = tokens;
    }

    parse(): void | Stmt[] {
        let statements: Stmt[] = [];
        while (!this.isAtEnd()) {
            let statement: Stmt;
            try { statement = this.declaration(); }
            catch(e) { return console.log(e.stringify()); }
            statements.push(statement);
        }
        return statements;
    }

    // Declarations
    declaration() {
        if (this.match(["FUNC"])) return this.function("function");
        if (this.match(["VAR"])) return this.varDeclaration();
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

    varDeclaration(): Var {
        let name = this.advance();

        let initializer: Expr | null = null;
        if (this.match(["EQUAL"])) initializer = this.expression();

        return new Var(name, initializer);
    }

    function(kind: string) {
        let name: Token;
        let curr = this.tokens[this.pos];
        if (!this.check("IDENTIFIER")) throw this.genFunctionErr(`Expected a ${kind} name`, "Declaration", curr.line, curr.rowpos);
        else name = this.advance();

        if (!this.check("LPAREN")) this.genSyntaxErr(this.tokens[this.pos], `Expected a '(' after ${kind} name`, 0);
        else this.advance();

        let parameters = [];
        if (!this.check("RPAREN")) {
            do {
                curr = this.tokens[this.pos];
                if (parameters.length >= 255) this.genFunctionErr(`Function cannot have more than 255 parameters`, "Declaration", curr.line, curr.rowpos);
                let append: Token;
                if (!this.check("IDENTIFIER")) throw this.genFunctionErr(`Expected a parameter name`, "Declaration", curr.line, curr.rowpos);
                else append = this.advance();
                parameters.push(append);
            } while (this.match(["COMMA"]));
        }

        if (!this.check("RPAREN")) this.genSyntaxErr(this.tokens[this.pos], `Expected a ')' after parameters`, 0);
        else this.advance();
        if (!this.check("LBRACE")) this.genSyntaxErr(this.tokens[this.pos], `Expected a '{' before ${kind} body`, 0);
        else this.advance();

        let body = this.block(this.tokens[this.pos - 1]);
        return new Func(name, parameters, body);
    }

    // Functions
    advance(): Token {
        if (!this.isAtEnd()) this.pos++;
        return this.tokens[this.pos - 1];
    }

    check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.tokens[this.pos].type === type;
    }
    
    isAtEnd(): boolean {
        return this.tokens[this.pos].type === "EOF";
    }

    genSyntaxErr(token: Token, text: string, offset: number) {
        throw new SyntaxError(this.fname, `${text} on line ${token.line}`, token.line, token.rowpos + offset, this.text.split("\n")[token.line - 1]);
    }

    genFunctionErr(text: string, type: string, line: number, pos: number) {
        throw new InvalidFunction(this.fname, `${text} on line ${line}`, line, pos, this.text.split("\n")[line - 1], type) ;
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

        while (this.match(["GREATER", "GREATEREQUAL", "LESS", "LESSEQUAL", "MOD", "CARET"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.term();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    term(): Expr {
        let expr = this.factor();

        while (this.match(["MINUS", "PLUS"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.factor();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    factor(): Expr {
        let expr = this.unary();

        while (this.match(["DIV", "MUL"])) {
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
            else break;
        }
        return expr;
    }

    primary(): Expr {
        if (this.match(["FALSE"])) return new Literal("FALSE", false);
        if (this.match(["TRUE"])) return new Literal("TRUE", true);
        
        if (this.match(["INT", "FLOAT", "STRING", "NULL"])) return new Literal(this.tokens[this.pos - 1].type, this.tokens[this.pos - 1].value);

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
        let l = prev ? prev.line : 1;
        let txt = `Expected an expression on line ${l}`;
        throw new SyntaxError(this.fname, txt, l, prev ? prev.rowpos : 1, this.text.split("\n")[l - 1]);
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
            initializer = this.varDeclaration();
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
                    this.genFunctionErr(`Function call cannot have more than 255 arguments`, "Call", current.line, current.rowpos);
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