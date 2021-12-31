import * as React from 'react';
import {io, Socket} from "socket.io-client";
import { NetSquare } from "common/NetSquare";
import { NetBoard } from "common/NetBoard";
import Board from './game/Board';
import { NetPoint, Point } from 'common/Point';
import { GameSituation } from "common/GameSituation"
import { produce } from "immer";
import { NetPlayer } from 'common/NetPlayer';
import { Turn } from "common/Turn";
import Log from './game/Log';
import SquareInfo from './game/SquareInfo';
import { SquareDescription } from 'common/SquareDescription';
import { ActionList } from 'common/ActionList';
import ActionListRenderer from './game/ActionListRenderer';
import PlayersInfo from './game/PlayersInfo';
import { NetPopup } from "common/NetPopup";
import Popup from "./game/Popup";

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
    actionPopup: boolean;
    movementDisabled: boolean;
    actionList: ActionList | null;
    popup: NetPopup | null;
}

class Game extends React.Component<GameProps, GameState> {

    constructor(props: GameProps) {
        super(props);
        this.state = { 
            loading: true, 
            gameSituation: null, 
            isTurn: false, 
            playerIndex: -1, 
            turn: null, 
            log: [], 
            actionPopup: false,
            movementDisabled: false,
            actionList: null,
            popup: null
        }
        this.actionListReplyHandler = this.actionListReplyHandler.bind(this);
    }

    getThisPlayer(): NetPlayer | undefined {
        if (this.state.gameSituation)
            return this.state.gameSituation.players[this.state.playerIndex];
    }

    getCurrentPlayer(): NetPlayer | undefined {
        if (this.state.gameSituation && this.state.turn)
            return this.state.gameSituation.players.find(p => p.name == this.state.turn?.playerName)
    }
    
    move(direction: Point) {
        if (!this.state.isTurn) return;
        let thisPlayer = this.getThisPlayer();
        if (thisPlayer?.location) {
            let newPos: Point = Point.fromNet(thisPlayer.location).add(direction);
            this.props.socket.emit("room request move player", this.props.roomId, this.props.name, newPos.netify());
        }
    }

    getSquare(location: Point): NetSquare | null {
        return this.state.gameSituation?.board.squares.find(square => Point.fromNet(square.location).equal(location) ) ?? null;
    }

    getCurrentSquare(): NetSquare | null {
        if (this.state.gameSituation) {
            if (this.getCurrentPlayer()) {
                return this.getSquare(Point.fromNet((this.getCurrentPlayer() as NetPlayer).location))
            }
        } 
        return null;
    }

    actionListReplyHandler(name: string, number: number | null) {
        this.props.socket.emit(name, number);
        this.setState({ actionPopup: false, movementDisabled: false });
    }

    render() { 
        if (this.state.loading) {
            return ( <div> <p>Loading... Please wait</p> <Log messages={this.state.log} /> </div> );
        } else if (this.state.gameSituation) {
            return ( 
                <div className="game">
                    <div className="game-left-panel">
                        <h3 className="game-moves-left">{this.state.turn? this.state.turn.movesLeft.toString() : ""}</h3>
                        <div className="game-movement-buttons">
                            <button disabled={this.state.movementDisabled} className="game-button-flex1" onClick={ () => this.move(new Point(-1, 0)) }>⬅</button>
                            <button disabled={this.state.movementDisabled} className="game-button-flex1" onClick={ () => this.move(new Point(1, 0)) }>➡</button>
                            <button disabled={this.state.movementDisabled} className="game-button-flex1" onClick={ () => this.move(new Point(0, 1)) }>⬇️</button>
                            <button disabled={this.state.movementDisabled} className="game-button-flex1" onClick={ () => this.move(new Point(0, -1)) }>⬆️</button>
                        </div>
                        {this.state.actionPopup && this.state.actionList ? 
                            <div>
                                <ActionListRenderer reply={this.actionListReplyHandler} list={this.state.actionList} />
                            </div>
                        : null}

                    </div>
                    <div className="game-center-panel">
                        <Board gameSituation={this.state.gameSituation} margin={4} squareSize={new Point(64, 64)} /> 
                        {this.state.popup?
                            <Popup popup={this.state.popup}/>
                        : null}
                    </div>
                    <div className='game-right-panel'>
                        <Log messages={this.state.log} />
                        <SquareInfo squareDescription={this.getCurrentSquare()?.description ?? null}/>
                        <PlayersInfo gameSituation={this.state.gameSituation}/>
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

        this.props.socket.on("update turn", (turn: Turn) => {
            this.setState(prevState => {
                return { turn: turn }
            })
        })

        this.props.socket.on("display action list", (actionList: ActionList) => {
            setTimeout(() => {
                this.setState(prevState => {
                    return { actionList: actionList, actionPopup: true, movementDisabled: true };
                })
            }, 500)

        })

        this.props.socket.on("update player", (player: NetPlayer) => {
            console.log(`Server sent an update for ${player.name}`);
            this.setState(
                produce((draft: GameState) => {
                    if (!draft.gameSituation) return;
                    var playerIndex = draft.gameSituation.players.findIndex(p => p.name == player.name)
                    if (playerIndex > -1) {
                        draft.gameSituation.players[playerIndex] = player;
                    } else {
                        console.log("Player not found")
                    }
                })
            );
        })

        this.props.socket.on("update square", (index: number, square: NetSquare) => {
            this.setState(
                produce((draft: GameState) => {
                    if (!draft.gameSituation) return;
                    draft.gameSituation.board.squares[index] = square;
                })
            )
        })

        this.props.socket.on("popup", (popup: NetPopup) => {
            this.setState({
                movementDisabled: true,
                popup: popup
            });

            if (popup.timeout != -1) {
                setTimeout(() => {
                    this.setState({
                        movementDisabled: false,
                        popup: null
                    });
                }, popup.timeout);
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