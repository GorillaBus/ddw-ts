import { Vector } from './vector';
import { Utils } from './utils';
import { Model } from './model';

export class Body {
    protected angleAcceleration = 0;
    protected angleVelocity = 0;
    protected angle = 0;
    protected scale = 1;
    protected acceleration: Vector;
    protected velocity: Vector;
    protected location: Vector;
    private mass: number;
    private density: number;
    private restitution: number=1;
    protected model: Model;
    protected world: Model;
    private id: string;
    onUpdate?: Function;

    constructor(
        model: Model,
            mass: number,
            restitution: number,
            density: number,
            location?: Vector,
            angle?: number,
            scale?: number,
            acceleration?: Vector,
            velocity?: Vector,
            angleAcceleration?: number,
            id?: string,
        ) {
        this.angle = angle || 0;
        this.scale = scale || 1;
        this.acceleration = acceleration || new Vector(0,0);
        this.velocity = velocity || new Vector(0,0);
        this.location = location || new Vector(0,0);
        this.mass = mass;
        this.restitution = restitution;
        this.density = density;
        this.angleAcceleration = angleAcceleration || 0;
        this.id = id || Utils.uniqueID();
        this.model = model;
        this.world = this.model.transform(this.angle, this.scale, this.location.get());
    }

    getID() {
        return this.id;
    }

    getAngle(): number {
        return this.angle;
    }

    getScale(): number {
        return this.scale;
    }

    setScale(scale: number): void {
        this.scale = scale;
    }

    getRadius(): number {
        return this.world.getRadius();
    }
    

    getHeading(): number {
        return this.velocity.getAngle();
    }

    setHeading(angle: number): void {
        this.velocity.setAngle(angle);
    }

    getMass(): number {
        return this.mass;
    }

    getDensity(): number {
        return this.density;
    }

    getRestitution(): number {
        return this.restitution;
    }

    getSpeed(): number {
        return this.velocity.getLength();
    }

    setSpeed(speed: number): void {
        this.velocity.setLength(speed);
    }

    setLocation(location: number): void {
        this.location.setLength(location);
    }

    getLocation(): Vector {
        return this.location;
    }

    setVelocity(newVelocity: Vector): void {
        this.velocity = newVelocity;
    }

    getVelocity(): Vector {
        return this.velocity;
    }

    getBoundingRect(): [number, number][] {
        return [
            [this.world.bounds.xMin, this.world.bounds.yMin],
            [this.world.bounds.xMin, this.world.bounds.yMax],
            [this.world.bounds.xMax, this.world.bounds.yMax],
            [this.world.bounds.xMax, this.world.bounds.yMin]
        ];
    }

    getModel(): Model {
        return this.model;
    }

    getWorldModel(): Model {
        return this.world;
    }

    update(): void {
        this.velocity.addTo(this.acceleration);
        this.location.addTo(this.velocity);
        this.acceleration.multiplyBy(0);
        this.angleVelocity += this.angleAcceleration;
        this.angle += this.angleVelocity;
        this.angleAcceleration = 0;
        this.world = this.getWorldTransform();

        if (this.onUpdate) this.onUpdate();
    }

    getWorldTransform(): Model {
        return this.model.transform(this.angle, this.scale, this.location.get());
    }

    applyForce(force: Vector): void {
        let f = force.divide(this.mass);        
        this.acceleration.addTo(f);
    }

    applyNetForce(force: Vector): void {
        this.acceleration.addTo(force);
    }

    resetVelocity(): void {
        this.velocity.multiplyBy(0);
    }

    distanceTo(target: Body): number {
        return target.location.subtract(this.location).getLength() - this.getRadius() - target.getRadius();
    }
}

export default Body;
