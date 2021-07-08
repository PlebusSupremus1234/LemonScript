import { Errors } from "./errors"
import { Lexer } from "./lexer"
import { LSNode, Parser } from "./parser"
import { Token } from "./token"

export function run(text: string, fname: string): [null | Token[] | LSNode, null | Errors] {
    let lexer = new Lexer(text, fname);
    let [tokens, error] = lexer.genTokens();
    if (error) return [[], error];
    else {
        let parser = new Parser(tokens, fname, text);
        let [res, error] = parser.parse();
        return [res, error];
    }
}