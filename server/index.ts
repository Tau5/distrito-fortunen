import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";

const PORT: Number = typeof process.env.PORT == "string" ? parseInt(process.env.PORT) : 3001;

const app = express();
const server = http.createServer(app);

const io = new socketIo.Server(server);

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

var names: Array<string> = [];

io.on("connection", (socket: socketIo.Socket) => {
    console.log("[WebSocket] A user has connected");
    socket.on("register name", (name: string) => {
        if (names.includes(name)) {
            socket.emit("name rejected");
        } else {
            names.push(name);
            socket.data.name = name;
        }
    })
})