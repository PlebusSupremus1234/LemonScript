import { red, yellow, cyan, blue, bold } from "../helper"

export class LSError {
    header: string;
    text: string;
    fname: string;
    ftext: string;
    line: number;
    rowpos: number;

    constructor(header: string, text: string, fname: string, ftext: string, line: number, rowpos: number) {
        this.header = header;
        this.text = text;
        this.fname = fname;
        this.ftext = ftext;
        this.line = line;
        this.rowpos = rowpos;
    }

    stringify(): string {
        let linetext = this.ftext.split("\n")[this.line - 1];

        let file = `${cyan(this.fname)}:${yellow(this.line.toString())}:${yellow(this.rowpos.toString())}`;
        let header = `${bold(`${red("error")}:`)} ${this.header}`;
        let text = bold(blue(this.text));
        let line = `${bold(blue(`${this.line} |`))} ${linetext}`;
        let caret = `${Array(this.rowpos + this.line.toString().length + 2).fill(" ").join("")}${bold(blue("^"))}`;

        return `${file} - ${header}\n${text}\n\n${line}\n${caret}`;
    }
}