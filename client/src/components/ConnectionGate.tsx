import { ChangeEvent, Component, InputHTMLAttributes } from "react";
import {io, Socket} from "socket.io-client";
import RoomGate from "./RoomGate";
import WaitingRoom from "./WaitingRoom";
interface ConnectionGateProps {
    endpoint: string;
}

enum ConnectionState {
    Disconnected = 1,
    Connected,
    Debug
}
interface ConnectionGateState {
    socket: Socket | undefined;
    connectionState: ConnectionState,
    name: string,
    errors: string
}

export class ConnectionGate extends Component<ConnectionGateProps, ConnectionGateState> {
    constructor(props: ConnectionGateProps) {
        super(props)
        this.state = {
            socket: undefined,
            connectionState: ConnectionState.Disconnected,
            name: "",
            errors: ""
        };
        this.connect = this.connect.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    componentDidMount() {
    }

    connect(debug: boolean) {
        if (this.state.name.length < 2 && !debug) return;
        const socket = io(this.props.endpoint);
        this.setState({socket: socket});
        console.log("Attempting connection");
        socket.on("connect", () => {
            console.log("Connected to server");
            if (debug) {
                this.setState({
                    name: "Debug"+(Math.round(Math.random()*8)).toString(),
                })
            }
            socket.emit("register name", this.state.name, debug);
            this.setState({
                connectionState: debug ? ConnectionState.Debug : ConnectionState.Connected
            });
        })
    }

    handleNameChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            name: event.target.value,
        })
    }

    render() {
        if (this.state.connectionState == ConnectionState.Disconnected) {
            return (
                <div>
                    <p className="error" >{this.state.errors}</p>
                    <input type="text" size={10} placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
                    <button onClick={() => this.connect(false)} >Connect</button>
                    <button onClick={() => this.connect(true)} >Debug Connection</button>
                </div>
            )
        } else if (this.state.connectionState == ConnectionState.Connected) {
            return (
            <div>
                <RoomGate name={this.state.name} socket={this.state.socket as Socket}></RoomGate>
            </div>
            )
        } else {
            return (
                <div>
                    <WaitingRoom name={this.state.name} socket={this.state.socket as Socket} roomId="DebugRoom" />
                </div>
            )
        }
    }
}