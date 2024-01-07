import { Point } from "../model/geometry";

export interface IDrawingContext {
    drawCircle(x: number, y: number, radius: number, strokeColor?: string, fillColor?: string): void;
    drawLine(a: Point, b: Point, strokeColor: string): void;
    drawPolygon(points: Point[], strokeColor?: string, fillColor?: string): void;
    drawText(
        text: string,
        x: number,
        y: number,
        fontSize: number,
        fontColor: string,
        backgroundColor: string
    ): void;
    clear(): void;
}
