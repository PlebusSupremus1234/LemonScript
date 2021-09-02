import { run } from "../scripts/run"

const input = `
func fib(num: Number): Number {
    if (num <= 1) return num
    return fib(num - 1) + fib(num - 2)
}

for (var i = 0; i < 10; i += 1) print(fib(i))
`;

test('Fibonacci', () => {
    console.log = jest.fn();
    run("<testFile>", input);

    let outputs = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
    for (let i = 0; i < outputs.length; i++) expect((console.log as any).mock.calls[i][0]).toBe(outputs[i]);
});