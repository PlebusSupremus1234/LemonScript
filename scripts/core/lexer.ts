import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"
import { Keywords, TokenType, LSTypesArray } from "../constants"

export class Lexer {
    fname: string;
    ftext: string;
    currentChar: string;
    tokens: Token[] = [];
    pos = 0;
    line = 1;
    rowpos = 1;
    errorhandler: ErrorHandler;

    constructor(fname: string, ftext: string, errorhandler: ErrorHandler) {
        this.ftext = ftext;
        this.fname = fname;
        this.currentChar = this.ftext[0];
        this.errorhandler = errorhandler;
    }

    lex(): void | Token[] {
        if (this.currentChar === "\n") this.advance();

        while (!this.isAtEnd()) {
            try { this.genToken(); }
            catch(e) { return console.log(this.errorhandler.stringify()); }
        }
        this.addToken("EOF", null);
        return this.tokens;
    }

    // Functions
    peek(): string { return this.ftext[this.pos + 1]; }
    isAtEnd(): boolean { return this.pos >= this.ftext.length; }
    genError(text: string, rowpos: number = this.rowpos, line: number=this.line): void { throw this.errorhandler.newError("Syntax Error", text, line, rowpos); }

    isAlpha(text: string): boolean {
        if (!text) return false;
        return text.match(/^[A-Za-z]+$/) !== null;
    }
    
    addToken(type: TokenType, value: TokenValue=this.currentChar, rowpos: number=this.rowpos, line: number=this.line) {
        this.tokens.push(new Token(type, value, rowpos, line));
        this.advance();
    }

    next(expected: string): boolean {
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
            case ":": this.addToken("COLON"); break;
            case ";": this.addToken("SEMICOLON"); break;
            case ".": this.addToken("DOT"); break;
            case ",": this.addToken("COMMA"); break;
            case "|": this.addToken("PIPE"); break;
            case "?": this.addToken("EROTEME"); break;
            case "!":
                if (this.next("=")) this.addToken("BANGEQUAL", "!=", this.rowpos - 1);
                else this.addToken("BANG", "!", this.rowpos);
                break;
            case "=":
                if (this.next("=")) this.addToken("EQUALEQUAL", "==", this.rowpos - 1);
                else this.addToken("EQUAL", "=", this.rowpos);
                break;
            case "<":
                if (this.next("=")) this.addToken("LESSEQUAL", "<=", this.rowpos - 1);
                else this.addToken("LESS", "<", this.rowpos);
                break;
            case ">":
                if (this.next("=")) this.addToken("GREATEREQUAL", ">=", this.rowpos - 1);
                else this.addToken("GREATER", ">", this.rowpos);
                break;
            case "#": // Comment Line
                while (this.peek() !== "\n" && !this.isAtEnd()) this.advance();
                this.advance();
                break;
            case " ":
            case "\t":
            case "\r":
                this.advance();
                break;
            case '"': // String
            case "'":
                let ending = this.currentChar;
                let start = this.pos + 1;
                let rowstart = this.rowpos;
                let linestart = this.line;
                while (this.peek() !== ending && !this.isAtEnd()) this.advance();
                if (this.pos >= this.ftext.length || this.line !== linestart) this.genError(`String on line ${linestart} has no ending`, rowstart, linestart);
                this.advance();
                this.addToken("STRING", this.ftext.substring(start, this.pos), rowstart, linestart);
                break;
            default: // Other
                if (this.isAlpha(this.currentChar) || this.currentChar === "_") { // Identifier / Keyword
                    let start = this.pos;
                    let rowstart = this.rowpos;
                    while (this.isAlpha(this.peek()) || "0123456789".includes(this.peek())) this.advance();
                    let text = this.ftext.substring(start, this.pos + 1);

                    if (LSTypesArray.includes(text)) this.addToken("TYPE", text, rowstart);
                    else if (["true", "false"].includes(text)) this.addToken("BOOLEAN", text, rowstart);
                    else if (text === "null") this.addToken("NULL", text, rowstart);
                    else if (Keywords.map(i => i.toLowerCase()).includes(text)) this.addToken(text.toUpperCase() as TokenType, text, rowstart);
                    else this.addToken("IDENTIFIER", text, rowstart);
                } else if ("0123456789".includes(this.currentChar)) { // Number
                    let start = this.pos;
                    let rowstart = this.rowpos;

                    while ("0123456789".includes(this.peek())) this.advance();                
                    if (this.peek() === ".") {
                        if ("0123456789".includes(this.ftext[this.pos + 2])) {
                            this.advance();
                            while ("0123456789".includes(this.peek())) this.advance();
                        } else {
                            this.advance();
                            if (this.peek()) this.advance();
                            this.genError(`Illegal Character '${this.currentChar}' detected on line ${this.line}`, this.rowpos);
                        }
                    }
                    this.addToken("NUMBER", parseFloat(this.ftext.substring(start, this.pos + 1)), rowstart);
                } else this.genError(`Illegal Character '${this.currentChar}' detected on line ${this.line}`, this.rowpos);
        }
    }
}