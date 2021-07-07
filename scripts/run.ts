import { Errors } from "./errors"
import { Lexer } from "./lexer"
import { LSNode, Parser } from "./parser"
import { Token } from "./token"

export function run(text: string, fname: string): { tokens: Token[], node: null | LSNode, err: boolean, errormsg: null | Errors | LSNode } {
    let lexer = new Lexer(text, fname);
    let [tokens, error] = lexer.genTokens();
    if (error) return { tokens: [], node: null, err: true, errormsg: error };
    else {
        let parser = new Parser(tokens, fname, text);
        let res = parser.parse(); // Fix
        if (!res) return { tokens, node: res, err: false, errormsg: null };
        else return { tokens, node: null, err: true, errormsg: res };
    }
}