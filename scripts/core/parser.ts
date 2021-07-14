import { Expr, Assign, Binary, Unary, Literal, Grouping, Variable } from "../structures/expr"
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
        let expr = this.equality();

        if (this.match(["EQUAL"])) {
            let value = this.assignment();
            if (expr instanceof Variable) return new Assign(expr.name, value);

            throw new SyntaxError(this.fname, `Invalid assignment target on line ${t.line}`, t.line, t.rowpos, this.text.split("\n")[t.line - 1]);
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
            } else {
                let p = this.tokens[lparenpos];
                throw new SyntaxError(this.fname, `Expected a ')' after expression on line ${p.line}`, p.line, p.rowpos, this.text.split("\n")[p.line - 1]);
            }
        }

        let prev = this.tokens[this.pos - 1];
        let l = prev ? prev.line : 1;
        let txt = `Expected an expression on line ${l}`;
        throw new SyntaxError(this.fname, txt, l, prev ? prev.rowpos : 1, this.text.split("\n")[l - 1]);
    }

    // Statements
    ifStatement(): If {
        if (!this.check("LPAREN")) {
            let t = this.tokens[this.pos - 1];
            throw new SyntaxError(this.fname, `Expected a '(' after 'if' statement on line ${t.line}`, t.line, t.rowpos + 2, this.text.split("\n")[t.line - 1]);
        }
        let condition = this.expression();

        let thenBranch: Stmt = this.statement();
        let elseBranch: Stmt | null = null;
        if (this.match(["ELSE"])) elseBranch = this.statement();

        return new If(condition, thenBranch, elseBranch);
    }

    printStatement(): Print {
        if (!this.check("LPAREN")) {
            let t = this.tokens[this.pos - 1];
            throw new SyntaxError(this.fname, `Expected a '(' after 'print' func on line ${t.line}`, t.line, t.rowpos + 5, this.text.split("\n")[t.line - 1]);
        }
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
        if (!this.check("LPAREN")) {
            let t = this.tokens[this.pos - 1];
            throw new SyntaxError(this.fname, `Expected a '(' after 'while' statement on line ${t.line}`, t.line, t.rowpos + 5, this.text.split("\n")[t.line - 1]);
        }

        let condition = this.expression();
        let body: Stmt = this.statement();

        return new While(condition, body);
    }

    block(lbrace: Token): Stmt[] {
        let statements: Stmt[] = [];
        while (!this.check("RBRACE") && !this.isAtEnd()) statements.push(this.declaration());

        if (!this.check("RBRACE")) {
            let text = `Expected a '}' after scope on line ${lbrace.line}`;
            throw new SyntaxError(this.fname, text, lbrace.line, lbrace.rowpos, this.text.split("\n")[lbrace.line - 1]);
        } else {
            this.advance();
            return statements;
        }
    }
}