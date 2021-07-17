# LemonScript Documentation
### Here is the documentation for LemonScript.
## Contents:
- [Binary Operators](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#binary-operators)
- [Variables](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#variables)
- [Print Function](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#print-function)
- [If/Else Statements](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#ifelse-statements)
- [While Loop](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#while-loop)
- [For Loop](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#for-loop)
- [Functions](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#functions)

## Binary Operators
In LemonScript, there are a variety of operations such as `+`, `-`, `*` and `/`. Here is a list of all of them and what they do:
- `+` - The plus operator can add a number or string to another number or string. For example `5 + 6` will return `11`, and `"Hi I'm " + "Bob"` will return `Hi I'm Bob`. If it's a number plus a string, or the other way around, it'll treat both values a string. 

- `-` - The minus operator can only subtract a number from another. For example `13.6 - 7.2` will return `6.4`. 

- `*` - The multiplication operator can either multiply 2 numbers, for example `4 * 7` will return `28`, or a string multiplied by a number, for example `"hi" * 3` will return `hihihi`. 

- `/` - The divide operator can only divide a number from another number, for example `12 / 3` will return `4`. 

- `%` - The modulus operator returns the remainder when a number is divided by another number. For example, `14 % 4` will return `2` because the highest multiple of 4 is 12, and `14 - 12` is 2. 

### Comparison Operators
These operators return a boolean value (true or false) when comparing 2 expressions. 

- `<` or `<=` - The less or less or equal than operators check 2 numbers to another, and if they're less or equal. For example, `4 < 5` returns `true`, but `14 < 8` is `false`. The `<=` operator does the same thing, but also checks for equality, i.e `6 <= 6` is `true`.

- `>` or `>=` - The greater or greater or equal than operators check 2 numbers to another, and if they're greater or equal. For example, `12 > 6` returns `true`, but `14 > 12` is `false`. The `>=` operator does the same thing, but also checks for equality. 

- `==` - The equals operator checks if 2 values have the same type, and the same value. For example, `"hello" == "hello"` is true, but `"5" == 5` or `23 == 41.2` are not. 

## Variables
To declare a variable, you can use the `var` keyword with this syntax:
```js
var [variable_name] = [variable_value]
```
The variable name has to start with an alphabetical letter or an underscore, then can be any character. It cannot contain spaces. 

The value can be an expression, value, or even another variable. For example a number or a string. Without the value, the variable's value is automatically set to `null`. 

Something to keep in mind when using variables is the scope. A variable is only avaliable in the scope, and cannot be accessed outside it. For example:
```js
var a = 5
if (a > 3) {
    print(a)
    var b = 12
}
print(b) # Error
```
The `print(b)` line will throw an error, because the variable b is only avaliable inside the if statement scope. 

## Print Function
To output a value in the console, you can use the `print` function with this syntax:
```js
print([value])
```
The value can either be a LemonScript value, or an expression. 

## If/Else Statements
To write an if statement, you can use the `if` keyword with this syntax:
```js
if ([condition]) {
    [code]
}
```
The code will execute if the condition is truthy. You can also couple an else statement at the end like:
```js
if ([condition]) {
    [code]
} else {
    [code]
}
```
The code in the else statement will execute if the condition isnt truthy.

## While Loop
To write a while loop, you can use the `while` keyword with this syntax:
```js
while ([condition]) {
    [code]
}
```
As the name implies, while the condition is truthy, the code will execute. Be careful with this, as sometimes this can cause an infinite loop. 

## For Loop
A for loop is a refactored while loop with a different syntax:
```js
for ([variable]; [condition]; [increment]) {
    [code]
}
```
Essentially, it is just a while loop worded differently for readibility. The while loop below does the same as the for loop:
```js
[variable]
while ([condition]) {
    [code]
    [increment]
}
```
The variable can be a variable declaration, or an existing variable. The loop will execute while the condition is true. The increment is executed at the end of each loop. An example of a for loop is:
```js
for (var i = 0; i < 5; i = i + 1) print(i)
```
This loop will output `0`, `1`, `2`, `3`, `4`. You can also remove the variable clause if you have a pre existing variable, for example:
```js
var a = 0
for (; a < 5; a = a + 1) print(a)
```

## Functions
A function is a block of code that you can use multiple times to peform a particular task. The syntax is:
```js
func [function name]([args (optional)]) {
    [code]
}
```
The function name follows the same rules as a variable name. Next, are the arguments. These are optional, and are seperated with commas. For example:
```js
func add(num1, num2) {
    return num1 + num2
}

print(add(1, 2))
print(add(14, 6.54))
print(add(123, -11))
```
This is a basic function that takes 2 inputs, then returns the sum. Returning a value stops the fuction, and returns the value in the statement. This means that proceeding code after the statement will not execute. If there is no expression or no return statement, the function automatically returns `null`. 