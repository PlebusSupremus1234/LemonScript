import { red, yellow, cyan, blue, bold } from "../data/helper"

export type ErrorHeader = "Syntax Error" | "Type Error" | "Class Error" | "Math Error" | "Invalid Function Declaration" | "Invalid Function Call" | "Import Error"
| "Variable Error" | "Invalid Class Declaration" | "Property Error";

export class ErrorHandler {
    fname: string;
    ftext: string;

    header?: ErrorHeader;
    text?: string;
    line?: number;
    rowpos?: number;

    helptext?: string;

    constructor(fname: string, ftext: string) {
        this.fname = fname;
        this.ftext = ftext;
    }

    newError(header: ErrorHeader, text: string, line: number, rowpos: number) {
        if (!this.header && !this.text && !this.line && !this.rowpos) {
            this.header = header;
            this.text = text;
            this.line = line;
            this.rowpos = rowpos;
        }
    }

    newHelp(helptext: string) {
        if (!this.helptext) this.helptext = helptext;
    }

    stringify(e: any) {
        if (this.header && this.text && this.line && this.rowpos) {
            let linetext = this.ftext.split("\n")[this.line - 1];

            let file = `${cyan(this.fname)}:${yellow(this.line.toString())}:${yellow(this.rowpos.toString())}`;
            let header = `${bold(`${red("error")}:`)} ${this.header}`;
            let text = bold(blue(this.text));
            let line = `${bold(blue(`${this.line} |`))} ${linetext}`;
            let caret = `${Array(this.rowpos + this.line.toString().length + 2).fill(" ").join("")}${bold(blue("^"))}`;

            let res = `${file} - ${header}\n${text}\n\n${line}\n${caret}`;

            if (this.helptext) res += `\n${bold(`${yellow("help")}`)}${bold(`: ${this.helptext}`)}`;
            return res;
        } else return e;
    }
}