import { Body } from "./body";
import { Model } from "./model";
import { GeometryService, Square } from "./geometry-service";
import { Matrix, Point } from "../model/geometry";
import { TransformationService } from "./transformation-service";
import { PolygonGenerator } from "./polygon-generator";
import { Vector } from "./vector";


export class Viewport extends Body {
    private width: number;
    private height: number;
    private attached: Body | null;
    private transitions: any[];


    constructor(width: number, height: number, position: Point, attachTo?: Body) {
        const points = PolygonGenerator.rectangle(position, width, height);        
        const viewportModel = new Model(points, { fillColor: "", strokeColor: "red" });

        super(viewportModel, 1, 1, 0, new Vector());

        this.width = width || 800;
        this.height = height || 600;
        this.attached = attachTo || null;
        this.transitions = [];
    }

    update() {
        if (this.attached) {
            const [locationX, locationY] = this.attached.getLocation().get();
            this.location.setX(locationX);
            this.location.setY(locationY);
        } else {
            this.velocity.addTo(this.acceleration);
            this.location.addTo(this.velocity);
            this.acceleration.multiplyBy(0);
            this.angleVelocity += this.angleAcceleration;
            this.angle += this.angleVelocity;
            this.angleAcceleration = 0;
        }

        this.world = this.getWorldTransform();
        //this.runTransitions();
    }

    intersects(body: Body): boolean {
        return GeometryService.r2rIntersect(body.getBoundingRect() as Square, this.getBoundingRect() as Square);
        // if (main) {
        //     return true;
        // }
        // if (body.getWorldModel().children.length > 0) {
        //     for (let child of body.getWorldModel().children) {
        //         const itc = GeometryService.r2rIntersect(child, this.world);
        //         if (itc) {
        //             return true;
        //         }
        //     }
        // }
        // return false;
    }

    attachTo(body: Body): void {
        this.attached = body;
    }

    detach(): void {
        this.attached = null;
    }

    addTransition(t: any): void {
        this.detach();
        this.transitions.push(t);
    }

    runTransitions(): void {
        for (let i = 0; i < this.transitions.length; i++) {
            const t = this.transitions[i];

            if (t.steps === 0) {
                if (typeof t.end === 'function') t.end();
                this.transitions.splice(i, 1);
                continue;
            }

            if (t['translate']) {
                const dir = t.translate.location.add(t.translate.velocity).substract(this.location);
                const dist = dir.getLength();
                const translateStep = dist / t.steps;
                dir.normalize();
                dir.multiplyBy(translateStep);
                this.location.addTo(dir);
            }

            if (t['scale']) {
                const scaleStep = (t.scale - this.scale) / t.steps;
                this.scale += scaleStep;
            }

            t.steps--;
        }
    }

    transitionTo(body: Body | null, steps: number, zoom: number, cb: (() => void) | null): void {
        const t = {
            steps,
            translate: body,
            scale: zoom,
            end: cb
        };
        this.addTransition(t);
    }


    rotateLeft(magnitude: number = 0.01): void {
        this.angle -= magnitude;
    }

    rotateRight(magnitude: number = 0.01): void {
        this.angle += magnitude;
    }

    scaleUp(factor: number = 0.1): void {
        this.scale += this.scale * factor;
    }

    scaleDown(factor: number = 0.1): void {
        this.scale -= this.scale * factor;
    }

    moveUp(factor: number = 1): void {
        if (this.attached) return;
        const step = -this.scale * factor;
        const newPos = this.location.getY() - step;
        this.location.setY(newPos);
    }
    moveDown(factor: number = 1){
        if (this.attached) return;
        const step = -this.scale * factor;
        const newPos = this.location.getY() + step;
        this.location.setY(newPos);
    }
    moveLeft(factor: number = 1){
        if (this.attached) return;
        const step = -this.scale * factor;
        const newPos = this.location.getX() - step;
        this.location.setX(newPos);
    }
    moveRight(factor: number = 1){
        if (this.attached) return;
        const step = -this.scale * factor;
        const newPos = this.location.getX() + step;
        this.location.setX(newPos);
    }

    getRelativeView(body: Body): Model {

        // Obtener los valores del Viewport
        const angle = -this.angle;  // Ángulo inverso
        const scale = 1 / this.scale;  // Escala inversa
        const position = this.location.get().map(coord => -coord);  // Posición inversa

        // Calcular la matriz de transformación inversa
        const rotationM = TransformationService.rotationMatrix(angle);
        const scalingM = TransformationService.scalingMatrix([scale, scale]);
        const translationM = TransformationService.translationMatrix(position);
        const inverseMatrix = TransformationService.multiplyMatrices(translationM, TransformationService.multiplyMatrices(rotationM, scalingM));

        // Aplicar la transformación inversa a cada objeto
        const worldModel = body.getWorldModel();
        const transformedPoints: Point[] = worldModel.getPoints().map(point => TransformationService.multiplyMatrixAndPoint(inverseMatrix, point));
        return new Model(transformedPoints, worldModel.style);
    }

}
