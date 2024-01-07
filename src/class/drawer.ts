import { Model } from "./model";
import { IDrawingContext } from "../interface/idrawing-context";

export class Drawer {
    private context: IDrawingContext;

    constructor(drawingContext: IDrawingContext) {
        this.context = drawingContext;
    }

    clear() {
        this.context.clear();
    }

    drawModel(model: Model): void {
        this.context.drawPolygon(model.getPoints(), model.style.strokeColor, model.style.fillColor);

        // Recursively draw children
        model.children.forEach(m => this.drawModel(m));
    }

    drawBoundingRectangle(model: Model, ctx: CanvasRenderingContext2D): void {
        // ctx.beginPath();
        // ctx.strokeStyle = "yellow";
        // ctx.strokeRect(model.bounds.xMin, model.bounds.yMin, model.width, model.height);
        // ctx.closePath();
    }

    drawBoundingCircle(model: Model, ctx: CanvasRenderingContext2D): void {
        // ctx.beginPath();
        // ctx.strokeStyle = "yellow";
        // ctx.arc(model.center[0], model.center[1], model.radius, 0, 2 * Math.PI);
        // ctx.stroke();
        // ctx.closePath();
    }

    printText(text: string, x: number, y: number) {
        this.context.drawText(text, x, y, 14, 'white', 'black');
    }

}

