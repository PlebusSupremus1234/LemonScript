import { LSError } from "../structures/errors"
import { Keywords, TokenType } from "../constants"
import { Token, TokenValue } from "../structures/token";

export class Lexer {
    fname: string;
    ftext: string;
    currentChar: string;
    tokens: Token[] = [];
    pos = 0;
    line = 1;
    rowpos = 1;

    constructor(fname: string, ftext: string) {
        this.ftext = ftext;
        this.fname = fname;
        this.currentChar = this.ftext[0];
    }

    lex(): void | Token[] {
        if (this.currentChar === "\n") {
            this.pos--;
            this.rowpos--;
            this.advance();
        }
        while (!this.isAtEnd()) {
            try { this.genToken(); }
            catch(e) { return console.log(e.stringify()); }
        }
        this.addToken("EOF", null);
        return this.tokens;
    }

    // Functions
    peek(): string { return this.ftext[this.pos + 1]; }
    isAtEnd(): boolean { return this.pos >= this.ftext.length; }
    genError(text: string, rowpos: number = this.rowpos): void { throw new LSError("Syntax Error", text, this.fname, this.ftext, this.line, rowpos); }

    isAlpha(text: string): boolean {
        if (!text) return false;
        return text.match(/^[A-Za-z]+$/) !== null;
    }
    
    addToken(type: TokenType, value: TokenValue=this.currentChar, rowpos: number=this.rowpos) {
        this.tokens.push(new Token(type, value, rowpos, this.line));
        this.advance();
    }

    next(expected: TokenType): boolean {
        let bool = this.peek() === expected;
        if (bool) this.advance();
        return bool;
    }

    advance() {
        this.pos++;
        this.rowpos++;
        this.currentChar = this.ftext[this.pos];
        if (this.currentChar === "\n") {
            this.line++;
            this.rowpos = 0;
            this.advance();
        }
    }

    // Main
    genToken() {
        switch (this.currentChar) {
            case "+": this.addToken("PLUS"); break;
            case "-": this.addToken("MINUS"); break;
            case "*": this.addToken("MUL"); break;
            case "/": this.addToken("DIV"); break;
            case "%": this.addToken("MOD"); break;
            case "^": this.addToken("CARET"); break;
            case "/": this.addToken("DIV"); break;
            case "(": this.addToken("LPAREN"); break;
            case ")": this.addToken("RPAREN"); break;
            case "{": this.addToken("LBRACE"); break;
            case "}": this.addToken("RBRACE"); break;
            case ";": this.addToken("SEMICOLON"); break;
            case ".": this.addToken("DOT"); break;
            case ",": this.addToken("COMMA"); break;
            case "!":
                if (this.next("=")) this.addToken("BANGEQUAL", "!=", this.rowpos - 1);
                else this.addToken("BANG", "!", this.rowpos - 1);
                break;
            case "=":
                if (this.next("=")) this.addToken("EQUALEQUAL", "==", this.rowpos - 1);
                else this.addToken("EQUAL", "=", this.rowpos - 1);
                break;
            case "<":
                if (this.next("=")) this.addToken("LESSEQUAL", "<=", this.rowpos - 1);
                else this.addToken("LESS", "<", this.rowpos - 1);
                break;
            case ">":
                if (this.next("=")) this.addToken("GREATEREQUAL", ">=", this.rowpos - 1);
                else this.addToken("GREATER", ">", this.rowpos - 1);
                break;
            case "#": // Comment Line
                while (this.peek() !== "\n" && !this.isAtEnd()) this.advance();
                this.advance();
                break;
            case '"': // String
                let start = this.pos + 1;
                let rowstart = this.rowpos;
                while (this.peek() !== '"' && !this.isAtEnd()) this.advance();
                if (this.pos >= this.ftext.length) this.genError(`String on line ${this.line} has no ending`, rowstart);
                this.advance();
                this.addToken("STRING", this.ftext.substring(start, this.pos), rowstart);
                break;
            default: // Other
                if (" \t".includes(this.currentChar)) this.advance();
                else if (this.isAlpha(this.currentChar) || this.currentChar === "_") { // Identifier / Keyword
                    let start = this.pos;
                    let rowstart = this.rowpos;
                    while (this.isAlpha(this.peek()) || "0123456789".includes(this.peek())) this.advance();
                    let text = this.ftext.substring(start, this.pos + 1);
                    if (Keywords.map(i => i.toLowerCase()).includes(text)) this.addToken(text.toUpperCase(), text, rowstart);
                    else this.addToken("IDENTIFIER", text, rowstart);
                } else if ("0123456789".includes(this.currentChar)) { // Number
                    let start = this.pos;
                    let f = false;
                    while ("0123456789".includes(this.peek())) this.advance();                
                    if (this.peek() === ".") {
                        if ("0123456789".includes(this.ftext[this.pos + 2])) {
                            this.advance();
                            f = true;
                            while ("0123456789".includes(this.peek())) this.advance();
                        } else {
                            this.advance();
                            if (this.peek()) this.advance();
                            this.genError(`Illegal Character '${this.currentChar}' detected on line ${this.line}`, this.rowpos);
                        }
                    }
                    this.addToken(f ? "FLOAT" : "INT", parseFloat(this.ftext.substring(start, this.pos + 1)));
                } else this.genError(`Illegal Character '${this.currentChar}' detected on line ${this.line}`, this.rowpos);
        }
    }
}