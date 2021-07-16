import { Keywords, TokenType } from "../constants"
import { SyntaxError } from "../structures/errors"
import { Token, TokenValue } from "../structures/token";

export class Lexer {
    fname: string;
    text: string;
    currentChar: string;
    tokens: Token[] = [];
    pos = 0;
    line = 1;
    rowpos = 1;

    constructor(fname: string, text: string) {
        this.text = text;
        this.fname = fname;
        this.currentChar = this.text[0];
    }

    lex(): void | Token[] {
        if (this.currentChar === "\n") {
            this.pos--;
            this.rowpos--;
            this.advance();
        }
        while (!this.isAtEnd()) {
            try {
                this.genToken();
            } catch(e) {
                return console.log(e.stringify());
            }
        }
        this.addToken("EOF", null);
        return this.tokens;
    }

    // Functions
    isAtEnd(): boolean {
        return this.pos >= this.text.length;
    }

    peek(): string {
        return this.text[this.pos + 1];
    }

    genError(text: string, pos: number): [string, string, number, number, string] {
        return [this.fname, text, this.line, pos, this.text.split("\n")[this.line - 1]];
    }

    isAlpha(text: string): boolean {
        if (!text) return false;
        return text.match(/^[A-Za-z]+$/) !== null;
    }
    
    next(expected: TokenType): boolean {
        let bool = this.peek() === expected;
        if (bool) this.advance();
        return bool;
    }

    addToken(type: TokenType, value: TokenValue=this.currentChar, rowpos: number=this.rowpos) {
        this.tokens.push(new Token(type, value, rowpos, this.line));
        this.advance();
    }

    advance() {
        this.pos++;
        this.rowpos++;
        this.currentChar = this.text[this.pos];
        if (this.currentChar === "\n") {
            this.rowpos = 0;
            this.line++;
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
            case "(": this.addToken("LPAREN"); break;
            case ")": this.addToken("RPAREN"); break;
            case "{": this.addToken("LBRACE"); break;
            case "}": this.addToken("RBRACE"); break;
            case ";": this.addToken("SEMICOLON"); break;
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
                if (this.pos >= this.text.length) throw new SyntaxError(...this.genError(`String on line ${this.line} has no ending`, rowstart));
                this.advance();
                this.addToken("STRING", this.text.substring(start, this.pos), rowstart);
                break;
            default: // Other
                if (" \t".includes(this.currentChar)) this.advance();
                else if (this.isAlpha(this.currentChar) || this.currentChar === "_") { // Identifier / Keyword
                    let start = this.pos;
                    let rowstart = this.rowpos;
                    while (this.isAlpha(this.peek()) || "0123456789".includes(this.peek())) this.advance();
                    let text = this.text.substring(start, this.pos + 1);
                    if (Keywords.map(i => i.toLowerCase()).includes(text)) this.addToken(text.toUpperCase(), text, rowstart);
                    else this.addToken("IDENTIFIER", text, rowstart);
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