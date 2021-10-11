abstract class Square {
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
}