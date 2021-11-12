import { Socket, Server } from "socket.io";
import { Board } from "common/Board";
import { Player } from "./Player"
import { Point, NetPoint } from "common/Point";
import { GameSituation } from "common/GameSituation";
import { Turn } from "common/Turn";

export class Game {

    roomId: string;
    players: Player[];
    board: Board;
    io: Server;
    currentTurnNumber: number = 0;

    constructor(rooomId: string, board: Board, io: Server) {
        this.roomId = rooomId;
        this.players = [];
        this.board = board;
        this.io = io;
    }

    shuffleTurns() {
        let order = [0,1,2,3];
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

    // Updates player location for given player and informs clients
    updatePlayerLocation(player: Player, location: Point) {
        player.lastMove = player.location;
        player.location = location;
        console.log(`Distributing to all players in room the movement of ${player.name} to (${location.x}, ${location.y})`)
        this.io.in(this.roomId).emit("room update player location", player.name, location.netify());
    }

    // Returns player specified if it exists and is in this room
    checkAndGetPlayer(roomId: string, name: string): Player | undefined {
        if (roomId == this.roomId) {
            // NOTE: Might return a copy, this could be a trigger for errors because it won't update
            //       the player
            return this.players.find(p => p.name == name);
        }
    }

    nextTurn() {
        this.currentTurnNumber = this.currentTurnNumber % 4 + 1;
        let player = this.players.find(p => p.turnNumber == this.currentTurnNumber);
        if (!player) return console.error("Player not found on a therically guaranteed scenario.")
        let turn: Turn = {playerName: player.name, barrierSquare: player.lastMove, diceRoll: Math.round( Math.random() * 5 ) + 1 };
        this.io.in(this.roomId).emit("new turn", turn);
    }

    prepareEvents() {
        this.players.forEach(player => {
            player.socket.on("room request move player", (roomId: string, name: string, newPos: NetPoint) => {
                console.log(`Received room request move player, to move ${name} to (${newPos.x}, ${newPos.y})`)
                var player = this.checkAndGetPlayer(roomId, name);
                if (player) {
                    console.log("Player found")
                    if ( this.board.canPlayerMove(player.location, Point.fromNet(newPos)) ) {
                        console.log("Confirmed movement as legal")
                        this.updatePlayerLocation(player, Point.fromNet(newPos));
                    }
                }
            });
        });
    }

    awaitStart() {
        let playersReady: string[] = []
        this.players.forEach(player => {
            player.socket.on("room player ready", () => {
                playersReady.push(player.name);
                if (playersReady.length >= 4) {
                    this.shuffleTurns();
                    this.io.in(this.roomId).emit("game start", this.getGameSituation())
                }
            })

        });
        this.prepareEvents();
        this.io.in(this.roomId).emit("game loaded") 
    }

    join(socket: Socket, name: string) {
        this.players.push(new Player(name, socket, this.board.initialPoint, -1, this.board.initialCash));
    }

    getGameSituation(): GameSituation {
        return {
            players: this.players.map(p => p.netify()),
            board: this.board.netify()
        };
    }
}
