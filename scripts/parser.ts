import { Binary, Grouping, Literal, Unary } from "./ast"
import { Errors } from "./errors"
import { SyntaxError } from "./errors"
import { Token } from "./token";
import { TokenType } from "./constants";

export type LSNode = Binary | Grouping | Literal | Unary;

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

    parse() {
        try {
            return this.expression();
        } catch(e) {
            return null;
        }
    }

    expression(): LSNode {
        return this.equality();
    }

    equality(): LSNode {
        let expr = this.expression();

        while (this.match(["BANGEQUAL", "EQUALEQUAL"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.comparison();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    comparison(): LSNode | Errors {
        let expr = this.term();

        while (this.match(["GREATER", "GREATEREQUAL", "LESS", "LESSEQUAL"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.term();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    term(): LSNode | Errors {
        let expr = this.factor();

        while (this.match(["MINUS", "PLUS"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.factor();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    factor(): LSNode | Errors {
        let expr = this.unary();

        while (this.match(["DIV", "MUL"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.unary();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    unary(): LSNode | Errors {
        if (this.match(["BANG", "MINUS"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.unary();
            return new Unary(operator, right);
        }
        return this.primary();
    }

    primary(): LSNode | Errors {
        if (this.match(["FALSE"])) return new Literal(false);
        if (this.match(["TRUE"])) return new Literal(true);
        if (this.match(["NULL"])) return new Literal(null);
    
        if (this.match(["INT", "FLOAT", "STRING"])) return new Literal(this.tokens[this.pos - 1].value);

        let lparenpos = this.pos;
        if (this.match(["LPAREN"])) {
            let expr = this.expression();
            if (this.check("RPAREN")) this.advance();
            else {
                let p = this.tokens[lparenpos];
                return new SyntaxError(this.fname, `Expected a ')' after expression on line ${p.line}`, p.line, p.rowpos, this.text.split("\n")[p.line - 1]);
            }
            return new Grouping(expr);
        }

        let prev = this.tokens[this.pos - 1];
        return new SyntaxError(this.fname, `Expected an expression on line ${prev.line}`, prev.line, prev.rowpos, this.text.split("\n")[prev.line - 1]);
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
}