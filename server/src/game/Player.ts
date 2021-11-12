import { Socket } from "socket.io";
import { Point } from "common/Point";
import { NetPlayer } from "common/NetPlayer";
export class Player {

    location  : Point;
    level     : number;
    readyCash : number;
    turnNumber: number;
    name      : string;
    socket    : Socket;
    /** The last point the player was before entering their current location */
    lastMove  : Point = new Point(-1, -1) 

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

    netify(): NetPlayer {
        return {
            location: this.location.netify(),
            level: this.level,
            readyCash: this.readyCash,
            netWorth: this.getNetWorth(),
            turnNumber: this.turnNumber,
            name: this.name,
            lastMove: this.lastMove.netify()
        }
    }
    
}