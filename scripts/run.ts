import { Errors } from "./errors"
import { Lexer } from "./lexer"
import { Token } from "./token"

export function run(text: string, fname: string): [Token[], null | Errors] {
    let lexer = new Lexer(text, fname);
    let [tokens, error] = lexer.genTokens();
    return [tokens, error];
}