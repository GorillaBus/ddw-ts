import { Point } from '../model/geometry';
import { Body } from './body';
import { Model, ModelStyle } from './model';
import { PolygonGenerator } from './polygon-generator';
import { Utils } from './utils';
import { Vector } from './vector';

const DEFAULT_STYLE: ModelStyle = {
    strokeColor: "#000000",
    fillColor: "#000000",
};

export class BodyFactory {

    static createBody(
        vertices: number = 16, 
        radius: number = 100, 
        center: Point,
        mass: number = 1,
        restitution: number = 1,
        density: number = 1,
        style: ModelStyle = { ...DEFAULT_STYLE }) {

        const circlePoints = PolygonGenerator.circle(vertices, radius);
        const circleModel = new Model(circlePoints, style);
        const randomAngle = Math.random() * 2 * Math.PI; // Ángulo aleatorio en radianes
        const x = center[0] + Math.cos(randomAngle) * radius;
        const y = center[1] + Math.sin(randomAngle) * radius;
        return new Body(circleModel, mass, density, restitution, new Vector(x, y));
    }

    static createRandomBodies(
        quantity: number, 
        mass: number,
        restitution: number,
        density: number,  
        vertices: number,
        radius: number,
        style: ModelStyle,
        center: Point,
        maxRadius: number,
        minRadius: number): Body[] {

        const bodies: Body[] = [];        
        for (let i = 0; i < quantity; i++) {
            const position = Utils.randomPointInRadius(center, maxRadius, minRadius);
            const b = this.createBody(vertices, radius, position, mass, density, restitution, style);
            bodies.push(b);
        }

        return bodies;
    }
}
