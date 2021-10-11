import { Socket } from "socket.io";

export class Player {

    location  : Point;
    level     : number;
    readyCash : number;
    turnNumber: number;
    name      : string;

    constructor(name: string, location: Point, turnNumber: number, readyCash: number) {
        this.name     = name;
        this.location   = location;
        this.turnNumber = turnNumber;
        this.readyCash  = readyCash;
        this.level      = 1;
    }

    getNetWorth(): number {
        // TODO: Contratar un economista
        return this.readyCash;
    }
    
}