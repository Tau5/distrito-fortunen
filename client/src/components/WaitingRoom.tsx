import * as React from 'react';
import {Socket} from "socket.io-client";
import Game from './Game';

interface WaitingRoomProps {
    socket: Socket
    roomId: string
    name: string
}
 
interface WaitingRoomState {
    playerNames: string[],
    errors: string,
    renderGame: boolean,
    waitingForServer: boolean
}
 
class WaitingRoom extends React.Component<WaitingRoomProps, WaitingRoomState> {
    constructor(props: WaitingRoomProps) {
        super(props);
        this.state = { playerNames: [], errors: "", renderGame: false, waitingForServer: false }
        this.startButtonPressed = this.startButtonPressed.bind(this);
    }

    componentDidMount() {
        this.props.socket.emit("get room players", this.props.roomId, ((playerNames: string[]) => {
            this.setState({ playerNames: playerNames });
            if (this.props.roomId == "DebugRoom" && playerNames.length == 4) {
                this.startButtonPressed();
            }
        }))
        this.props.socket.on("player joined", (playerName: string) => {
            this.setState((state, props) => { return { 
                playerNames: [...state.playerNames, playerName]
            }});
        })
        this.props.socket.on("game loaded", () => {
            console.log("Server announces that the game is loaded.")
            this.setState({ renderGame: true, waitingForServer: false });
        })
    }
    
    startButtonPressed() {
        this.props.socket.emit("request start game", this.props.roomId, (response: string) => {
            if (response != "ok") {
                this.setState({ errors: response });
            } else {
                this.setState({ waitingForServer: true });
            }
        })
    }

    render() { 
        if (!this.state.waitingForServer && !this.state.renderGame) {
            return ( 
                <div>
                    <p className="error" >{this.state.errors}</p>
                    <h4>Room ID: {this.props.roomId}</h4>
                    {
                        this.state.playerNames.map(name => {
                            return (<p>{name}<br></br></p>);
                        })
                    }
                    {
                        this.state.playerNames.length == 4

                        ? <button onClick={this.startButtonPressed}>Start</button>
                        : null
                    }
                </div> 
            );
        } else if (this.state.waitingForServer) {
            return (<p>Waiting for server to prepare the game</p>)
        } else if (this.state.renderGame ) {
            return ( <Game name={this.props.name} roomId={this.props.roomId} socket={this.props.socket} /> )
        }
}
}
 
export default WaitingRoom;