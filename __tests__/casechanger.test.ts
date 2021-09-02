import { run } from "../scripts/run"

const input = `
func alternateCase(input: String): String {
    var output: String = ""

    for (var i = 0; i < input.length; i += 1) {
        if (input.get(i).lower() != input.get(i)) output += input.get(i).lower()
        else output += input.get(i).upper()
    }

    return output
}

print(alternateCase("Hello World!")) # hELLO wORLD!
print(alternateCase("TeeEEEsssTTTtT!")) # tEEeeeSSStttTt!
`;

test('Case Changer', () => {
    console.log = jest.fn();
    run("<testFile>", input);

    expect((console.log as any).mock.calls[0][0]).toBe('hELLO wORLD!');
    expect((console.log as any).mock.calls[1][0]).toBe('tEEeeeSSStttTt!');
});