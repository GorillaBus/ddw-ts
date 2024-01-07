import { Point } from "../model/geometry";

export class Vector {
    private x: number;
    private y: number;

    constructor(x: number=0, y: number=0) { // , length?: number, angle?: number
        this.x = x;
        this.y = y;
        // if (length) {
        //     this.setLength(length);
        // }
        // if (angle) {
        //     this.setAngle(angle);
        // }
    }

    get(): Point {
        return [this.x, this.y];
    }

    setX(magnitude: number) {
        this.x = magnitude;
    }

    getX(): number {
        return this.x;
    }

    setY(magnitude: number) {
        this.y = magnitude;
    }

    getY(): number {
        return this.y;
    }

    setAngle(angle: number) {
        const length = this.getLength();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    getAngle(): number {
        return Math.atan2(this.y, this.x);
    }

    setLength(length: number) {
        const angle = this.getAngle();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    getLength(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    hasLength(): boolean {
        return this.x !== 0 || this.y !== 0;
    }


    /** Inmutable operations **/
    add(vector: Vector): Vector {
        return new Vector(this.x + vector.getX(), this.y + vector.getY());
    }

    subtract(vector: Vector): Vector {
        return new Vector(this.x - vector.getX(), this.y - vector.getY());
    }

    multiply(value: number): Vector {
        return new Vector(this.x * value, this.y * value);
    }

    divide(value: number): Vector {
        return new Vector(this.x / value, this.y / value);
    }

    normalized() {
        const v = this.copy();
        const length = v.getLength();
        if (length !== 0) {
            v.divideBy(length);
        }
        return v;
    }


    /** Mutable operations **/
    addTo(vector: Vector) {        
        this.x += vector.getX();
        this.y += vector.getY();
    }

    subtractFrom(vector: Vector) {
        this.x -= vector.getX();
        this.y -= vector.getY();
    }

    multiplyBy(value: number) {
        this.x *= value;
        this.y *= value;
    }

    divideBy(value: number) {
        this.x /= value;
        this.y /= value;
    }

    normalize() {
        const length = this.getLength();
        if (length !== 0) {
            this.divideBy(length);
        }
    }

    copy(): Vector {
        return new Vector(this.getX(), this.getY());
    }

    reset() {
        this.x = 0;
        this.y = 0;
    }
}
