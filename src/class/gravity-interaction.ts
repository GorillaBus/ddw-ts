import Body from "./body";
import { GlobalInteraction } from "./global-interaction";
import { PhysicsService } from "./physics-service";

export class GravityInteraction extends GlobalInteraction {

    run(bodies: Body[]): void {
        this.resolve(bodies, this.gravitate.bind(this));
    }

    private gravitate(bodyA: Body, bodyB: Body): void {
        const force = PhysicsService.gravity(bodyA, bodyB);
        bodyA.applyForce(force);
    }
}
