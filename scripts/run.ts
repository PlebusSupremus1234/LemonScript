import { Interpreter } from "./interpreter"
import { Lexer } from "./lexer"
import { Parser } from "./parser"

export function run(text: string, fname: string) {
    let lexer = new Lexer(text, fname);
    let [tokens, error] = lexer.genTokens();
    if (error) return [[], error];
    else {
        let parser = new Parser(tokens, fname, text);
        let [res, error] = parser.parse();
        if (error) return [res, error];
        if (res) {
            let interpreter = new Interpreter(fname, tokens, text);
            let [output, interpError] = interpreter.interpret(res);
            return [output, interpError];
        } else return [null, null];
    }
}