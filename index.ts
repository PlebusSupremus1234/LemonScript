import { run } from "./scripts/run"
import * as readline from "readline"
import { readFileSync, existsSync } from "fs"
import { red, yellow, cyan, bold } from "./scripts/data/helper"

let text = String.raw`
__                                 _____           _       _
| |                               / ____|         (_)     | |
| |     ___ _ __ ___   ___  _ __ | (___   ___ _ __ _ _ __ | |_
| |    / _ \ '_ ' _ \ / _ \| '_ \ \___ \ / __| '__| | '_ \| __|
| |___|  __/ | | | | | (_) | | | |____) | (__| |  | | |_) | |_
|______\___|_| |_| |_|\___/|_| |_|_____/ \___|_|  |_| .__/ \__|
                                                    | |
                                                    |_|
`;

let output = text.split("\n").slice(1);
output = output.slice(0, -1);

let maxWidth = Math.max(...output.map(i => i.length));
let spacing = " ".repeat(3);

for (let i in output) output[i] = `${yellow(output[i])}${" ".repeat(maxWidth - output[i].length + 3)}${cyan("|")}`;

output[1] += `${spacing}${bold('Docs:')} https://plebussupremus1234.github.io/LemonScript/`;
output[3] += `${spacing}${bold('Version:')} 1.6.0`;
output[5] += `${spacing}${bold('Made by:')} Plebus Supremus`;

console.log("\n" + output.join("\n")); 
console.log(yellow("-----------"));

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function input() {
    rl.question(cyan("-> "), text => {
        let inp: null | [string, string] = null;
        if (text.toLowerCase().startsWith("ls run")) {
            let file = text.slice(6);
            if (file.length <= 1) console.log(yellow("Please input a text file to run, for example 'ls run index.lemon'"));
            else {
                if (!existsSync(file.trim())) console.log(red("I couldn't find that file"));
                else inp = [file.trim(), readFileSync(file.trim()).toString()];
            }
        } else inp = ["<stdin>", text];

        if (inp) run(inp[0], inp[1]);

        input();
    });
}

input();