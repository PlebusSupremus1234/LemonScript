import { Constants, TokenType } from "./constants"
import { Token } from "./token"

const { LSint, LSfloat, LSplus, LSminus, LSmul, LSdiv, LSlparen, LSrparen } = Constants;

export class Lexer {
    text: string;
    pos = 0;
    currentChar: string;
    tokens: Token[] = [];

    constructor(text: string) {
        this.text = text;
        this.currentChar = this.text[this.pos];
    }

    advance() {
        this.pos++;
        this.currentChar = this.text[this.pos];
    }

    addToken(type: TokenType) {
        this.tokens.push(new Token(type, this.currentChar));
        this.advance();
    }

    genTokens() {
        while (this.currentChar) {
            if (" \t".includes(this.currentChar)) this.advance();
            else if ("0123456789".includes(this.currentChar)) this.manageNumber();
            else if (this.currentChar === "+") this.addToken(LSplus);
            else if (this.currentChar === "-") this.addToken(LSminus);
            else if (this.currentChar === "*") this.addToken(LSmul);
            else if (this.currentChar === "/") this.addToken(LSdiv);
            else if (this.currentChar === "(") this.addToken(LSlparen);
            else if (this.currentChar === ")") this.addToken(LSrparen);
            else {
                console.log("Illegal Char: " + this.currentChar);
                this.advance();
            }
        }

        return this.tokens;
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

        if (count === 0) this.tokens.push(new Token(LSint, parseInt(nums)));
        else this.tokens.push(new Token(LSfloat, parseFloat(nums)));
    }
}