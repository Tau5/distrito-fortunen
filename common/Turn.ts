import { NetPoint } from "./Point";


export interface Turn {
    /**
     * While the player's remaining turns == diceRoll, they cannot move to barrierSquare
     */
    playerName: string,
    barrierSquare: NetPoint,
    diceRoll: number,
    
}