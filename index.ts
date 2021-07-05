import * as readline from "readline"
import { run } from "./scripts/run"
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("LemonScript Language");
console.log("--------------------");

function input() {
    rl.question("-> ", text => {
        let res = run(text);
        console.log(res);

        input();
    });
}

input();