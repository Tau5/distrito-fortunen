import { NetPoint, Point } from './Point';
import { SquareDescription } from './SquareDescription';

export interface NetSquare {
    description: SquareDescription
    location: NetPoint;
    neighbours: NetPoint[];
}

export abstract class Square {
    description: SquareDescription;
    location: Point;
    neighbours: Point[];
    constructor(location: Point, description: SquareDescription, neighbours: Point[]) {
        this.description = description;
        this.location = location;
        this.neighbours = neighbours;
    }

    abstract onStep(): void;
    abstract onDrop(): void;
    abstract updateDescription(): void;
    netify(): NetSquare {
        return {
            description: this.description,
            location: this.location.netify(),
            neighbours: this.neighbours.map(n => n.netify())
        }
    }
}

