import { Lexer } from "./lexer"

export function run(text: string): string {
    let lexer = new Lexer(text);
    let tokens = lexer.genTokens();
    console.log(tokens);
    
    return text;
}