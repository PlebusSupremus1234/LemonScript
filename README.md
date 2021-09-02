# [LemonScript](https://plebussupremus1234.github.io/LemonScript/)

A static & dynamic typed, simple and clean programming language inspired by TypeScript and Python. 

Here is a preview of LemonScript:
```js
# Variables
var a = 1
var b = 2
print(a * 2 + b) # 4

# Functions
func isPrime(num: Number): Boolean {
    for (var i = 2; i < num; i += 1) {
        if (num % i == 0) return false
    }
    return true
}

print(isPrime(17)) # true
```

Links:
- [LemonScript Official Website](https://plebussupremus1234.github.io/LemonScript/)
- [LemonScript Installation](https://plebussupremus1234.github.io/LemonScript/docs/setup/intro)
- [LemonScript Documentation](https://plebussupremus1234.github.io/LemonScript/docs/documentation/intro)
- [More Code Examples](https://plebussupremus1234.github.io/LemonScript/docs/examples/classes/class)

## Change Log
Starting from 12/7 because I forgot to do it before
```
02/9: Added integration tests
29/8: Fixed typeof function
27/8: Used enums instead of strings for types
24/8: Added elif statement
19/8: Change file run command
17/8: Array Types
14/8: Arrays
11/8: String indexing and assignment operators
10/8: String properties
07/8: LemonScript Website
05/8: Added properties to modules
02/8: Math module
01/8: Documentation
31/7: Random module
30/7: Rewrite modules
29/7: Basic modules
27/7: Added optional argument support for funcs
26/7: Added typeof func and types for function args
25/7: Added multiple types for variables and function returns + documentation for it
24/7: Added singular static typing for variables
23/7: New error system, overriding for methods and print fixing
22/7: Class inheritance
21/7: Added init function for classes and fixed order of op
20/7: Function error fixed
19/7: Classes
18/7: Added a resolver, constant variables and fixed many bugs
17/7: Added functions and fixed the lexer
16/7: Added for loop, documentation and fixed lexer
14/7: Added if statement and while loop and fixed bugs
12/7: Added scopes and variables
```

Made by Plebus Supremus