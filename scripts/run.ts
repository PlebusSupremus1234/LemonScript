import { Lexer } from "./core/lexer"
import { Parser } from "./core/parser"
import { Interpreter } from "./core/interpreter"

export function run(fname: string, text: string) {
    let lexer = new Lexer(fname, text);
    let tokens = lexer.lex();
    if (!tokens) return;
    console.log(tokens);
    
    let parser = new Parser(tokens, fname, text);
    let statements = parser.parse();
    if (!statements) return;

    let interpreter = new Interpreter(fname, text, tokens);
    interpreter.interpret(statements);
}