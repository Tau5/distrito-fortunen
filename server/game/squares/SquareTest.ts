class SquareTest extends Square {
    constructor(location: Point, name: string, neighbours: Point[]) {
        let description: SquareDescription = {
            baseText: "This is a square used for testing, no maps should use it on production",
            rank: 3,
            title: name,
            values: []
        }
        super(location, description, neighbours);
    }

    onDrop() {

    }

    onStep() {

    }

    updateDescription() {

    }
}