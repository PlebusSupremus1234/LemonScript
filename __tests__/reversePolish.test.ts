import { run } from "../scripts/run"

const input = `
import math

const operations = ["+", "-", "*", "/"]

func evalReversePolishNotation(input: Array<String>): Number {
    var stack = []

    for (var i = 0; i < input.length; i += 1) {
        const value = input.get(i)

        if (!operations.contains(value)) stack.push(value.number())
        else {
            const b = stack.pop()
            const a = stack.pop()

            if (value == "+") stack.push(a + b)
            elif (value == "-") stack.push(a - b)
            elif (value == "*") stack.push(a * b)
            else stack.push(math.floor(a / b))
        }
    }
    
    return stack.get(0)
}

print(evalReversePolishNotation(["2","1","+","3","*"])) # 9
print(evalReversePolishNotation(["4","13","5","/","+"])) # 6
`;

test('While Loop', () => {
    console.log = jest.fn();
    run("<testFile>", input);
    
    expect((console.log as any).mock.calls[0][0]).toBe(9);
    expect((console.log as any).mock.calls[1][0]).toBe(6);
});