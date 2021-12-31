import { NetSquare } from "common/NetSquare";
import { Point } from "common/Point";
import { StockRecord } from "./banking/StockRecord";
import { Square } from "./Square";
import { SquareShop } from "./squares/SquareShop";

export class District {
    name: string;
    squares: Array<Square>;
    stocks: Array<StockRecord> = [];
    
    constructor(name: string, squares: Array<Square>) {
        this.name = name;
        this.squares = squares;
    }

    getTotalShopValue() {
        let out = 0;
        this.squares.forEach(sq => {
            if (typeof sq == typeof SquareShop) out += (sq as SquareShop).value;
        })
        return out;
    }
    getShopCount() {
        let out = 0;
        this.squares.forEach(sq => {
            if (typeof sq == typeof SquareShop) out += 1;
        })
        return out;
    }

    getSquare(location: Point): Square | null {
        return this.squares.find(square => square.location.equal(location) ) ?? null;
    }

    addRecord(record: StockRecord) {
        this.stocks.push(record);
    }

    getSquareList(): Square[] {
        return this.squares;
    }

    getNetSquareList(): NetSquare[] {
        return this.squares.map(sq => sq.netify());
    }

    onSquareUpdate(callback: (index: number, square: Square) => void) {
        this.squares.forEach((square: Square, index: number) => {
            square.onUpdate((sq: Square) => callback(index, sq));
        })
    }
}