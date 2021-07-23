import { Lexer } from "./core/lexer"
import { Parser } from "./core/parser"
import { Resolver } from "./core/resolver"
import { Interpreter } from "./core/interpreter"
import { ErrorHandler } from  "./structures/errorhandler"

export function run(fname: string, text: string) {
    let errorhandler = new ErrorHandler(fname, text);

    let lexer = new Lexer(fname, text, errorhandler);
    let tokens = lexer.lex();
    if (!tokens) return;

    let parser = new Parser(tokens, errorhandler);
    let statements = parser.parse();
    if (!statements) return;

    let interpreter = new Interpreter(tokens, errorhandler);
    let resolver = new Resolver(interpreter, errorhandler);
    
    let error = resolver.resolve(...statements);
    if (error) return;

    interpreter.interpret(statements);
}