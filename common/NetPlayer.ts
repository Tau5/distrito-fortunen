import { NetPoint } from "common/Point"

export interface NetPlayer {
    location  : NetPoint;
    level     : number;
    readyCash : number;
    netWorth  : number;
    turnNumber: number;
    name      : string;
    lastMove  : NetPoint;
}