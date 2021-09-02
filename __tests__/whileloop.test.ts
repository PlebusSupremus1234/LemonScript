import { run } from "../scripts/run"

const input = `
var a = 0

while (a < 10) {
    print(a)
    a += 1
}
`;

test('While Loop', () => {
    console.log = jest.fn();
    run("<testFile>", input);

    let outputs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    for (let i = 0; i < outputs.length; i++) expect((console.log as any).mock.calls[i][0]).toBe(outputs[i]);
});