import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import * as crypto from "crypto";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const PORT: Number = typeof process.env.PORT == "string" ? parseInt(process.env.PORT) : 3001;

const app = express();
const server = http.createServer(app);

const io = new socketIo.Server(server, {
    cors: {
        origin: "http://localhost:3000",
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


var rooms: string[] = []

io.on("connection", (socket: socketIo.Socket) => {
    console.log("[WebSocket] A user has connected");
    socket.on("register name", (name: string) => {
        socket.data.name = name;
    })
    socket.on("create room", (reply: Function) => {
        var roomId = crypto.randomBytes(2).toString('hex');
        while (rooms.includes(roomId)) {
            roomId = crypto.randomBytes(2).toString('hex');
        }
        rooms.push(roomId);
        reply(roomId);
    })
    socket.on("join room", (roomId: string, reply: Function) => {
        if (rooms.includes(roomId)) {
            socket.join(roomId);
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
                io.in(roomId).emit("game loading");
                // TODO: Load and start game
            }
        })
    })
})

