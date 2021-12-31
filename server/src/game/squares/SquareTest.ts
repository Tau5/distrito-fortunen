import { Point } from "common/Point";
import { Square } from "../Square";
import { SquareDescription } from "common/SquareDescription";
import { Player } from "../Player";

export class SquareTest extends Square {
    constructor(location: Point, name: string, neighbours: Point[]) {
        let description: SquareDescription = {
            baseText: "This is a square used for testing, no maps should use it on production",
            rank: 3,
            title: name,
            values: [
                {label: "Value", value: 99999999},
                {label: "Real Value", value: 0}
            ]
        }
        super(location, description, neighbours);
    }

    onDrop(player: Player) {
        return new Promise<void>((resolve, reject) => {
            resolve()
        })
    }

    onStep(player: Player) {
        return new Promise<void>((resolve, reject) => {
            resolve();
        })
    }
}