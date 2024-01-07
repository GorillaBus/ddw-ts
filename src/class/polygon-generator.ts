import { Point } from "../model/geometry";

export class PolygonGenerator {

    static circle(vertices: number=9, radius: number): Point[] {
        const angleFraction = (Math.PI * 2) / vertices;
        const points = [];
        for (let i=0; i<vertices; i++) {
            const point: Point = [
                Math.cos(angleFraction * i) * radius,
                Math.sin(angleFraction * i) * radius,
            ];
            points.push(point);
        }
        return points;
    }

    static rectangle(center: Point, width: number, height: number): Point[] {
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const topLeft: Point = [center[0] - halfWidth, center[1] - halfHeight];
        const topRight: Point = [center[0] + halfWidth, center[1] - halfHeight];
        const bottomRight: Point = [center[0] + halfWidth, center[1] + halfHeight];
        const bottomLeft: Point = [center[0] - halfWidth, center[1] + halfHeight];

        return [topLeft, topRight, bottomRight, bottomLeft];
    }
}
