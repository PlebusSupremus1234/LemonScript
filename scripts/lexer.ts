import { Errors, IllegalCharacter, UnterminatedString } from "./errors"
import { Keywords, TokenType } from "./constants"
import { Token } from "./token"

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

    addToken(type: TokenType, value: number | string=this.currentChar) {
        this.tokens.push(new Token(type, value, this.rowpos, this.line));
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
            else if ("0123456789".includes(this.currentChar)) this.manageNumber();
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
            else if (this.currentChar === "#") {
                while (this.text[this.pos] !== "\n" && this.pos < this.text.length) this.advance();
            } else if (this.isAlpha(this.currentChar) || this.currentChar === "_") {
                let start = this.pos;
                while (this.isAlpha(this.peek()) || "0123456789".includes(this.peek())) this.advance();
                let text = this.text.substring(start, this.pos + 1);
                if (Keywords.map(i => i.toLowerCase()).includes(text)) this.addToken(text.toUpperCase(), text);
                else this.addToken("IDENTIFIER", text);
            } else if (this.currentChar === '"') {
                let start = this.pos + 1;
                let rowstart = this.rowpos;
                while (this.peek() !== '"' && this.pos < this.text.length) this.advance();
                if (this.pos >= this.text.length) return [[], new UnterminatedString(this.filename, this.line, rowstart + 1, this.text.split("\n")[this.line - 1])];
                this.advance();
                this.addToken("STRING", this.text.substring(start, this.pos));    
            }
            else return [[], new IllegalCharacter(this.filename, this.line, this.rowpos + 1, this.text.split("\n")[this.line - 1], this.currentChar)];
        }

        return [this.tokens, null];
    }

    manageNumber() {
        let nums = "";
        let count = 0;

        while (this.currentChar !== null && "0123456789.".includes(this.currentChar)) {
            if (this.currentChar == ".") {
                if (count === 1) break;
                count++;
                nums += ".";
            } else nums += this.currentChar;
            this.advance();
        }

        if (count === 0) this.addToken("INT", parseInt(nums));
        else this.addToken("FLOAT", parseFloat(nums));
    }
}