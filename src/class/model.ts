import { Matrix, ModelBounds, Point } from "../model/geometry";
import { TransformationService } from "./transformation-service";

export type ModelStyle = Record<string, string>;

const defaultStyle: Record<string, string> = {
    strokeColor: "#000000",
    fillColor: "#000000",
};

export class Model {
    public children: Model[] = [];
    public bounds: ModelBounds;
    public center: Point;
    public width: number = 0;
    public height: number = 0;
    public radius: number = 0;
    public style: ModelStyle;
    private points: Point[] = [];


    constructor(points: Point[], style: ModelStyle={...defaultStyle}, children: Model[]=[]) {
        this.points = points;
        this.children = children;
		this.bounds = this.getBounds();
		this.center = this.getCenter();		
        this.width = this.getWidth();
		this.height = this.getHeight();
		this.radius = this.getRadius();
        this.style = style;
    }

    getWidth(): number {
        return this.bounds.xMax - this.bounds.xMin;
    }

    getHeight(): number {
        return this.bounds.yMax - this.bounds.yMin;
    }

    getRadius(): number {
        return Math.max(this.width, this.height) / 2;
    }

	getPoints(): Point[] {
		return this.points;
	}

	getCenter(): Point {
		return [
			(this.bounds.xMin + this.bounds.xMax) / 2,
			(this.bounds.yMin + this.bounds.yMax) / 2
		];
	}

	getBounds(): ModelBounds  {
		const xs = [];
		const ys = [];
		for (let i=0,len=this.points.length; i<len; i++) {
			const point = this.points[i];
			xs.push(point[0]);
			ys.push(point[1]);
		}
		return {
			xMin: Math.min.apply(null, xs),
			xMax: Math.max.apply(null, xs),
			yMin: Math.min.apply(null, ys),
			yMax: Math.max.apply(null, ys)
		};
	}

    transform(angle: number, scale: number, translate: Point): Model {
        const rotationM = TransformationService.rotationMatrix(angle);
        const scalingM = TransformationService.scalingMatrix([scale, scale]);
        const translationM = TransformationService.translationMatrix(translate);
        const combinedMatrix = TransformationService.multiplyMatrices(translationM, TransformationService.multiplyMatrices(rotationM, scalingM));
        const transformedPolygon = TransformationService.transformPoints(this.points, combinedMatrix);
        return new Model(transformedPolygon, this.style, this.children);
    }

    applyInverseTransform(inverseTransformMatrix: Matrix): Model {
        const transformedPoints: Point[] = this.points.map(point => TransformationService.multiplyMatrixAndPoint(inverseTransformMatrix, point));
        return new Model(transformedPoints, this.style);
    }

}
