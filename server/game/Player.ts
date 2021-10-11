import { Socket } from "socket.io";

class Player {

    location  : Point;
    level     : number;
    readyCash : number;
    turnNumber: number;
    name      : string;
    socket    : Socket;

    constructor(socket: Socket, location: Point, turnNumber: number, readyCash: number) {
        this.socket     = socket;
        this.location   = location;
        this.turnNumber = turnNumber;
        this.readyCash  = readyCash;
        this.level      = 1;
        this.name       = socket.data.name;
    }

    getNetWorth(): number {
        // TODO: Contratar un economista
        return this.readyCash;
    }
    
}