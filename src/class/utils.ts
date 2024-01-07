import { Point } from "../model/geometry";

export class Utils {

    static uniqueID(): string {
        function s4(): string {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    static randomPoint(a: number, b: number): [number, number] {
        return [this.randomInt(0, a), this.randomInt(0, b)];
    }

    // static randomPointInRadius(radius: number): [number, number] {
    //     const angle = Math.random() * 2 * Math.PI;
    //     const x = Math.cos(angle) * radius;
    //     const y = Math.sin(angle) * radius;
    //     return [x, y];
    // }

    static randomPointInRadius(center: Point, radius: number, minRadius?: number): Point {
        radius = minRadius != undefined ? minRadius + Math.random() * (radius - minRadius) : radius;
        const randomAngle = Math.random() * 2 * Math.PI; // Ángulo aleatorio en radianes
        const x = center[0] + Math.cos(randomAngle) * radius;
        const y = center[1] + Math.sin(randomAngle) * radius;
        return [x, y];
    }

    static randomRange(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }

    static mapRange(value: number, low1: number, high1: number, low2: number, high2: number): number {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    static randomAngle(): number {
        return this.randomRange(-Math.PI, Math.PI);
    }

    static componentToHex(c: number): string {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    static rgbToHex(r: number, g: number, b: number): string {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    static hexToRgb(hex: string): { r: number; g: number; b: number; } | null {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    static randomColor(): string {
        return "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
    }
}
