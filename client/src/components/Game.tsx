import * as React from 'react';
import {io, Socket} from "socket.io-client";
import { NetSquare } from "common/Square";
import { NetBoard } from "common/Board";
import Board from './game/Board';
import { NetPoint, Point } from 'common/Point';
import { GameSituation } from "common/GameSituation"
import { produce } from "immer";
import { NetPlayer } from 'common/NetPlayer';
import { Turn } from "common/Turn";
import Log from './game/Log';

interface GameProps {
    socket: Socket
    roomId: string
    name: string
}
 
interface GameState {
    loading: boolean;
    playerIndex: number;
    gameSituation: GameSituation | null;
    isTurn: boolean;
    turn: Turn | null;
    log: string[];
}

class Game extends React.Component<GameProps, GameState> {
    
    constructor(props: GameProps) {
        super(props);
        this.state = { loading: true, gameSituation: null, isTurn: false, playerIndex: -1, turn: null, log: [] }
    }

    getThisPlayer(): NetPlayer | undefined {
        if (this.state.gameSituation)
        return this.state.gameSituation.players[this.state.playerIndex];
    }
    move(direction: Point) {
        if (!this.state.isTurn) return;
        let thisPlayer = this.getThisPlayer();
        if (thisPlayer?.location) {
            let newPos: Point = Point.fromNet(thisPlayer.location).add(direction);
            this.props.socket.emit("room request move player", this.props.roomId, this.props.name, newPos.netify());
        }
    }

    render() { 
        if (this.state.loading) {
            return ( <div> <p>Loading... Please wait</p> <Log messages={this.state.log} /> </div> );
        } else if (this.state.gameSituation) {
            return ( 
                <div>
                    <div className="game-left-panel">
                        <Board gameSituation={this.state.gameSituation} margin={4} squareSize={new Point(64, 64)} /> 
                        <button onClick={ () => this.move(new Point(-1, 0)) }>(-1,  0)</button>
                        <button onClick={ () => this.move(new Point(1, 0)) }> ( 1,  0)</button>
                        <button onClick={ () => this.move(new Point(0, 1)) }> ( 0,  1)</button>
                        <button onClick={ () => this.move(new Point(0, -1)) }>( 0, -1)</button>
                    </div>
                    <div className="game-right-panel">
                        <Log messages={this.state.log} />
                    </div>


                </div>
            );
        }
    }

    prepareEvents() {
        this.props.socket.on("room update player location", (playerName: string, location: NetPoint) => {
            console.log("room update player location received")
            this.setState(
                produce((draft: GameState) => {
                    var player = draft.gameSituation?.players.find(p => p.name == playerName)
                    if (player) {
                        /* // Player does not need to keep track
                        if (player.name == this.props.name) {
                            player.lastMove = player.location;
                        }*/
                        player.location = location;
                    } else {
                        console.log("Player not found")
                    }
                })
            )
        })

        this.props.socket.on("new turn", (turn: Turn) => {
            if (turn.playerName == this.props.name) {
                this.setState(prevState => {
                    return { isTurn: true, turn: turn, log: prevState.log.concat("It's your turn!") };
                });
            } else {
                this.setState(prevState => {
                    return { turn: turn, log: prevState.log.concat(`It's ${turn.playerName}'s turn!'`) };
                });
            }
        })
    }

    componentDidMount() {
        this.props.socket.on("game start", (gameSituation: GameSituation) => {
            console.log("Game start!!!")
            this.setState({ loading: false, gameSituation: gameSituation });
            this.setState({ playerIndex: gameSituation.players.findIndex(np => np.name == this.props.name) })
        })
        this.props.socket.on("player turn", (diceRoll: number) => {

        })
        this.prepareEvents();
        this.props.socket.emit("room player ready", this.props.roomId, this.props.name);
        console.log("I told Mr. Server that i'm ready!");
    }
    
}
 
export default Game;