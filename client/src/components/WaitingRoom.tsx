import * as React from 'react';
import { Component } from 'react';
import {io, Socket} from "socket.io-client";

interface WaitingRoomProps {
    socket: Socket
    roomId: string
}
 
interface WaitingRoomState {
    playerNames: string[],
    errors: string
    loading: boolean
}
 
class WaitingRoom extends React.Component<WaitingRoomProps, WaitingRoomState> {
    constructor(props: WaitingRoomProps) {
        super(props);
        this.state = { playerNames: [], errors: "", loading: false }
        this.startButtonPressed = this.startButtonPressed.bind(this);
    }

    componentDidMount() {
        this.props.socket.emit("get room players", this.props.roomId, ((playerNames: string[]) => {
            this.setState({ playerNames: playerNames });
        }))
        this.props.socket.on("player joined", (playerName: string) => {
            this.setState((state, props) => { return { 
                playerNames: [...state.playerNames, playerName]
            }});
        })
        this.props.socket.on("game loading", () => {
            this.setState({ loading: true });
        })
    }
    
    startButtonPressed() {
        this.props.socket.emit("request start game", this.props.roomId, (response: string) => {
            if (response != "ok") {
                this.setState({ errors: response });
            }
        })
    }

    render() { 
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
                    this.state.playerNames.length == 4 && !this.state.loading

                    ? <button onClick={this.startButtonPressed}>Start</button>
                    : null
                }
                {
                    this.state.loading

                    ? <p>Loading... Please wait.</p>
                    : null
                }
            </div> 
        );
    }
}
 
export default WaitingRoom;