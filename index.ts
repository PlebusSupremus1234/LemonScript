import * as readline from "readline"
import { readFileSync, existsSync } from "fs"
import { run } from "./scripts/run"
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("LemonScript Language");
console.log("--------------------");

function input() {
    rl.question("-> ", text => {
        let inp;
        if (text.toLowerCase().startsWith("ls run")) {
            let file = text.slice(6);
            if (file.length <= 1) console.log("Please input a text file to run, for example 'ls run index.txt'");
            else {
                if (!existsSync(file.trim())) console.log("I couldn't find that file");
                else inp = [readFileSync(file.trim()).toString(), file.trim()];
            }
        } else inp = [text, "<stdin>"];
        if (inp) {
            let res = run(inp[0], inp[1]);
            console.log(res);
        }

        input();
    });
}

input();