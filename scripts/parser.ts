import { Binary, Grouping, Literal, Unary, LSNode } from "./ast"
import { Errors } from "./errors"
import { SyntaxError } from "./errors"
import { Token } from "./token";
import { TokenType } from "./constants";

export class Parser {
    tokens: Token[];
    text: string;
    fname: string;
    pos = 0;
    error: false | Errors;

    constructor(tokens: Token[], fname: string, text: string) {
        this.tokens = tokens;
        this.fname = fname;
        this.text = text;
        this.error = false;
    }

    parse(): [null | LSNode, null | Errors] {
        let res;
        try { res = this.expression(); }
        catch(e) { res = null; }
        return [res, this.error ? this.error : null];
    }

    expression(): LSNode {
        return this.equality();
    }

    equality(): LSNode {
        let expr = this.comparison();

        while (this.match(["BANGEQUAL", "EQUALEQUAL"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.comparison();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    comparison(): LSNode {
        let expr = this.term();

        while (this.match(["GREATER", "GREATEREQUAL", "LESS", "LESSEQUAL"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.term();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    term(): LSNode {
        let expr = this.factor();

        while (this.match(["MINUS", "PLUS"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.factor();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    factor(): LSNode {
        let expr = this.unary();

        while (this.match(["DIV", "MUL"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.unary();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    unary(): LSNode {
        if (this.match(["BANG", "MINUS"])) {
            let operator = this.tokens[this.pos - 1];
            let right = this.unary();
            return new Unary(operator, right);
        }
        return this.primary();
    }

    primary(): LSNode {
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
                this.error = new SyntaxError(this.fname, `Expected a ')' after expression on line ${p.line}`, p.line, p.rowpos, this.text.split("\n")[p.line - 1]);
            }
            return new Grouping(expr);
        }

        let prev = this.tokens[this.pos - 1];
        let l = prev ? prev.line : 1;
        let txt = `Expected an expression on line ${l}`;
        this.error = new SyntaxError(this.fname, txt, l, prev ? prev.rowpos : 1, this.text.split("\n")[l - 1]);
        return new Literal("Error");
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