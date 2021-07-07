import * as readline from "readline"
import { readFileSync, existsSync } from "fs"
import { run } from "./scripts/run"
import { red, yellow, cyan } from "./scripts/helpers"
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log(yellow("LemonScript"));
console.log(yellow("-----------"));

function input() {
    rl.question(cyan("-> "), text => {
        let inp;
        if (text.toLowerCase().startsWith("ls run")) {
            let file = text.slice(6);
            if (file.length <= 1) console.log(yellow("Please input a text file to run, for example 'ls run index.txt'"));
            else {
                if (!existsSync(file.trim())) console.log(red("I couldn't find that file"));
                else inp = [readFileSync(file.trim()).toString(), file.trim()];
            }
        } else inp = [text, "<stdin>"];
        if (inp) {
            let res = run(inp[0], inp[1]);
            if (res.err) {
                console.log(res.errormsg);
            } else {
                console.log(res.tokens);
                console.log(res.node);
            }
        }

        input();
    });
}

input();