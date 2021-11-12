import { NetBoard } from 'common/Board';
import { GameSituation } from 'common/GameSituation';
import { Point } from 'common/Point';
import * as React from 'react';

interface BoardProps {
    gameSituation: GameSituation,
    margin: number,
    squareSize: Point,
}


interface BoardState {
    width: number,
    height: number
}

function getPlayerFillStyle(turnNumber: number) {
    switch (turnNumber) {
        case 0:
            return "#1aed59"
            break;
        case 1:
            return "#1aaded"
        
        case 2:
            return "#ed1aad"

        case 3:
            return "#ed591a"
        default:
            return "black"
            break;
    }
}
class Board extends React.Component<BoardProps, BoardState> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D | null = null;
    
    constructor(props: BoardProps) {
        super(props);
        this.state = { width: 800, height: 400 };
        this.canvasRef = React.createRef<HTMLCanvasElement>()
        this.calculateCanvasSize();
    }
    componentDidMount() {
        const canvas = this.canvasRef.current;
        if (canvas) {
            this.ctx = canvas.getContext("2d");
            this.renderCanvas();
        }
    }

    calculateCanvasSize() {
        this.setState((state, props) => { 
            let boardSize: Point = Point.fromNet(props.gameSituation.board.size);
            return { 
                width: (boardSize.x+1)*props.margin + boardSize.x*props.squareSize.x,
                height: (boardSize.y+1)*props.margin + boardSize.y*props.squareSize.y,
         }})
        
    }

    componentDidUpdate() {
        this.renderCanvas()
    }

    renderCanvas() {
        console.log("renderCanvas called")
        if (this.ctx) {
            //this.ctx.clearRect(0, 0, this.state.width, this.state.height);
            this.props.gameSituation.board.squares.forEach((sq) => {
                if (this.ctx) {
                    this.ctx.fillStyle = 'grey';
                    this.ctx.fillRect(
                        (this.props.margin*(sq.location.x+1)) + (this.props.squareSize.x*sq.location.x),
                        (this.props.margin*(sq.location.y+1)) + (this.props.squareSize.y*sq.location.y),
                        this.props.squareSize.x,
                        this.props.squareSize.y
                    )
                    console.log("I'm drawwiing");
                    /*this.ctx.fillStyle = 'green';
                    this.ctx.fillRect(20, 10, 150, 100);
                    this.ctx.restore();*/
                }
            })
            this.props.gameSituation.players.forEach(p => {
                if (this.ctx) {
                    this.ctx.fillStyle = getPlayerFillStyle(p.turnNumber);
                    let location: Point = Point.fromNet(p.location);
                    this.ctx.fillRect(
                        (this.props.margin*(location.x+1)) + (this.props.squareSize.x*location.x) + (p.turnNumber * this.props.squareSize.x/4),
                        (this.props.margin*(location.y+1)) + (this.props.squareSize.y*location.y),
                        this.props.squareSize.x*0.25,
                        this.props.squareSize.y*0.25,
                    )
                }
            })
        }
    }

    render() { 
        return ( 
            <canvas ref={this.canvasRef} width={this.state.width} height={this.state.height} />
         );
    }
}
 
export default Board;