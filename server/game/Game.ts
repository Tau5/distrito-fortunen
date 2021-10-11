import { RemoteSocket, Server } from "socket.io";
import { Player } from "./Player"
export class Game {

    roomId: string;
    players: Player[];
    board: Board;
    goal: number;
    io: Server;

    constructor(rooomId: string, io: Server, board: Board, goal: number) {
        this.roomId = rooomId;
        this.io = io;
        this.players = [];
        this.board = board;
        this.goal = goal;
    }

    generatePlayers(initialLocation: Point, initialCash: number, names: string[]) {
        let order = [1,2,3,4];
        for (let i = order.length-1; i > 0; i--) {
            let target = Math.floor(Math.random()*(i+1))
            let value = order[target]
            order[target] = order[i]
            order[i] = value;
        }

        names.forEach(((name, i) => {
            this.players.push(new Player(name, initialLocation, order[i], initialCash));
        }));   
    }

    start() {
        this.io.in(this.roomId).emit("game start", this.board.getNetSquareList())
    }
}