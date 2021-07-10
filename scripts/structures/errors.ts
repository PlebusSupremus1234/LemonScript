import { red, yellow, cyan, blue, bold } from "../helper"

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
        let fileDisplay = `${cyan(this.fname)}:${yellow(this.line.toString())}:${yellow(this.pos.toString())}`;
        let errorHeader = `${bold(`${red("error")}:`)} ${this.type}`;
        let errorText = bold(blue(this.error));
        let errorLine = `${bold(blue(`${this.line} |`))} ${this.linetext}`;
        let caret = `${Array(this.pos + this.line.toString().length + 2).fill(" ").join("")}${bold(blue("^"))}`;
        return `${fileDisplay} - ${errorHeader}\n${errorText}\n\n${errorLine}\n${caret}`;
    }
}

export type Errors = SyntaxError | TypeError;

export class SyntaxError extends LSError {
    constructor(fname: string, text: string, line: number, pos: number, linetext: string) {
        super("Syntax Error", text, fname, line, pos, linetext);
    }
}

export class TypeError extends LSError {
    constructor(fname: string, text: string, line: number, pos: number, linetext: string) {
        super("Type Error", text, fname, line, pos, linetext);
    }
}