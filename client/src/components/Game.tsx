import * as React from 'react';
import {io, Socket} from "socket.io-client";
import { NetSquare } from "common/Square";
import { NetBoard } from "common/Board";
import Board from './game/Board';
import { Point } from 'common/Point';

interface GameProps {
    socket: Socket
    roomId: string
    name: string
}
 
interface GameState {
    loading: boolean;
    board: NetBoard | null;
}

class Game extends React.Component<GameProps, GameState> {
    
    constructor(props: GameProps) {
        super(props);
        this.state = { loading: true, board: null }
    }
    render() { 
        if (this.state.loading) {
            return ( <p>Loading... Please wait</p> );
        } else if (this.state.board) {
            return ( <Board board={this.state.board} margin={4} squareSize={new Point(16, 16)} /> );
        }
    }

    componentDidMount() {
        this.props.socket.on("game start", (board: NetBoard) => {
            console.log("Game start!!!")
            this.setState({ loading: false, board: board });
        })
        this.props.socket.emit("room player ready", this.props.roomId, this.props.name);
        console.log("I told Mr. Server that i'm ready!");
    }
    
}
 
export default Game;