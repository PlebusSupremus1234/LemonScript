import { Lexer } from "./lexer"
import { Token } from "./token"

export function run(text: string, fname: string): Token[] {
    let lexer = new Lexer(text, fname);
    let tokens = lexer.genTokens();
    
    return tokens;
}