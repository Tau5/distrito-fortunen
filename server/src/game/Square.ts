import { NetSquare } from "common/NetSquare";
import { Point } from "common/Point";
import { SquareDescription } from "common/SquareDescription";
import { Server } from "socket.io";
import { GameAPI } from "./GameAPI";
import { Player } from "./Player";

export abstract class Square {
    description: SquareDescription;
    location: Point;
    neighbours: Point[];
    update: (square: Square) => void;

    constructor(location: Point, description: SquareDescription, neighbours: Point[]) {
        this.description = description;
        this.location = location;
        this.neighbours = neighbours;
        this.update = () => {};
    }

    abstract onDrop(player: Player, api: GameAPI): Promise<void>;
    abstract onStep(player: Player, api: GameAPI): Promise<void>;
    
    onUpdate(callback: (square: Square) => void) {
        this.update = callback;
    }
    
    netify(): NetSquare {
        return {
            description: this.description,
            location: this.location.netify(),
            neighbours: this.neighbours.map(n => n.netify())
        }
    }
}