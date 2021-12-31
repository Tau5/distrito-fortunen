import { Point } from "common/Point";
import { SquareDescription } from "common/SquareDescription";
import { GameAPI } from "../GameAPI";
import { Player } from "../Player";
import { Square } from "../Square";

export class SquareBank extends Square {
    constructor(location: Point, neighbours: Point[]) {
        let description: SquareDescription = {
            baseText: "Bank",
            rank: 0,
            title: "Bank",
            values: []
        }
        super(location, description, neighbours);
    }
    onDrop(player: Player, api: GameAPI): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            resolve();
        })
    }
    onStep(player: Player, api: GameAPI): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            resolve();
        })  
    }
}