import express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import * as crypto from "crypto";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Game } from "./game/Game";
import { SquareTest } from "./game/squares/SquareTest";
import { Board } from "common/Board";
import { Point } from "common/Point";

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

io.on("connection", (socket: socketIo.Socket) => {
    console.log("[WebSocket] A user has connected");

    socket.onAny((evName: string) => {
        console.log(`[Socket] Recieved event ${evName}`);
    })
    
    socket.on("register name", (name: string) => {
        socket.data.name = name;
    })
    socket.on("create room", (reply: Function) => {
        var roomId = crypto.randomBytes(2).toString('hex');
        while (rooms.includes(roomId)) {
            roomId = crypto.randomBytes(2).toString('hex');
        }
        rooms.push(roomId);
        var board: Board = new Board(new Point(5, 3), 5000, 1000, new Point(2,1));
        board.setSquareList([
            new SquareTest(new Point(1, 1), "Square1", [new Point(2,1)]),
            new SquareTest(new Point(2, 1), "Square2", [new Point(1,1), new Point(3,1)]),
            new SquareTest(new Point(3, 1), "Square3", [new Point(2,1)])
        ]);
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

