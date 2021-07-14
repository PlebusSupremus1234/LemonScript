# LemonScript
A programming language made with TypeScript.

LemonScript is still in very heavy development, and is currently up to: For and While Loops

Here is a preview of how I would want LemonScript to be like:
```js
# string variable
var name = "Pleb"
print(name)

# functions
func isEven(num) {
    if (num % 2 == 0) return true
    else return false
}
print(isEven(12))
```

Currently, the language is not compiled, so you will have to download ts-node, readline, fs and @types/node if you would like to use it. (Can't see why you would)

```npm install ts-node @types/node readline fs```

To run it, you can then type ```ts-node index.ts```. This will run the main file. You can then either write the code directly into the terminal, or create a file with the code and then run ```ls run [file]``` inside the terminal. 

## Change Log
Starting from 12/7 because I forgot to do it before
```
14/7: Added if statement and while loop and fixed bugs
12/7: Added scopes and variables
```