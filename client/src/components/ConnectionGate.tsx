import { ChangeEvent, Component, InputHTMLAttributes } from "react";
import {io, Socket} from "socket.io-client";

interface ConnectionGateProps {
    endpoint: string;
}

interface ConnectionGateState {
    socket: Socket | undefined;
    connected: boolean,
    name: string
}

class ConnectionGate extends Component<ConnectionGateProps, ConnectionGateState> {
    constructor(props: ConnectionGateProps) {
        super(props)
        this.state = {
            socket: undefined,
            connected: false,
            name: ""
        };
        this.connect = this.connect.bind(this);
    }

    componentDidMount() {
    }

    connect() {
        if (this.state.name.length < 2) return;
        this.setState((state, props) => {
            socket: io(props.endpoint)
        });
        this.state.socket?.on("connection", () => {
            this.state.socket?.emit("register name", this.state.name);
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
                    <input type="text" size={10} placeholder="Name" value={this.state.name} />
                    <button onClick={this.connect}>Connect</button>
                </div>
            )
        }
    }
}