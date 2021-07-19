# LemonScript
A programming language made with TypeScript.

LemonScript is still in heavy development, and is currently up to: Class Initializers

Here is a preview of LemonScript:
```js
# Variables
var a = 1
var b = 2
print(a * 2 + b) # 4

# Functions
func isPrime(num) {
    for (var i = 2; i < num; i = i + 1) {
        if (num % i == 0) return false
    }
    return true
}

print(isPrime(17)) # true
```

A full list on all the functionality of LemonScript and how to use it can be found [here](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md).

## Installation
Currently, LemonScript is not compiled, so you will have to:

1. Clone/Download the repo, (make sure you have node.js installed)
2. Install the dependencies with `npm install`.
3. Run `ts-node index.ts` in the directory to run LemonScript.

## Usage
To start LemonScript, run `ts-node index.ts` in the directory. Then, you can either directly write code into the terminal, or run a file with `ls run [file]`. There are numerous existing tests and scripts you can run, for example `ls run tests/for-loop.lemon`.

## Change Log
Starting from 12/7 because I forgot to do it before
```
19/7: Classes
18/7: Added a resolver, constant variables and fixed many bugs
17/7: Added Functions and fixed the lexer
16/7: Added for loop, documentation and fixed lexer
14/7: Added if statement and while loop and fixed bugs
12/7: Added scopes and variables
```

Made by Plebus Supremus