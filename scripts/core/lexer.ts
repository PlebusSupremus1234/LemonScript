import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"
import { Keywords, TokenType as T, LSTypesArray, singleChars } from "../data/constants"

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
            catch(e) { return console.log(this.errorhandler.stringify(e)); }
        }

        this.addToken(T.EOF, null);
        return this.tokens;
    }

    // Functions
    peek(): string { return this.ftext[this.pos + 1]; }
    isAtEnd(): boolean { return this.pos >= this.ftext.length; }
    genError(text: string, rowpos: number = this.rowpos, line: number = this.line): void { throw this.errorhandler.newError("Syntax Error", text, line, rowpos); }

    isAlpha(text: string): boolean {
        if (!text) return false;
        return text.match(/^[A-Za-z]+$/) !== null;
    }
    
    addToken(type: T, value: TokenValue=this.currentChar, rowpos: number=this.rowpos, line: number=this.line) {
        this.tokens.push(new Token(type, value, line, rowpos));
        this.advance();
    }

    twoChars(c1name: T, c1: string, c2name: T, c2: string, diff: string = "=") {
        if (this.next(diff)) this.addToken(c2name, c2, this.rowpos - 1);
        else this.addToken(c1name, c1, this.rowpos);
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
        let code = singleChars[this.currentChar];
        if (code) this.addToken(code);
        else {
            switch (this.currentChar) {
                case "+": this.twoChars(T.PLUS, "+", T.PLUSEQUAL, "+="); break;
                case "-": this.twoChars(T.MINUS, "-", T.MINUSEQUAL, "-="); break;
                case "*": this.twoChars(T.MUL, "*", T.MULEQUAL, "*="); break;
                case "/": this.twoChars(T.DIV, "/", T.DIVEQUAL, "/="); break;
                case "%": this.twoChars(T.MOD, "%", T.MODEQUAL, "%="); break;
                case "^": this.twoChars(T.CARET, "^", T.CARETEQUAL, "^="); break;
                case "!": this.twoChars(T.BANG, "!", T.BANGEQUAL, "!="); break;
                case "=": this.twoChars(T.EQUAL, "=", T.EQUALEQUAL, "=="); break;
                case "<": this.twoChars(T.LESS, "<", T.LESSEQUAL, "<="); break;
                case ">": this.twoChars(T.GREATER, ">", T.GREATEREQUAL, ">="); break;
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
                    this.addToken(T.STRING, this.ftext.substring(start, this.pos), rowstart, linestart);
                    break;
                default: // Other
                    if (this.isAlpha(this.currentChar) || this.currentChar === "_") { // Identifier / Keyword
                        let start = this.pos;
                        let rowstart = this.rowpos;
                        while (this.isAlpha(this.peek()) || "0123456789".includes(this.peek())) this.advance();
                        let text = this.ftext.substring(start, this.pos + 1);

                        if (LSTypesArray.includes(text as any)) this.addToken(T.TYPE, text, rowstart);
                        else if (["true", "false"].includes(text)) this.addToken(T.BOOLEAN, text, rowstart);
                        else if (text === "null") this.addToken(T.NULL, text, rowstart);
                        else if (Keywords.map(i => i.toLowerCase()).includes(text)) {
                            let key = text.toUpperCase() as keyof typeof T;
                            this.addToken(T[key], text, rowstart);
                        } else this.addToken(T.IDENTIFIER, text, rowstart);
                    } else if ("0123456789".includes(this.currentChar)) { // Number
                        let start = this.pos;
                        let rowstart = this.rowpos;

                        while ("0123456789".includes(this.peek())) this.advance();                
                        if (this.peek() === ".") {
                            this.advance();
                            if ("0123456789".includes(this.ftext[this.pos + 1])) {
                                while ("0123456789".includes(this.peek())) this.advance();
                            } else {
                                if (this.peek()) this.advance();
                                this.genError(`Unexpected token '${this.currentChar}' detected on line ${this.line}`, this.rowpos);
                            }
                        }
                        this.addToken(T.NUMBER, parseFloat(this.ftext.substring(start, this.pos + 1)), rowstart);
                    } else this.genError(`Illegal Character '${this.currentChar}' detected on line ${this.line}`, this.rowpos);
            }
        }
    }
}