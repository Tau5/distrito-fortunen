class Point {
    x: number
    y: number

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
}