import { NetPoint, Point } from "./Point";
import { NetSquare, Square } from "./Square";

export interface NetBoard {
    squares: NetSquare[];
    size: NetPoint;
    initialCash: number;
    initialPoint: NetPoint;
    goal: number;
}

export class Board {

    /**
     * List of squares in no particular order
     */
    private squares: Square[];

    /**
     * Dimensions of the board
     */
    private size: Point;

    goal: number;
    initialCash: number
    initialPoint: Point;

    constructor(size: Point, goal: number, initialCash: number, initialPoint: Point) {
        this.size = size;
        this.squares = [];
        this.goal = goal;
        this.initialCash = initialCash;
        this.initialPoint = initialPoint;
    }

    getSquare(location: Point): Square | null {
        return this.squares.find(square => square.location == location) ?? null;
    }

    getSquareNeighbours(location: Point): Point[] | null {
        // https://stackoverflow.com/a/58401023
        return this.getSquare(location)?.neighbours ?? null;
    }

    getSquareList(): Square[] {
        return this.squares;
    }

    getNetSquareList(): NetSquare[] {
        return this.squares.map(s => s.netify());
    }

    setSquareList(squares: Square[]) {
        this.squares = squares;
    }

    netify(): NetBoard {
        return {
            squares: this.getNetSquareList(),
            goal: this.goal,
            initialCash: this.initialCash,
            initialPoint: this.initialPoint.netify(),
            size: this.size.netify()
        };
    }

    
}