import { Lexer } from "./core/lexer"
import { Parser } from "./core/parser"
import { Resolver } from "./core/resolver"
import { Interpreter } from "./core/interpreter"    

export function run(fname: string, text: string) {
    let lexer = new Lexer(fname, text);
    let tokens = lexer.lex();
    if (!tokens) return;

    let parser = new Parser(fname, text, tokens);
    let statements = parser.parse();
    if (!statements) return;

    let interpreter = new Interpreter(fname, text, tokens);
    let resolver = new Resolver(fname, text, interpreter);
    
    let error = resolver.resolve(...statements);
    if (error) return;

    interpreter.interpret(statements);
}