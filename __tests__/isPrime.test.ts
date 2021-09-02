import { run } from "../scripts/run"

const input = `
func isPrime(num: Number): Boolean {
    for (var i = 2; i < num; i += 1) {
        if (num % i == 0) return false
    }
    return true
}

print(isPrime(17)) # true
print(isPrime(97)) # true
print(isPrime(18)) # false
print(isPrime(54)) # false
`;

test('Case Changer', () => {
    console.log = jest.fn();
    run("<testFile>", input);

    let outputs = [true, true, false, false];
    
    for (let i = 0; i < outputs.length; i++) expect((console.log as any).mock.calls[i][0]).toBe(outputs[i]);
});