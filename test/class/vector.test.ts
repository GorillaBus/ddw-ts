import { Vector } from "../../src/class/vector";

test('Vector constructor initializes x and y correctly', () => {
    const vector = new Vector(3, 4);
    expect(vector.getX()).toBe(3);
    expect(vector.getY()).toBe(4);
});

test('get method returns the correct point', () => {
    const vector = new Vector(1, 2);
    expect(vector.get()).toEqual([1, 2]);
});

test('setX and getX methods work correctly', () => {
    const vector = new Vector();
    vector.setX(5);
    expect(vector.getX()).toBe(5);
});

test('setY and getY methods work correctly', () => {
    const vector = new Vector();
    vector.setY(7);
    expect(vector.getY()).toBe(7);
});

test('setAngle and getAngle methods work correctly', () => {
    const vector = new Vector(1, 0);
    vector.setAngle(Math.PI / 2);
    expect(vector.getAngle()).toBeCloseTo(Math.PI / 2);
});

test('setLength and getLength methods work correctly', () => {
    const vector = new Vector(3, 4);
    vector.setLength(5);
    expect(vector.getLength()).toBeCloseTo(5);
});

test('hasLength method returns true for non-zero vectors', () => {
    const vector = new Vector(1, 2);
    expect(vector.hasLength()).toBeTruthy();
});

test('add method returns the correct result', () => {
    const vector1 = new Vector(1, 2);
    const vector2 = new Vector(3, 4);
    expect(vector1.add(vector2)).toEqual(new Vector(4, 6));
});

test('addTo method modifies the vector correctly', () => {
    const vector = new Vector(1, 2);
    vector.addTo(new Vector(3, 4));
    expect(vector.get()).toEqual([4, 6]);
});

test('copy method returns a copy of the vector', () => {
    const vector = new Vector(1, 2);
    const copy = vector.copy();
    expect(copy.get()).toEqual(vector.get());
});

test('reset method sets x and y to 0', () => {
    const vector = new Vector(1, 2);
    vector.reset();
    expect(vector.get()).toEqual([0, 0]);
});
