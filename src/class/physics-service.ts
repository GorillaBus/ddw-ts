import Body from "./body";
import { Vector } from "./vector";

const DEFAULT_GRAVITY = 0.098;

type Intersection = {
    x: number;
    y: number;
    dist_squared: number;
};

export class PhysicsService {

    static gravity(source: Body, target: Body, G: number=DEFAULT_GRAVITY): Vector {
        const dir = target.getLocation().subtract(source.getLocation());
        const distance = dir.getLength();
        const minDistance = target.getRadius() + source.getRadius();

        if (minDistance > distance) {
            return new Vector(0, 0);
        }

        const force = G * (source.getMass() * target.getMass() / (distance * distance));
        dir.normalize();
        dir.multiplyBy(force);
        return dir;
    }


    
    static elasticCollision(body1: Body, body2: Body): void {
        if (!PhysicsService.intersecting(body1, body2)) {
            return;
        }

        // Ajustar las posiciones para que ya no se intersecten
        PhysicsService.adjustPositions(body1, body2);
    
        // const v1 = body1.getVelocity();
        // const v2 = body2.getVelocity();
        // const m1 = body1.getMass();
        // const m2 = body2.getMass();
    
        // const relativeVelocity = v2.subtract(v1);
        // const relativePosition = body2.getLocation().subtract(body1.getLocation());
    
        // const distance = relativePosition.getLength();
    
        // if (distance === 0) return;
    
        // const collisionNormal = relativePosition.divide(distance);
        // const velocityAlongNormal = relativeVelocity.dot(collisionNormal);
    
        // if (velocityAlongNormal > 0) return;
    
        // const restitution = Math.min(body1.getRestitution(), body2.getRestitution());
        // const impulseMag = -(1 + restitution) * velocityAlongNormal / (1 / m1 + 1 / m2);
    
        // const impulse = collisionNormal.multiply(impulseMag);

        // console.log("Collision impulse: ", impulse.getLength());
    
        // body1.getVelocity().addTo(impulse.divide(m1));
        // body2.getVelocity().subtractFrom(impulse.divide(m2));
    }
      
    static adjustPositions(body1: Body, body2: Body): void {
        const overlap = body1.getWorldModel().getRadius() + body2.getWorldModel().getRadius() - body1.getLocation().dist(body2.getLocation());
    
        if (overlap > 0) {
            console.log("Moviendo ", overlap)
            const direction = body2.getLocation().subtract(body1.getLocation());
            direction.normalize();
            const adjustmentVector = direction.multiply(overlap / 2);
            
            body1.getLocation().subtractFrom(adjustmentVector);
            body2.getLocation().addTo(adjustmentVector);
        }
    }
    
    static intersecting(body1: Body, body2: Body): boolean {
        const distance = body1.getLocation().dist(body2.getLocation());
        return distance < (body1.getWorldModel().getRadius() + body2.getWorldModel().getRadius());
    }

    static elasticCollision_old(source: Body, target: Body, intersection: Intersection): void {
        const xVelocity = target.getVelocity().getX() - source.getVelocity().getX();
        const yVelocity = target.getVelocity().getY() - source.getVelocity().getY();

        const dotProduct = (intersection.x * xVelocity) + (intersection.y * yVelocity);

        if (dotProduct > 0) {
            const collisionScale = dotProduct / intersection.dist_squared;

            const collision = new Vector(intersection.x * collisionScale, intersection.y * collisionScale);

            const totalDensity = source.getDensity() + target.getDensity();
            const r1 = (source.getDensity() / totalDensity) / 2;
            const r2 = (target.getDensity() / totalDensity) / 2;

            const combinedMass = source.getMass() + target.getMass();
            const collisionWeight1 = (2 * target.getMass() / combinedMass) * 0.1;
            const collisionWeight2 = (2 * source.getMass() / combinedMass) * 0.25;
            const collisionResult1 = new Vector(collisionWeight1 * collision.getX(), collisionWeight1 * collision.getY());
            const collisionResult2 = collisionResult1.multiply(-1);

            source.applyNetForce(collisionResult1);
            target.applyNetForce(collisionResult2);
        }
    }

    static orbitDistanceBySpeed(body: Body, target: Body, speed: number): number {
        return (body.getMass() * target.getMass()) / speed;
    }

    static orbitSpeedByDistance(body: Body, target: Body, G: number = 9.8): number {
        const distance = body.distanceTo(target);
        return Math.sqrt((G * target.getMass()) / distance);
    }
}
