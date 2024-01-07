import { IDrawingContext } from "../interface/idrawing-context";
import { Point } from "../model/geometry";

export class CanvasDrawingContext implements IDrawingContext {
    private context: CanvasRenderingContext2D;
    private boundries: Record<string, number>[];
    private width: number;
    private height: number;

    constructor(context: CanvasRenderingContext2D, width: number, height: number) {
        this.context = context;
        this.width = width;
        this.height = height;
		// this.boundries = [{
		// 	x: -width / 2,
		// 	y: -height / 2
		// }, {
		// 	x: width / 2,
		// 	y: -height / 2
		// }, {
		// 	x: width / 2,
		// 	y: height / 2
		// }, {
		// 	x: -width / 2,
		// 	y: height / 2
		// }];

		this.boundries = [{
			x: 0,
			y: 0
		}, {
			x: 0,
			y: height
		}, {
			x: width,
			y: height
		}, {
			x: width,
			y: 0
		}];
    }

	drawText(
        text: string, 
        x: number, 
        y: number, 
        fontSize: number = 14, 
        fontColor: string = 'white', 
        backgroundColor: string = 'black'
	): void {
		this.context.font = `${fontSize}px Arial`;
		this.context.fillStyle = backgroundColor;
		
		const textWidth = this.context.measureText(text).width;
		this.context.fillRect(x, y - fontSize, textWidth, fontSize * 1.2);
		this.context.fillStyle = fontColor;
		this.context.fillText(text, x, y);
	}

    drawCircle(x: number, y: number, radius: number, strokeColor?: string, fillColor?: string): void {
		this.context.beginPath();
		this.context.arc(x, y, radius, 0, 2 * Math.PI);
		if (strokeColor) {
			this.context.strokeStyle = strokeColor;
			this.context.stroke();
		}
        if (fillColor) {
			this.context.fillStyle = fillColor;
			this.context.fill();
		}
		this.context.closePath();
    }

    drawLine(a: Point, b: Point, strokeColor: string): void {
		this.context.beginPath();
        this.context.moveTo(a[0], a[1]);
        this.context.lineTo(b[0], b[1]);
		if (strokeColor) {
			this.context.strokeStyle = strokeColor;
			this.context.stroke();
		}
		this.context.closePath();
    }

    drawPolygon(points: Point[], strokeColor?: string, fillColor?: string): void {
		this.context.beginPath();
		this.context.moveTo(points[0][0], points[0][1]);
		for (let i = 1; i < points.length; i++) {
			this.context.lineTo(points[i][0], points[i][1]);
		}

		if (strokeColor) {
			this.context.strokeStyle = strokeColor;
		}

		if (fillColor) {
			this.context.fillStyle = fillColor;
			this.context.fill();
		}

		this.context.stroke();
		this.context.closePath();
	}

    clear(): void {
        this.context.clearRect(0, 0, this.width, this.height);
    }

}