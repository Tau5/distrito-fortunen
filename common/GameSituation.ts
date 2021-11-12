import { NetPoint } from "./Point";
import { NetPlayer } from "./NetPlayer";
import { NetBoard } from "./Board";

/**
 * Interface with ALL the information about the current game.
 *
 * Use only on initialization or when a player
 * is behind on data on the current game
*/
export interface GameSituation {
    players: NetPlayer[],
    board: NetBoard
}