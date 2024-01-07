import Body from "./body";

type PartitionData = {
    x: number;
    y: number;
    id: string;
};

export type Partition = PartitionData & {
    bodies: Body[];
};

export type Settings = {
    cellSize?: number;
    neighborRange?: number;
    debug?: boolean;
};

export class SpatialPartitioner {
    private cellSize: number;
    private neighborRange: number;
    protected cells: Partition[];
    protected cellIndex: { [key: string]: Partition };
    protected debug: boolean;

    constructor(cellSize: number = 128, neighborRange: number = 1, debug: boolean = false) {
        this.cellSize = cellSize;
        this.neighborRange = neighborRange;
        this.cells = [];
        this.cellIndex = {};
        this.debug = debug;
    }

    public getCell(cellId: string): Partition | undefined {
        return this.cellIndex[cellId];
    }

    public getCells(): Partition[] {
        return this.cells;
    }

    public getNeighborCells(cell: Partition): Partition[] {
        const neighborCells: Partition[] = [];
        const neighborIds = this.getNeighborCellIds(cell.x, cell.y);
        for (let id of neighborIds) {
            const neighbor = this.getCell(id);
            if (neighbor) {
                neighborCells.push(neighbor);
            }
        }
        return neighborCells;
    }

    public addCell(Partition: Partition): Partition {
        const cell = {
            ...Partition,
            bodies: Partition.bodies || [],
        };
        this.cells.push(cell);
        this.cellIndex[Partition.id] = cell;
        return cell;
    }

    public resetGrid(): void {
        this.cells = [];
        this.cellIndex = {};
    }

    public registerBody(body: Body): void {
        const point = body.getWorldModel().getCenter(); // Porque no el location del body?
        const partitionData = this.pointPosition(point);
        let cell = this.getCell(partitionData.id);
        if (!cell) {
            const partition = {
                ...partitionData,
                bodies: [],
            };
            cell = this.addCell(partition);
        }
        cell.bodies?.push(body);
    }

    private pointPosition(point: [number, number]): PartitionData {
        const xComponent = Math.floor(point[0] / this.cellSize);
        const yComponent = Math.floor(point[1] / this.cellSize);
        return {
            x: xComponent,
            y: yComponent,
            id: `${xComponent}_${yComponent}`,
        };
    }

    private getNeighborCellIds(x: number, y: number): string[] {
        return [
            [x - 1, y - 1].join("_"),
            [x, y - 1].join("_"),
            [x + 1, y - 1].join("_"),
            [x + 1, y].join("_"),
            [x + 1, y + 1].join("_"),
            [x, y + 1].join("_"),
            [x - 1, y + 1].join("_"),
            [x - 1, y].join("_"),
        ];
    }
}
