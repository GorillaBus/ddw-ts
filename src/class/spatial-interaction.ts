import { SpatialPartitioner, Partition } from "./spatial-partitioner";
import { Body } from "./body";

type ResolverFunction = (bodyA: Body, bodyB: Body) => void;

export class SpatialInteraction {
    private partitioner: SpatialPartitioner;
    private localResolver: Function | null = null;
    private neighborResolver: Function | null = null;


    constructor(cellSize: number, neighborRange: number) {
        this.partitioner = new SpatialPartitioner(cellSize, neighborRange);

    }

    public setLocalResolver(f: Function): void {
        this.localResolver = f;
    }

    public setNeighborResolverResolver(f: Function): void {
        this.neighborResolver = f;
    }

    public registerBody(body: Body) {
        this.partitioner.registerBody(body);
    }

    public resolve(): void {
        const cells = this.partitioner.getCells();
    
        for (let i=0,leni=cells.length; i<leni; i++) {
            const currentCell: Partition = cells[i];
            const neighborCells: Partition[] = this.partitioner.getNeighborCells(currentCell);
    
            for (let j = 0; j < currentCell.bodies.length; j++) {
                const currentBody: Body = currentCell.bodies[j];
    
                if (this.localResolver) {

                    for (let k = 0; k < currentCell.bodies.length; k++) {
                        const localBody: Body = currentCell.bodies[k];
                        if (currentBody.getID() === localBody.getID()) continue;
                        this.localResolver(currentBody, localBody);
                    }
                }

                if (this.neighborResolver) {

                    for (let k = 0; k < neighborCells.length; k++) {
                        const neighborCell = neighborCells[k];
                        for (let l = 0; l < neighborCell.bodies.length; l++) {
                            const neighborBody = neighborCell.bodies[l];
                            this.neighborResolver(currentBody, neighborBody);
                        }
                    }
                }
            }
        }
    }
    
}
