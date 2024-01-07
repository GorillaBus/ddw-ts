import { Body } from "./body";

export abstract class GlobalInteraction {
    abstract run(bodies: Body[]): void;
    
    resolve(bodies: Body[], cb: Function): void {
        for (let i=0,len=bodies.length; i<len; i++) {
            const bodyA = bodies[i];
            for (let j=0, len=bodies.length; j<len; j++) {
                const bodyB = bodies[j];
                if (bodyA.getID() === bodyB.getID()) continue;
                cb(bodyA, bodyB);
            }
        }
    }
}
