# LemonScript Documentation
### Here is the documentation for LemonScript.
## Contents:
- [Binary Operators](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#binary-operators)
- [Variables](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#variables)
- [Types](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#types)
- [Comments](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#comments)
- [Print Function](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#print-function)
- [If/Else Statements](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#ifelse-statements)
- [While Loop](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#while-loop)
- [For Loop](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#for-loop)
- [Functions](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#functions)
- [Classes](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#classes)
- [Modules](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#modules)

## Binary Operators
In LemonScript, there are a variety of operations such as `+`, `-`, `*` and `/`. Here is a list of all of them and what they do:
- `+` - The plus operator can add a number or string to another number or string. For example `5 + 6` will return `11`, and `"Hi I'm " + "Bob"` will return `Hi I'm Bob`. If it's a number plus a string, or the other way around, it'll treat both values a string. 

- `-` - The minus operator can only subtract a number from another. For example `13.6 - 7.2` will return `6.4`. 

- `*` - The multiplication operator can either multiply 2 numbers, for example `4 * 7` will return `28`, or a string multiplied by a number, for example `"hi" * 3` will return `hihihi`. 

- `/` - The divide operator can only divide a number from another number, for example `12 / 3` will return `4`. 

- `%` - The modulus operator returns the remainder when a number is divided by another number. For example, `14 % 4` will return `2` because the highest multiple of 4 is 12, and `14 - 12` is 2. 

- `^` - The caret operator exponentializes a number to another number. For example `2 ^ 3` will return `8`. Other types will throw an error. 

### Comparison Operators
These operators return a boolean value (true or false) when comparing 2 expressions. 

- `<` or `<=` - The less or less or equal than operators check 2 numbers to another, and if they're less or equal. For example, `4 < 5` returns `true`, but `14 < 8` is `false`. The `<=` operator does the same thing, but also checks for equality, i.e `6 <= 6` is `true`.

- `>` or `>=` - The greater or greater or equal than operators check 2 numbers to another, and if they're greater or equal. For example, `12 > 6` returns `true`, but `14 > 12` is `false`. The `>=` operator does the same thing, but also checks for equality. 

- `==` - The equals operator checks if 2 values have the same type, and the same value. For example, `"hello" == "hello"` is true, but `"5" == 5` or `23 == 41.2` are not. 

## Variables
In LemonScript, there are two different types of variables, constant, and mutable. A constant variable, as the name describes, is constant and immutable. So the interpreter will throw an error if you try to change the value. The other type is mutable. This variable's value can change types. To declare a variable, you can use the `var` or `const` keyword with this syntax:
```js
[var | const] [variable_name] = [variable_value]
```
The keyword is either `var` or `const`. Var is the mutable, and const is the constant. The variable name has to start with an alphabetical letter or an underscore, then can be any character. It cannot contain spaces. 

The value can be an expression, value, or even another variable. For example a number or a string. Without the value, the variable's value is automatically set to `null`. You can also add types to the variable. You can find more information about this [here](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#types).

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
### Constant variable immutability in more detail
Here is an example of how a constant variable works:
```js
const a = 5
print(a) # 5

const b = a * 2
print(b) # 10

a = 12 # This will error because 'a' is a constant variable
```

## Types
In LemonScript, a value or an output can have types. The types can are `Any`, `Number`, `String`, `Boolean` and `Null`. By default, the type is set to `Any`. Which means it can be any type, for example `"hello"` or `true` or `12`. Setting a type is good because it won't allow for type errors anywhere in your program and often prevents variables from changing types, which further defends against unintended errors. 

### Variable Types
To set a type for a variable, you can use the following syntax:
```js
var [variable_name]: [type] = [value]
```
If you set the variable's type to, for example `Number`, then the compiler will error when a value is set to another type. You can also set multiple types to a variable using the `|` symbol:
```js
var [variable_name]: [type1] | [type2] ... = [value]
```
This means a variable can be either type, although sometimes, this isn't the best practice. 

### Function Types
In LemonScript, functions can have types too. Firstly, lets talk about the function return types. The compiler will throw an error if it recieves a return type that doesn't match the function's return type. You can set the types to a function like this:
```js
func [function_name]([args]): [type1] | [type2] ... {
    [code]
}
```

You can also set types for the arguments of a function. For example:
```js
func addNums(num1: Number, num2: Number): Number {
    return num1 + num2
}

print(addNums(1, "two"))
```
This script will error because the second argument passed into the `addNums` function is not a number type, as required in the function args. 

## Comments
A comment is a line of text that is ignored by the interpreter. It's useful for adding notes to describe what's going on, or to remove a bit of code from being executed. In LemonScript, you can comment using `#`. For example:
```js
# Check if a number is prime
func isPrime(num) {
    for (var i = 2; i < num; i = i + 1) {
        if (num % i == 0) return false
    }
    return true
}

print(isPrime(17))
```

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
The code will execute if the condition is [truthy](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#truthiness). You can also couple an else statement at the end like:
```js
if ([condition]) {
    [code]
} else {
    [code]
}
```
The code in the else statement will execute if the condition isnt [truthy](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#truthiness).

## While Loop
To write a while loop, you can use the `while` keyword with this syntax:
```js
while ([condition]) {
    [code]
}
```
As the name implies, while the condition is [truthy](https://github.com/PlebusSupremus1234/LemonScript/blob/master/documentation.md#truthiness), the code will execute. Be careful with this, as sometimes this can cause an infinite loop. 

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

You can also set optional arguments by adding a `?` after the argument name, like this:
```js
func test(arg1, arg2?) {}
```
If no arg2 argument is passed, the arg2 will be automatically assigned to `null`. 

## Classes
A class is an `object` that has properties and methods (its own functions). Here is the syntax for creating a class:
```js
class [class name] {
    init([args]) { [code] } # Optional

    [methods]
}
```
Firstly, you can declare the class name to an valid indentifier/variable name. Then, if you want, you can add a `init` function. This function will be called when the class is created. It's useful for assigning properties to the class. For example, here is a class example using all of those concepts:
```js
class Rectangle {
    init(x, y, width, height) {
        self.x = x
        self.y = y
        self.width = width
        self.height = height
    }

    getArea() {
        return self.width * self.height
    }
}

var rectangle1 = Rectangle(50, 20, 100, 120)
print(rectangle1.getArea()) # 12000
```
The self is a variable that is avaliable to any function inside the class. You can assign properties to it. Lets dive into how thise code works. Firstly, this class has an `init` function. The `init` function also has arguments. This means that when declaring a variable to this class, you need to pass in the 4 arguments. As you can see, it is done when declaring the `rectangle1` variable. Then, the `init` function goes and sets the `x`, `y`, `width`, and `height` properties. After that, theres a `getArea` method, which returns the `width` * `height`.

The init function isn't the only place where you can set and change the self variable. You can also actually run the init function again. Heres an example showing that:
```js
class Cake {
    init() {
        self.flavor = "Chocolate"
    }

    taste() {
        print("The " + self.flavor + " cake is delicious!")

        self.flavor = "Red Velvet" # Setting flavor to Red Velvet
        print("The " + self.flavor + " cake is delicious!")

        self.init() # Resetting the flavor by rerunning the init func
        print("The " + self.flavor + " cake is delicious!")
    }
}

var cake = Cake()
cake.taste()
```

### Subclasses and Superclasses
A subclass is a class that inherits the functions from another class. You can do this using the `<` symbol. Here is an example:
```js
class Rectangle {
    init(width, height) {
        self.width = width
        self.height = height
    }

    area() { return self.width * self.height }
}

class Square < Rectangle { # Creating a subclass of Rectangle
    init(length) {
        super.init(length, length)
    }
}

var square = Square(30)
print(square.area()) # The class inherits the method from its superclass
```
Here we are creating a subclass of `Rectangle` called `Square`. The square class's init func only takes one argument, unlike the rectangle one. But then it calls `super.init(length, length)`. This is calling the init function of the rectangle class, initializing the self variables. 

For safety reasons, if you try to override an existing superclass method in the subclass, it'll error. To override a superclass method in a sublass, you can put a `override` keyword infront of the method name. For example:
```js
override [method name]([args]) {}
```

## Modules
In LemonScript, a module is a class that you can import into a file. For example:
```js
import random # importing the random module
print(random.randint(1, 10)) # random number between 1 and 10
```
The syntax for importing a module is:
```js
import [module name] as [variable name]
```
The `as [variable name]` is optional, but it defines the module with a different variable name. This is useful if the module name is already defined. Without it, the module is auto defined to the module's name. Now, you can treat the module as a class. Here is a list of all the modules than LemonScript currently as, along with all the methods. 

### Random Module
The random module has the following methods:
- `randint(min, max)` - Returns a random integer between the two values (inclusive). 
- `random([min, max])` - Returns a random decimal between the two values (inclusive). If no arguments are passed, then its between 0 and 1. 
- `randGauss([mean], [standarddev])` - Returns a random number fitting a Gaussian, or normal, distribution. If a mean argument isn't passed, it sets the mean to 0. If a standard deviation argument isn't passed, it sets the standard deviation to 1. 

## Truthiness
In LemonScript, everything (strings, numbers etc) is truthy except the values `false` and `null`. 