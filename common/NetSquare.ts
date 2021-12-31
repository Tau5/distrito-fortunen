import { NetPoint, Point } from './Point';
import { SquareDescription } from './SquareDescription';

export interface NetSquare {
    description: SquareDescription
    location: NetPoint;
    neighbours: NetPoint[];
}



