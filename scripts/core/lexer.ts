import { Errors, SyntaxError } from "../structures/errors"
import { Keywords, TokenType } from "../constants";
import { Token, TokenValue } from "../structures/token"

export class Lexer {
    fname: string;
    text: string;
    currentChar: string;
    tokens: Token[] = [];
    error: null | Errors = null;
    pos = 0;
    line = 1;
    rowpos = 1;

    constructor(fname: string, text: string) {
        this.text = text;
        this.fname = fname;
        this.currentChar = this.text[this.pos];
    }

    lex(): void | Token[] {
        try {
            this.genTokens();
        } catch(e) {
            return console.log(e.stringify());
        }

        this.addToken("EOF", null);
        return this.tokens;
    }

    // Functions

    addToken(type: TokenType, value: TokenValue=this.currentChar, rowpos: number=this.rowpos) {
        this.tokens.push(new Token(type, value, rowpos, this.line));
        this.advance();
    }

    isAlpha(text: string): boolean {
        if (!text) return false;
        return text.match(/^[A-Za-z]+$/) !== null;
    }

    peek(): string {
        return this.text[this.pos + 1];
    }

    next(expected: TokenType): boolean {
        this.advance();
        return this.currentChar === expected;
    }

    genError(text: string, pos: number): [string, string, number, number, string] {
        return [this.fname, text, this.line, pos, this.text.split("\n")[this.line - 1]];
    }

    advance() {
        this.pos++;
        this.rowpos++;
        this.currentChar = this.text[this.pos];
        if (this.currentChar === "\n") {
            this.line++;
            this.rowpos = 0;
            this.advance();
        }
    }

    // Generate Tokens
    genTokens() {
        while (this.currentChar) {
            if (" \t".includes(this.currentChar)) this.advance();
            else if (this.currentChar === "+") this.addToken("PLUS");
            else if (this.currentChar === "-") this.addToken("MINUS");
            else if (this.currentChar === "*") this.addToken("MUL");
            else if (this.currentChar === "/") this.addToken("DIV");
            else if (this.currentChar === "(") this.addToken("LPAREN");
            else if (this.currentChar === ")") this.addToken("RPAREN");
            else if (this.currentChar === "{") this.addToken("LBRACE");
            else if (this.currentChar === "}") this.addToken("RBRACE");
            else if (this.currentChar === "!") this.addToken(this.next("=") ? "BANGEQUAL" : "BANG");
            else if (this.currentChar === "=") this.addToken(this.next("=") ? "EQUAlEQUAL" : "EQUAL");
            else if (this.currentChar === "<") this.addToken(this.next("=") ? "LESSEQUAL" : "LESS");
            else if (this.currentChar === ">") this.addToken(this.next("=") ? "GREATEREQUAL" : "GREATER");
            else if (this.currentChar === "#") { // Comment Line
                while (this.text !== "\n" && this.pos < this.text.length) this.advance();
            } else if (this.isAlpha(this.currentChar) || this.currentChar === "_") { // Identifier / Keyword
                let start = this.pos;
                let rowstart = this.rowpos;
                while (this.isAlpha(this.peek()) || "0123456789".includes(this.peek())) this.advance();
                let text = this.text.substring(start, this.pos + 1);
                if (Keywords.map(i => i.toLowerCase()).includes(text)) this.addToken(text.toUpperCase(), text, rowstart);
                else this.addToken("IDENTIFIER", text, rowstart);
            } else if (this.currentChar === '"') { // String
                let start = this.pos + 1;
                let rowstart = this.rowpos;
                while (this.peek() !== '"' && this.pos < this.text.length) this.advance();
                if (this.pos >= this.text.length) throw new SyntaxError(...this.genError(`String on line ${this.line} has no ending`, rowstart));
                this.advance();
                this.addToken("STRING", this.text.substring(start, this.pos), start);    
            } else if ("0123456789".includes(this.currentChar)) { // Number
                let start = this.pos;   
                let f = false;

                while ("0123456789".includes(this.peek())) this.advance();                
                if (this.peek() === ".") {
                    if ("0123456789".includes(this.text[this.pos + 2])) {
                        this.advance();
                        f = true;
                        while ("0123456789".includes(this.peek())) this.advance();
                    } else {
                        this.advance();
                        if (this.peek()) this.advance();
                        throw new SyntaxError(...this.genError(`Illegal Character '${this.currentChar}' detected on line ${this.line}`, this.rowpos));
                    }
                }
                
                this.addToken(f ? "FLOAT" : "INT", parseFloat(this.text.substring(start, this.pos + 1)));
            } else throw new SyntaxError(...this.genError(`Illegal Character '${this.currentChar}' detected on line ${this.line}`, this.rowpos));
        }
    }
}