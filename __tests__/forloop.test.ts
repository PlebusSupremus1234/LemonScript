import { run } from "../scripts/run"

const input = `
for (var i = 0; i < 10; i += 1) print(i)

var b = 5
for (; b < 10; b += 2) print(b)
`;

test('For Loop', () => {
    console.log = jest.fn();
    run("<testFile>", input);

    let outputs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 5, 7, 9];
    
    for (let i = 0; i < outputs.length; i++) expect((console.log as any).mock.calls[i][0]).toBe(outputs[i]);
});