import { Errors, IllegalCharacter, UnterminatedString } from "./structures/errors"
import { Keywords, TokenType } from "./constants"
import { Token, TokenValue } from "./structures/token"

export class Lexer {
    text: string;
    pos = 0;
    line = 1;
    rowpos = 0;
    filename: string;
    currentChar: string;
    tokens: Token[] = [];

    constructor(text: string, filename: string) {
        this.text = text;
        this.currentChar = this.text[this.pos];
        this.filename = filename;
    }

    advance() {
        this.pos++;
        this.rowpos++;
        this.currentChar = this.text[this.pos];
        if (this.currentChar === "\n") {
            this.line++;
            this.rowpos = -1;
            this.advance();
        }
    }

    addToken(type: TokenType, value: TokenValue=this.currentChar, rowpos: number=this.rowpos) {
        this.tokens.push(new Token(type, value, rowpos, this.line));
        this.advance();
    }

    peek(): string {
        return this.text[this.pos + 1];
    }

    next(expected: string): boolean {
        this.advance();
        return this.currentChar === expected;
    }

    isAlpha(text: string): boolean {
        if (!text) return false;
        return text.match(/^[A-Za-z]+$/) !== null;
    }

    genTokens(): [Token[], null | Errors] {
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
                while (this.text[this.pos] !== "\n" && this.pos < this.text.length) this.advance();
            } else if (this.isAlpha(this.currentChar) || this.currentChar === "_") { // Identifier / Keyword
                let start = this.pos;
                while (this.isAlpha(this.peek()) || "0123456789".includes(this.peek())) this.advance();
                let text = this.text.substring(start, this.pos + 1);
                if (Keywords.map(i => i.toLowerCase()).includes(text)) this.addToken(text.toUpperCase(), text);
                else this.addToken("IDENTIFIER", text);
            } else if (this.currentChar === '"') { // String
                let start = this.pos + 1;
                let rowstart = this.rowpos;
                while (this.peek() !== '"' && this.pos < this.text.length) this.advance();
                if (this.pos >= this.text.length) return [[], new UnterminatedString(this.filename, this.line, rowstart + 1, this.text.split("\n")[this.line - 1])];
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
                    } else return [[], new IllegalCharacter(this.filename, this.line, this.rowpos + 3, this.text.split("\n")[this.line - 1], this.currentChar)];
                }

                this.addToken(f ? "FLOAT" : "INT", parseFloat(this.text.substring(start, this.pos + 1)));
            } else return [[], new IllegalCharacter(this.filename, this.line, this.rowpos + 1, this.text.split("\n")[this.line - 1], this.currentChar)];
        }

        this.addToken("EOF", null);
        return [this.tokens, null];
    }
}