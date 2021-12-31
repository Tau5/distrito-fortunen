import { NetPoint, Point } from "./Point";

export interface NetTurn {
    /**
     * While the player's remaining turns == diceRoll, they cannot move to barrierSquare
     */
    playerName: string,
    barrierSquare: NetPoint,
    diceRoll: number,
    movesLeft: number,
    canMove: boolean

}

export class Turn {
    playerName: string;
    barrierSquare: Point;
    diceRoll: number;
    movesLeft: number;
    moves: Array<Point>;
    canMove: boolean;

    constructor(playerName: string, barrierSquare: Point) {
        this.playerName = playerName;
        this.barrierSquare = barrierSquare;
        this.diceRoll = this.movesLeft = Math.round( Math.random() * 5 ) + 1;
        this.moves = [];
        this.canMove = true;
    }

    netify(): NetTurn {
        return {
            playerName: this.playerName,
            barrierSquare: this.barrierSquare.netify(),
            diceRoll: this.diceRoll,
            movesLeft: this.movesLeft,
            canMove: this.canMove
        }
    }

}
