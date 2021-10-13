import { Socket } from "socket.io";
import { Point } from "common/Point";

export class Player {

    location  : Point;
    level     : number;
    readyCash : number;
    turnNumber: number;
    name      : string;
    socket    : Socket;

    constructor(name: string, socket: Socket, location: Point, turnNumber: number, readyCash: number) {
        this.name     = name;
        this.socket   = socket;
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