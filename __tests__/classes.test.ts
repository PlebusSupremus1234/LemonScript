import { run } from "../scripts/run"

const input = `
import math

class Circle {
    init(x: Number, y: Number, radius: Number) {
        self.x = x
        self.y = y
        self.radius = radius
    }

    area(): Number { return math.PI * self.radius ^ 2 }
    diameter(): Number { return 2 * self.radius }
    circumference(): Number { return 2 * math.PI * self.radius }
}

const circle = Circle(50, 50, 20)

print("Area: " + circle.area())
print("Diameter: " + circle.diameter())
print("Circumference: " + circle.circumference())
`;

test('Classes', () => {
    console.log = jest.fn();
    run("<testFile>", input);

    expect((console.log as any).mock.calls[0][0]).toBe('Area: 1256.6370614359173');
    expect((console.log as any).mock.calls[1][0]).toBe('Diameter: 40');
    expect((console.log as any).mock.calls[2][0]).toBe('Circumference: 125.66370614359172');
});