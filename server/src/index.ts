import express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import * as crypto from "crypto";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Game } from "./game/Game";
import { SquareTest } from "./game/squares/SquareTest";
import { Board } from "./game/Board";
import { Point } from "common/Point";
import { SquareShop } from "./game/squares/SquareShop";
import { District } from "./game/District";
import { SquareBank } from "./game/squares/SquareBank";

const PORT: Number = typeof process.env.PORT == "string" ? parseInt(process.env.PORT) : 3001;

const app = express();
const server = http.createServer(app);

const io = new socketIo.Server(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

server.listen(PORT, () => {
  console.log(`[Server] Listening on port ${PORT}`);
});

app.get("/api", (req: express.Request, res: express.Response) => {
    res.json({
        
    })
});

app.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile(__dirname + "/client/index.html");
})


var rooms: string[] = [];
var games: Map<string, Game> = new Map<string, Game>();
var debugBoard: Board = new Board(new Point(7, 3), 5000, 400, 1000, new Point(3, 1));

function writeDebugSquareList(board: Board) {
    /*
                --->
     ^  A  A  A  A  B  B  B  ^
     |  D     ^  Ab v     B  |
     v  D  D  D  C  C  C  C  v
                <---
    */
    let districtA = new District("District A", [
            new SquareShop(new Point(0, 0), "A0 Shop", 100, 10, 1, [new Point(1, 0), new Point(0, 1)]),
            new SquareShop(new Point(1, 0), "A1 Shop", 150, 12, 1, [new Point(2, 0), new Point(0, 0)]),
            new SquareShop(new Point(2, 0), "A2 Shop", 200, 18, 1, [new Point(3, 0), new Point(1, 0)]),
            new SquareShop(new Point(3, 0), "A3 Shop", 250, 20, 1, [new Point(4, 0), new Point(2, 0), new Point(3, 1)]),
            new SquareBank(new Point(3, 1), [new Point(3, 0), new Point(3, 2)])
        ]
    )
    let districtB = new District("District B", [
            new SquareShop(new Point(4, 0), "B0 Shop", 300, 25, 1, [new Point(5, 0), new Point(3, 0)]),
            new SquareShop(new Point(5, 0), "B1 Shop", 350, 28, 1, [new Point(6, 0), new Point(4, 0)]),
            new SquareShop(new Point(6, 0), "B2 Shop", 320, 26, 1, [new Point(6, 1), new Point(5, 0)]),
            new SquareShop(new Point(6, 1), "B3 Shop", 150, 12, 1, [new Point(6, 2), new Point(6, 0)])
        ]
    )
    let districtC = new District("District C", [
            new SquareShop(new Point(6, 2), "C0 Shop", 100, 10, 1, [new Point(5, 2), new Point(6, 1)]),
            new SquareShop(new Point(5, 2), "C1 Shop", 180, 15, 1, [new Point(4, 2), new Point(6, 2)]),
            new SquareShop(new Point(4, 2), "C2 Shop", 150, 12, 1, [new Point(3, 2), new Point(5, 2)]),
            new SquareShop(new Point(3, 2), "C3 Shop", 200, 18, 1, [new Point(2, 2), new Point(4, 2)])
        ]
    )
    let districtD = new District("District D", [
            new SquareShop(new Point(2, 2), "D0 Shop", 400, 32, 1, [new Point(1, 2), new Point(3, 2)]),
            new SquareShop(new Point(1, 2), "D1 Shop", 320, 28, 1, [new Point(0, 2), new Point(2, 2)]),
            new SquareShop(new Point(0, 2), "D2 Shop", 350, 30, 1, [new Point(0, 1), new Point(1, 2)]),
            new SquareShop(new Point(0, 1), "D3 Shop", 250, 21, 1, [new Point(0, 0), new Point(0, 2)])
        ]
    )
    board.addDistrict(districtA);
    board.addDistrict(districtB);
    board.addDistrict(districtC);
    board.addDistrict(districtD);
}


io.on("connection", (socket: socketIo.Socket) => {
    console.log("[WebSocket] A user has connected");

    socket.onAny((evName: string) => {
        console.log(`[Socket] Recieved event ${evName}`);
    })
    
    socket.on("register name", (name: string, debug: boolean) => {
        socket.data.name = name;
        if (!debug) return;
            let board = Board.clone(debugBoard)
            writeDebugSquareList(board);

            if (rooms.includes("DebugRoom") && games.get("DebugRoom")?.players.length as number >= 4) {
                games.delete("DebugRoom")
                                            // Warning: May not work and overwrite debugBoard
                                            //                     v
                games.set("DebugRoom", new Game("DebugRoom", board, io));
            }
            if (!rooms.includes("DebugRoom")) {
                rooms.push("DebugRoom")
                games.set("DebugRoom", new Game("DebugRoom", board, io));
            }
            socket.join("DebugRoom");
            games.get("DebugRoom")?.join(socket, socket.data.name);
            socket.broadcast.to("DebugRoom").emit("player joined", socket.data.name);
            console.log(`[Room/DebugRoom] Player ${socket.data.name} joined`);
    })
    socket.on("create room", (reply: Function) => {
        var roomId = crypto.randomBytes(2).toString('hex');
        while (rooms.includes(roomId)) {
            roomId = crypto.randomBytes(2).toString('hex');
        }
        rooms.push(roomId);
        var board: Board = new Board(new Point(5, 3), 5000, 400, 1000, new Point(2,1));
        writeDebugSquareList(board);
        games.set(roomId, new Game(roomId, board, io));
        reply(roomId);
    })
    socket.on("join room", (roomId: string, reply: Function) => {
        if (rooms.includes(roomId) && games.has(roomId)) {
            socket.join(roomId);
            games.get(roomId)?.join(socket, socket.data.name);
            reply("success");
            socket.broadcast.to(roomId).emit("player joined", socket.data.name);
            console.log(`[Room/${roomId}] Player ${socket.data.name} joined`);
        } else {
            reply("The room doesn't exist")
        }
    })
    socket.on("get room players", (roomId: string, reply: Function) => {
        var names: string[] = [];
        io.in(roomId).fetchSockets().then(sockets => {
            sockets.forEach(socket => {
                names.push(socket.data.name);
            })
            reply(names);
            console.log(`[Room/${roomId}] Requested list of players: ${names}`);
        })
    })

    socket.on("request start game", (roomId: string, reply: Function) => {
        io.in(roomId).fetchSockets().then(sockets => {
            if (sockets.length != 4) {
                reply("Error: Players in room are less or more than 4")
            } else {
                reply("ok");
                games.get(roomId)?.awaitStart();
            }
        })
    })
})

