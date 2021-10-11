class Board {

    /**
     * List of squares in no particular order
     */
    private squares: Square[];

    /**
     * Dimensions of the board
     */
    private size: Point;

    constructor(size: Point) {
        this.size = size;
        this.squares = [];
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


    
}