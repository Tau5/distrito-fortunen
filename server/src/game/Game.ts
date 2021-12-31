import { Socket, Server } from "socket.io";
import { Board } from "./Board";
import { Player } from "./Player"
import { Point, NetPoint } from "common/Point";
import { GameSituation } from "common/GameSituation";
import { Turn } from "common/Turn";
import { ActionListHandler } from "./ActionListHandler";
import { Square } from "./Square";
import { Popup } from "./Popup";
import { GameAPI } from "./GameAPI";

export class Game {

    roomId: string;
    players: Player[];
    board: Board;
    io: Server;
    currentTurnNumber: number = 0;
    currentTurn: Turn | null;
    api: GameAPI;

    constructor(rooomId: string, board: Board, io: Server) {
        this.roomId = rooomId;
        this.players = [];
        this.board = board;
        this.io = io;
        this.currentTurn = null;
        this.updateSquare = this.updateSquare.bind(this);
        this.updatePlayer = this.updatePlayer.bind(this);
        this.getPlayerByTurnNumber = this.getPlayerByTurnNumber.bind(this);
        this.emitter = this.emitter.bind(this);
        board.onSquareUpdate(this.updateSquare);
        this.api = {
            emitter: this.emitter,
            getPlayerByTurnNumber: this.getPlayerByTurnNumber
        }
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

    emitter(ev: string, ...args: any[]) {
        this.io.in(this.roomId).emit(ev, ...args);
    }

    updatePlayer(player: Player) {
        console.log(`Sending updated player data: `)
        console.dir(player.netify())
        this.io.in(this.roomId).emit("update player", player.netify());
    }

    updateSquare(index: number, square: Square) {
        this.io.in(this.roomId).emit("update square", index, square.netify());
    }

    // Updates player location for given player and informs clients
    updatePlayerLocation(player: Player, location: Point) {
        player.lastMove = player.location;
        player.location = location;
        console.log(`Distributing to all players in room the movement of ${player.name} to (${location.x}, ${location.y})`)
        this.io.in(this.roomId).emit("room update player location", player.name, location.netify());
    }

    getPlayerByTurnNumber(turnNumber: number): Player | undefined {
        return this.players.find(p => p.turnNumber == turnNumber);
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
        // Get index of next player
        this.currentTurnNumber = (this.currentTurnNumber + 1) % 4;
        let player = this.players.find(p => p.turnNumber == this.currentTurnNumber);
        if (!player) return console.error("Player not found on a theoretically guaranteed scenario.")
        
        this.currentTurn = new Turn(player.name, player.lastMove);

        this.io.in(this.roomId).emit("new turn", this.currentTurn.netify());
    }

    prepareEvents() {
        this.players.forEach(player => {
            player.socket.on("room request move player", (roomId: string, name: string, newPos: NetPoint) => {
                console.log(`Received room request move player, to move ${name} to (${newPos.x}, ${newPos.y})`)
                var player = this.checkAndGetPlayer(roomId, name);
                if (player && this.currentTurn) {
                    if (player.name != this.currentTurn?.playerName) return console.log("Player cannot move because it isn't their turn");
                    if (Point.fromNet(newPos).equal(this.currentTurn.barrierSquare) && 
                        this.currentTurn.movesLeft == this.currentTurn.diceRoll ) {
                            return console.log("Player cannot move because it is a barrier square");
                        } 
                    if (this.currentTurn.movesLeft < 1 && !Point.fromNet(newPos).equal(player.lastMove)) {
                        return console.log("Player cannot move because it does not have moves left")
                    }
                    console.log("Player found")
                    if ( this.board.canPlayerMove(player.location, Point.fromNet(newPos)) ) {
                        console.log("Confirmed movement as legal")
                        if ( this.currentTurn.moves.length > 0 && Point.fromNet(newPos).equal(this.currentTurn.moves.at(-1) as Point) ) {
                            this.currentTurn.movesLeft++;
                            this.currentTurn.moves.pop();
                        } else {
                            this.currentTurn.movesLeft--;
                            this.currentTurn.moves.push(Point.fromNet(player.location));
                        }
                        console.log(this.currentTurn.moves);
                        this.updatePlayerLocation(player, Point.fromNet(newPos));
                        if (this.currentTurn.movesLeft < 1) {
                            this.triggerActionListForDrop(player);
                            this.currentTurn.canMove = false;
                        }
                        this.io.in(this.roomId).emit("update turn", this.currentTurn);
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
                    this.nextTurn();
                }
            })

        });
        this.prepareEvents();
        this.io.in(this.roomId).emit("game loaded") 
    }

    join(socket: Socket, name: string) {
        this.players.push(new Player(name, socket, this.board.initialPoint, -1, this.board.initialCash, this.updatePlayer));
    }

    getGameSituation(): GameSituation {
        return {
            players: this.players.map(p => p.netify()),
            board: this.board.netify()
        };
    }

    triggerActionListForDrop(player: Player) {
        var actionList = new ActionListHandler(player);
        actionList.addAction("End Turn", () => {
            this.board.getSquare(player.location)?.onDrop(player, this.api).then(() => {
                this.nextTurn();
            });
        })
        actionList.addAction("Go Back", () => {
            if (!this.currentTurn) return;
            this.updatePlayerLocation(player, this.currentTurn.moves.pop() as Point);
            this.currentTurn.canMove = true;
            this.currentTurn.movesLeft += 1;
            this.io.in(this.roomId).emit("update turn", this.currentTurn);
        })
        actionList.emit();
    }
}

