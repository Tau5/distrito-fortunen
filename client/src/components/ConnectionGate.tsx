import { ChangeEvent, Component, InputHTMLAttributes } from "react";
import {io, Socket} from "socket.io-client";
import RoomGate from "./RoomGate";
interface ConnectionGateProps {
    endpoint: string;
}

interface ConnectionGateState {
    socket: Socket | undefined;
    connected: boolean,
    name: string,
    errors: string
}

export class ConnectionGate extends Component<ConnectionGateProps, ConnectionGateState> {
    constructor(props: ConnectionGateProps) {
        super(props)
        this.state = {
            socket: undefined,
            connected: false,
            name: "",
            errors: ""
        };
        this.connect = this.connect.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    componentDidMount() {
    }

    connect() {
        if (this.state.name.length < 2) return;
        const socket = io(this.props.endpoint);
        this.setState({socket: socket});
        console.log("Attempting connection");
        socket.on("connect", () => {
            console.log("Connected to server");
            socket.emit("register name", this.state.name);
            this.setState({connected: true});
        })
    }

    handleNameChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            name: event.target.value,
        })
    }

    render() {
        if (!this.state.connected) {
            return (
                <div>
                    <p className="error" >{this.state.errors}</p>
                    <input type="text" size={10} placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
                    <button onClick={this.connect}>Connect</button>
                </div>
            )
        } else {
            return (
            <div>
                <RoomGate socket={this.state.socket as Socket}></RoomGate>
            </div>
            )
        }
    }
}