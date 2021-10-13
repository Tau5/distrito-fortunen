export interface NetPoint {
    x: number,
    y: number
}

export class Point {
    x: number
    y: number

    static fromNet(nP: NetPoint): Point {
        return new this(nP.x, nP.y);
    }
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(B: Point): Point {
        return new Point(this.x+B.x, this.y+B.y);
    }

    sub(B: Point): Point {
        return new Point(this.x-B.x, this.y-B.y);
    }

    equal(B: Point): boolean {
        return this.x == B.x && this.y == B.y;
    }

    netify(): NetPoint {
        return {x: this.x, y: this.y}
    }


}