import { red, yellow, cyan, bright } from "./helpers"

class LSError {
    type: string;
    error: string;
    fname: string;
    linetext: string;
    line: number;
    pos: number;

    constructor(type: string, error: string, fname: string, line: number, pos: number, linetext: string) {
        this.type = type;
        this.error = error;
        this.fname = fname;
        this.line = line;
        this.pos = pos;
        this.linetext = linetext;
    }

    stringify(): string {
        let str = `${cyan(this.fname)}:${yellow(this.line.toString())}:${yellow(this.pos.toString())} - ${bright(red("Error"))}: ${this.type}\n${this.error}\n\n`;
        str += `${this.line} | ${this.linetext}\n${Array(this.pos + this.line.toString().length + 3).fill(" ").join("")}^`;
        return str;
    }
}

export type Errors = IllegalCharacter | UnterminatedString;

export class IllegalCharacter extends LSError {
    constructor(fname: string, line: number, pos: number, linetext: string, char: string) {
        super("Illegal Character", `Illegal Character '${char}' detected on line ${line}`, fname, line, pos, linetext);
    }
}

export class UnterminatedString extends LSError {
    constructor(fname: string, line: number, pos: number, linetext: string) {
        super("Unterminated String", `String on line ${line} has no ending`, fname, line, pos, linetext);
    }
}
