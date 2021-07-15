import { Expr, Assign, Binary, Unary, Literal, Logical, Grouping, Variable } from "../structures/expr"
import { Stmt, Block, Expression, If, Print, Var, While } from "../structures/stmt"

import { Token } from "../structures/token";
import { TokenType } from "../constants";
import { SyntaxError } from "../structures/errors"

export class Parser {
    tokens: Token[];
    text: string;
    fname: string;
    pos = 0;

    constructor(tokens: Token[], fname: string, text: string) {
        this.tokens = tokens;
        this.fname = fname;
        this.text = text;
    }

    parse(): void | Stmt[] {
        let statements: Stmt[] = [];
        while (!this.isAtEnd()) {
            let statement: Stmt;
            try {
                statement = this.declaration();
            } catch(e) {
                return console.log(e.stringify());
            }
            statements.push(statement);
        }
        return statements;
    }

    declaration() {
        if (this.match(["VAR"])) return this.varDeclaration();
        return this.statement();
    }

    statement() {
        if (this.match(["IF"])) return this.ifStatement();
        if (this.match(["PRINT"])) return this.printStatement();
        if (this.match(["WHILE"])) return this.whileStatement();
        if (this.match(["FOR"])) return this.forStatement();
        if (this.match(["LBRACE"])) return new Block(this.block(this.tokens[this.pos - 1]));

        return this.expressionStatement();
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

        while (this.match(["GREATER", "GREATEREQUAL", "LESS", "LESSEQUAL", "MOD"])) {
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
        return this.primary();
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

    expressionStatement(): Expression {
        let expr = this.expression();
        return new Expression(expr);
    }

    varDeclaration(): Var {
        let name = this.advance();

        let initializer: Expr | null = null;
        if (this.match(["EQUAL"])) initializer = this.expression();

        return new Var(name, initializer);
    }

    whileStatement(): While {
        if (!this.check("LPAREN")) this.genSyntaxErr(this.tokens[this.pos - 1], `Expected a '(' after 'while' statement`, 5);

        let condition = this.expression();
        let body: Stmt = this.statement();

        return new While(condition, body);
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

    block(lbrace: Token): Stmt[] {
        let statements: Stmt[] = [];
        while (!this.check("RBRACE") && !this.isAtEnd()) statements.push(this.declaration());

        if (!this.check("RBRACE")) throw this.genSyntaxErr(lbrace, `Expected a closing '}' after scope`, 0);
        else {
            this.advance();
            return statements;
        }
    }
}