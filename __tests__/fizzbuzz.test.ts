import { run } from "../scripts/run"

const input = `
func FizzBuzz(nums: Number) {
    for (var i = 1; i <= nums; i += 1) {
        var fizz = i % 3 == 0
        var buzz = i % 5 == 0
        if (fizz and buzz) print("FIZZBUZZ")
        elif (fizz) print("FIZZ")
        elif (buzz) print("BUZZ")
        else print(i)
    }
}

FizzBuzz(20)
`;

test('Fizz Buzz', () => {
    console.log = jest.fn();
    run("<testFile>", input);

    let outputs = [];
    for (let i = 1; i <= 20; i++) {
        if (i % 3 == 0 && i % 5 == 0) outputs.push("FIZZBUZZ");
        else if (i % 3 == 0) outputs.push("FIZZ");
        else if (i % 5 == 0) outputs.push("BUZZ");
        else outputs.push(i)
    }

    for (let i = 0; i < outputs.length; i++) expect((console.log as any).mock.calls[i][0]).toBe(outputs[i]);
});