import { NetBoard } from 'common/Board';
import * as React from 'react';

interface BoardProps {
    board: NetBoard,

}

/*
interface BoardState {
    
}
*/

class Board extends React.Component<BoardProps/*, BoardState*/> {
    /*state = { :  }*/
    canvasRef: React.RefObject<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D | null = null;

    constructor(props: BoardProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>()
    }
    componentDidMount() {
        const canvas = this.canvasRef.current;
        if (canvas) {
            this.ctx = canvas.getContext("2d");
            this.renderCanvas();
        }
    }
    
    renderCanvas() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, 800, 400);
            this.ctx.font = '50px sans-serif';
            this.ctx.strokeText("Test test test test test. Nothing to see here", 40, 40);
            
        }
    }

    render() { 
        return ( 
            <canvas ref={this.canvasRef} width="800" height="400" />
         );
    }
}
 
export default Board;