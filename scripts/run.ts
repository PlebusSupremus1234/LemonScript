import { Errors } from "./errors"
import { Lexer } from "./lexer"
import { LSNode, Parser } from "./parser"
import { Token } from "./token"

export function run(text: string, fname: string): { tokens: Token[], node: null | LSNode | Errors, err: boolean, errormsg: null | Errors | LSNode } {
    let lexer = new Lexer(text, fname);
    let [tokens, error] = lexer.genTokens();
    if (error) return { tokens: [], node: null, err: true, errormsg: error };
    else {
        let parser = new Parser(tokens, fname, text);
        let res = parser.parse();
        if (!res) return { tokens, node: null, err: true, errormsg: res };
        else return { tokens, node: res, err: false, errormsg: null };
    }
}