import { Point } from "../model/geometry";
import { Vector } from "./vector";

export type Circle = {
    center: Point;
    radius: number;
}

export type Square = [
    [number, number],
    [number, number],
    [number, number],
    [number, number]
]

export class GeometryService {    

    /* Basics */

    static distanceTo(vector1: Vector, vector2: Vector): number {
        const d = vector2.subtract(vector1);
        return d.getLength();
    }

    /* Matrices */

    static dot(vector1: Vector, vector2: Vector): number {
        return vector1.getX() * vector2.getX() + vector1.getY() * vector2.getY();
    }

    static cross(vector1: Vector, vector2: Vector): number {
        return vector1.getX() * vector2.getY() - vector1.getY() * vector2.getX();
    }

    static perpTo(vector1: Vector, vector2: Vector): Vector[] {
        const fromTarget = vector1.subtract(vector2);
        fromTarget.normalize();
        const perpLeft = new Vector(fromTarget.getY(), -fromTarget.getX());
        //perpLeft.setLength(1);
        const perpRight = new Vector(-fromTarget.getY(), fromTarget.getX());
        //perpRight.setLength(1);
        return [perpLeft, perpRight];
    }

    static project(vector1: Vector, vector2: Vector): Vector {
        const dotProduct = GeometryService.dot(vector1, vector2);
        const vector2LengthSquared = GeometryService.dot(vector2, vector2);
    
        // Verificar si vector2 es cero para evitar división por cero
        if (vector2LengthSquared === 0) {
            return new Vector(0, 0);
        }
    
        const factor = dotProduct / vector2LengthSquared;
        const rx = vector2.copy();
        rx.multiplyBy(factor);
        return rx;
    }

    /* Angles */

    static angleBetween(vector1: Vector, vector2: Vector): number {
        const v1 = vector1.copy();
        const v2 = vector2.copy();
        v1.normalize();
        v2.normalize();
        const dot = GeometryService.dot(v1, v2);
        const theta = Math.acos(dot);
        if (isNaN(theta)) {
            throw new Error("Theta is 'NaN' on Vector.angleBetween()");
        }
        return theta;
    }

    static angleDirection(vector1: Vector, vector2: Vector): number {
        const crossProduct = GeometryService.cross(vector1, vector2);
        if (crossProduct > 0) {
            return 1;
        } else if (crossProduct < 0) {
            return -1;
        } else {
            return 0;
        }
    }

    static angleDifference(vector1: Vector, vector2: Vector): number {
        const theta = GeometryService.angleBetween(vector1, vector2);
        const dir = GeometryService.angleDirection(vector1, vector2);
        return theta * dir;
    }

    /* Intersections */

    static rangeIntersect(min1: number, max1: number, min2: number, max2: number) {
        return max1 >= min2 && min1 <= max2;
    }

    static r2rIntersect(r1: Square, r2: Square) {
        return this.rangeIntersect(r1[0][0], r1[2][0], r2[0][0], r2[2][0]) &&
            this.rangeIntersect(r1[0][1], r1[2][1], r2[0][1], r2[2][1]);
    }

    static c2rIntersect(c: Circle, r: Square) {
        const distX = Math.abs(c.center[0] - (r[0][0] + r[2][0]) / 2);
        const distY = Math.abs(c.center[1] - (r[0][1] + r[2][1]) / 2);
        // Out of range
        if (distX > (Math.abs(r[0][0] - r[2][0]) / 2 + c.radius) || distY > (Math.abs(r[0][1] - r[2][1]) / 2 + c.radius)) {
            return false;
        }
        // In range
        if (distX <= (Math.abs(r[0][0] - r[2][0]) / 2) || distY <= (Math.abs(r[0][1] - r[2][1]) / 2)) {
            return true;
        }
        // Rectangle corners
        const dx = distX - (Math.abs(r[0][0] - r[2][0]) / 2);
        const dy = distY - (Math.abs(r[0][1] - r[2][1]) / 2);
        return (dx * dx + dy * dy <= (c.radius * c.radius));
    }

    static c2cIntersect(c1: Circle, c2: Circle) {
        const xDist = c1.center[0] - c2.center[0];
        const yDist = c1.center[1] - c2.center[1];
        const distSquared = (xDist * xDist) + (yDist * yDist);
        const radiusSquared = (c1.radius + c2.radius) * (c1.radius + c2.radius);
        if (distSquared < radiusSquared) {
            return { x: xDist, y: yDist, dist_squared: distSquared };
        }
        return false;
    }
}
