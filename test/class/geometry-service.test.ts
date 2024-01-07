import { Vector } from "../../src/class/vector";
import { GeometryService } from "../../src/class/geometry-service";

test("distanceTo should calculate the correct distance between two vectors", () => {
    const vector1 = new Vector(0, 0);
    const vector2 = new Vector(3, 4);
    expect(GeometryService.distanceTo(vector1, vector2)).toBe(5);
});

test('dot should return the correct dot product of two vectors', () => {
    const vector1 = new Vector(1, 3);
    const vector2 = new Vector(4, -2);
    expect(GeometryService.dot(vector1, vector2)).toBe(-2);
});

test('cross should return the correct cross product of two vectors', () => {
    const vector1 = new Vector(1, 0);
    const vector2 = new Vector(0, 1);
    expect(GeometryService.cross(vector1, vector2)).toBe(1);
});

test('perpTo should return two vectors perpendicular to the difference of the input vectors', () => {
    const vector1 = new Vector(1, 2);
    const vector2 = new Vector(-2, 1);
    const difference = vector1.subtract(vector2);
    const [perpLeft, perpRight] = GeometryService.perpTo(vector1, vector2);

    // Verificar si perpLeft y perpRight son perpendiculares a la diferencia de vector1 y vector2
    expect(GeometryService.dot(perpLeft, difference)).toBeCloseTo(0);
    expect(GeometryService.dot(perpRight, difference)).toBeCloseTo(0);
});

test('project should correctly project one vector onto another', () => {
    const vector1 = new Vector(2, 3);
    const vector2 = new Vector(0, 1);
    const projected = GeometryService.project(vector1, vector2);

    expect(projected.getX()).toBe(0);
    expect(projected.getY()).toBe(3);
});

test('angleBetween should calculate the correct angle between two vectors', () => {
    const vector1 = new Vector(1, 0);
    const vector2 = new Vector(0, 1);
    expect(GeometryService.angleBetween(vector1, vector2)).toBe(Math.PI / 2);
});

test('angleDirection should return the correct direction of angle between two vectors', () => {
    const vector1 = new Vector(1, 0);
    const vector2 = new Vector(0, 1);
    expect(GeometryService.angleDirection(vector1, vector2)).toBe(1);
});

test('angleDifference should return the correct angle difference between two vectors', () => {
    const vector1 = new Vector(1, 0);
    const vector2 = new Vector(0, 1);
    expect(GeometryService.angleDifference(vector1, vector2)).toBe(Math.PI / 2);
});
