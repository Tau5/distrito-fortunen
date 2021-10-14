import { NetBoard } from 'common/Board';
import { Point } from 'common/Point';
import * as React from 'react';

interface BoardProps {
    board: NetBoard,
    margin: number,
    squareSize: Point,
}


interface BoardState {
    width: number,
    height: number
}


class Board extends React.Component<BoardProps, BoardState> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D | null = null;
    
    constructor(props: BoardProps) {
        super(props);
        this.state = { width: 800, height: 400 };
        this.canvasRef = React.createRef<HTMLCanvasElement>()
    }
    componentDidMount() {
        const canvas = this.canvasRef.current;
        if (canvas) {
            this.ctx = canvas.getContext("2d");
            this.calculateCanvasSize();
            this.renderCanvas();
        }
    }
    
    calculateCanvasSize() {
        this.setState((state, props) => { 
            let boardSize: Point = Point.fromNet(props.board.size);
            return { 
                width: (boardSize.x+1)*props.margin + boardSize.x*props.squareSize.x,
                height: (boardSize.y+1)*props.margin + boardSize.y*props.squareSize.y,
         }})
        
    }

    renderCanvas() {
        if (this.ctx) {
            //this.ctx.clearRect(0, 0, this.state.width, this.state.height);
            this.props.board.squares.forEach((sq) => {
                if (this.ctx) {
                    //this.ctx.fillStyle = 'blue';
                    this.ctx.fillRect(
                        (this.props.margin*(sq.location.x+1)) + (this.props.squareSize.x*sq.location.x),
                        (this.props.margin*(sq.location.y+1)) + (this.props.squareSize.y*sq.location.y),
                        this.props.squareSize.x,
                        this.props.squareSize.y
                    )
                    console.log((this.props.margin*(sq.location.x+1)) + (this.props.squareSize.x*sq.location.x))
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