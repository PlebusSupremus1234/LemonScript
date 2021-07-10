import { Lexer } from "./core/lexer"
import { Parser } from "./core/parser"
import { Interpreter } from "./core/interpreter"

export function run(fname: string, text: string) {
    let lexer = new Lexer(fname, text);
    let [tokens, error] = lexer.lex();
    if (error) return console.log(error.stringify());

    let parser = new Parser(tokens, fname, text);
    let [statements, parseErr] = parser.parse();
    if (parseErr) return console.log(parseErr.stringify());

    let interpreter = new Interpreter(fname, text, tokens);
    interpreter.interpret(statements);
}