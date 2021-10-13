import { Socket, Server } from "socket.io";
import { Board } from "common/Board";
import { Player } from "./Player"
import { Point } from "common/Point";
export class Game {

    roomId: string;
    players: Player[];
    board: Board;
    io: Server;

    constructor(rooomId: string, board: Board, io: Server) {
        this.roomId = rooomId;
        this.players = [];
        this.board = board;
        this.io = io;
    }

    shuffleTurns() {
        let order = [1,2,3,4];
        for (let i = order.length-1; i > 0; i--) {
            let target = Math.floor(Math.random()*(i+1))
            let value = order[target]
            order[target] = order[i]
            order[i] = value;
        }
        this.players.forEach( (player, i) => {
            player.turnNumber = order[i];
        });
    }

    awaitStart() {
        let playersReady: string[] = []
        this.players.forEach(player => {
            player.socket.on("room player ready", () => {
                playersReady.push(player.name);
                if (playersReady.length >= 4) {
                    this.io.in(this.roomId).emit("game start", this.board.netify())
                }
            })

        });
        this.io.in(this.roomId).emit("game loaded") 
    }

    join(socket: Socket, name: string) {
        this.players.push(new Player(name, socket, this.board.initialPoint, -1, this.board.initialCash));
    }
}
