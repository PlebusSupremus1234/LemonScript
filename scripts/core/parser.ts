import { Expr, Binary, Unary, Literal, Grouping, Variable } from "../structures/expr"
import { Stmt, Print, Expression, Var } from "../structures/stmt"

import { Token } from "../structures/token";
import { TokenType } from "../constants";
import { Errors, SyntaxError } from "../structures/errors"

export class Parser {
    tokens: Token[];
    text: string;
    fname: string;
    pos = 0;
    error: null | Errors = null;

    constructor(tokens: Token[], fname: string, text: string) {
        this.tokens = tokens;
        this.fname = fname;
        this.text = text;
    }

    parse(): void | Stmt[] {
        let statements: Stmt[] = [];
        while (!this.isAtEnd()) {
            let statement = this.declaration();
            if (this.error) return console.log(this.error.stringify());
            statements.push(statement);
        }
        return statements;
    }

    declaration() {
        try {
            if (this.match(["VAR"])) return this.varDeclaration();

            return this.statement();
        } catch (err) {
            // this.synchronize(); 
            return new Expression(new Literal("NULL", null));
        }
    }

    statement() {
        if (this.match(["PRINT"])) return this.printStatement();

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

    // Expression Evaluation
    expression(): Expr {
        return this.equality();
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
        
        if (this.match(["INT", "FLOAT", "STRING"])) return new Literal(this.tokens[this.pos - 1].type, this.tokens[this.pos - 1].value);

        if (this.match(["IDENTIFIER"])) return new Variable(this.tokens[this.pos - 1]);

        let lparenpos = this.pos;
        if (this.match(["LPAREN"])) {
            let expr = this.expression();
            if (this.check("RPAREN")) this.advance();
            else {
                let p = this.tokens[lparenpos];
                console.log("ello")
                this.error = new SyntaxError(this.fname, `Expected a ')' after expression on line ${p.line}`, p.line, p.rowpos, this.text.split("\n")[p.line - 1]);
            }
            return new Grouping(expr);
        }

        let prev = this.tokens[this.pos - 1];
        let l = prev ? prev.line : 1;
        let txt = `Expected an expression on line ${l}`;
        this.error = new SyntaxError(this.fname, txt, l, prev ? prev.rowpos : 1, this.text.split("\n")[l - 1]);
        return new Literal("ERROR", "Error");
    }

    // Statement Evaluation
    printStatement() {
        let value = this.expression();
        return new Print(value);
    }

    expressionStatement() {
        let expr = this.expression();
        return new Expression(expr);
    }

    varDeclaration() {
        let name = this.advance();

        let initializer: Expr | null = null;
        if (this.match(["EQUAL"])) initializer = this.expression();

        return new Var(name, initializer);
    }
}