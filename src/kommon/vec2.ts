export class Vec2 {
    constructor(
        public readonly x: number,
        public readonly y: number,
    ) { }

    static readonly zero = new Vec2(0, 0);
    static readonly one = new Vec2(1, 1);
    static readonly half = new Vec2(0.5, 0.5);
    static readonly xpos = new Vec2(1, 0);
    static readonly ypos = new Vec2(0, 1);
    static readonly xneg = new Vec2(-1, 0);
    static readonly yneg = new Vec2(0, -1);

    toArray(): [number, number] {
        return [this.x, this.y];
    }

    toString(): string {
        return `Vec2(${this.x},${this.y})`;
    }

    static both(value: number): Vec2 {
        return new Vec2(value, value);
    }

    static lerp(a: Vec2, b: Vec2, t: number): Vec2 {
        return a.scale(1 - t).add(b.scale(t));
    }

    add(other: Vec2): Vec2 {
        return new Vec2(
            this.x + other.x,
            this.y + other.y,
        );
    }

    addX(x: number): Vec2 {
        return new Vec2(
            this.x + x,
            this.y,
        );
    }

    addY(y: number): Vec2 {
        return new Vec2(
            this.x,
            this.y + y,
        );
    }

    addXY(x: number, y: number): Vec2 {
        return new Vec2(
            this.x + x,
            this.y + y,
        );
    }

    sub(other: Vec2): Vec2 {
        return new Vec2(
            this.x - other.x,
            this.y - other.y,
        );
    }

    mul(other: Vec2): Vec2 {
        return new Vec2(
            this.x * other.x,
            this.y * other.y,
        );
    }

    scale(s: number): Vec2 {
        return new Vec2(
            this.x * s,
            this.y * s,
        );
    }

    perp(): Vec2 {
        return new Vec2(-this.y, this.x);
    }

    rotate(radians: number): Vec2 {
        let c = Math.cos(radians);
        let s = Math.sin(radians);
        return new Vec2(
            this.x * c - this.y * s,
            this.x * s + this.y * c
        );
    }

    rotateTurns(turns: number): Vec2 {
        return this.rotate(turns * 2 * Math.PI);
    }

    equal(other: Vec2): boolean {
        return this.x === other.x && this.y === other.y;
    }

    equalAprox(other: Vec2, eps: number = 1e-10): boolean {
        return Math.abs(this.x - other.x) < eps && Math.abs(this.y - other.y) < eps;
    }

    magSq(): number {
        return this.x * this.x + this.y * this.y;
    }

    mag(): number {
        return Math.sqrt(this.magSq());
    }

    static fromRadians(radians: number): Vec2 {
        return new Vec2(Math.cos(radians), Math.sin(radians));
    }

    static fromTurns(turns: number): Vec2 {
        return Vec2.fromRadians(turns * Math.PI * 2);
    }

    cross(other: Vec2): number {
        return this.x * other.y - this.y * other.x;
    }

    dot(other: Vec2): number {
        return this.x * other.x + this.y * other.y;
    }

    radians(): number {
        return Math.atan2(this.y, this.x);
    }

    turns(): number {
        return this.radians() / (Math.PI * 2);
    }
}
