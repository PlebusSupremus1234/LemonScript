import { run } from "../scripts/run"

const input = `
class Rectangle {
    init(width: Number, height: Number) {
        self.width = width
        self.height = height
    }

    area(): Number { return self.width * self.height }
}

class Square extends Rectangle { # Creating a subclass of Rectangle
    init(length: Number) {
        super.init(length, length) # Calling the Rectangle init because that is the super
    }
}

var square = Square(30)
print(square.area()) # The class inherits the method from its superclass
`;

test('Subclasses', () => {
    console.log = jest.fn();
    run("<testFile>", input);

    expect((console.log as any).mock.calls[0][0]).toBe(900);
});