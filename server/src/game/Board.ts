import { NetBoard } from "common/NetBoard";
import { NetSquare } from "common/NetSquare";
import { Point } from "common/Point";
import { District } from "./District";
import { Square } from "./Square";

export class Board {

    /**
     * List of squares in no particular order
     */
    private districts: District[];

    /**
     * Dimensions of the board
     */
    private size: Point;

    goal: number;
    initialCash: number
    initialPoint: Point;
    salaryBase: number;

    constructor(size: Point, goal: number, initialCash: number, salaryBase: number, initialPoint: Point) {
        this.size = size;
        this.districts = [];
        this.goal = goal;
        this.initialCash = initialCash;
        this.salaryBase = salaryBase;
        this.initialPoint = initialPoint;
    }

    static clone(board: Board): Board {
        var newBoard = new Board(board.size, board.goal, board.initialCash, board.salaryBase, board.initialPoint);
        board.districts.forEach(district => {
            newBoard.addDistrict(district);
        });
        return newBoard;
    }

    getSquare(location: Point): Square | null {
        let match = null;
        for(let i = 0; i < this.districts.length; i++) {
            match = this.districts[i].getSquare(location);
            if (match != null) break;
        }
        return match;
    }

    getSquareNeighbours(location: Point): Point[] | null {
        // https://stackoverflow.com/a/58401023
        return this.getSquare(location)?.neighbours ?? null;
    }

    /* *//*
    getSquareList(): Square[] {
        return this.squares;
    }
    */

    getNetSquareList(): NetSquare[] {
        let out: NetSquare[] = [];
        this.districts.forEach(district => {
            out = out.concat(district.getNetSquareList());
        });
        return out;
    }

    addDistrict(district: District) {
        this.districts.push(district);
    }

    netify(): NetBoard {
        return {
            squares: this.getNetSquareList(),
            goal: this.goal,
            initialCash: this.initialCash,
            initialPoint: this.initialPoint.netify(),
            size: this.size.netify()
        };
    }

    canPlayerMove(originalLocation: Point, newLocation: Point): boolean {
        var originSquare = this.getSquare(originalLocation)
        if ( originSquare ) {
            console.log("[Board/canPlayerMove] Found origin square")
            var targetSquare = this.getSquare(newLocation);
            if (targetSquare) {
                console.log("[Board/canPlayerMove] Found target square")
                return originSquare.neighbours.some(p => p.equal(newLocation));
            }
        }
        return false;
    }

    onSquareUpdate(callback: (index: number, square: Square) => void) {
        this.districts.forEach(district => {
            district.onSquareUpdate(callback);
        })
    }

    
}