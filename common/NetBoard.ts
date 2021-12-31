import { NetPoint, Point } from "./Point";
import { NetSquare } from "./NetSquare";

export interface NetBoard {
    squares: NetSquare[];
    size: NetPoint;
    initialCash: number;
    initialPoint: NetPoint;
    goal: number;
}

