import { Vec2 } from "./vec2";
import { inRange } from "./math";
import { fromCount } from "./kommon";

function inBounds(pos: Vec2, bounds: Vec2) {
    return inRange(pos.x, 0, bounds.x) && inRange(pos.y, 0, bounds.y);
}

export class Grid2D<T> {
    // 0 1 2
    // 3 4 5
    // 6 7 8
    constructor(
        public size: Vec2,
        private data: T[]) { }

    getV<S>(pos: Vec2): T;
    getV<S>(pos: Vec2, outOfBounds: S): T | S;
    getV<S>(pos: Vec2, outOfBounds?: S): T | S {
        if (!inBounds(pos, this.size)) {
            if (arguments.length == 2) {
                return outOfBounds!;
            }
            throw new Error(`get at ${pos} was out of bounds, and no default argument was given`);
        }
        return this.data[pos.x + pos.y * this.size.x];
    }

    setV(pos: Vec2, value: T): void {
        if (!inBounds(pos, this.size)) {
            throw new Error(`can't set at ${pos}; out of bounds`);
        }
        this.data[pos.x + pos.y * this.size.x] = value;
    }

    forEachV(callback: (pos: Vec2, element: T) => void): void {
        for (let j = 0; j < this.size.y; j++) {
            for (let i = 0; i < this.size.x; i++) {
                callback(new Vec2(i, j), this.data[i + j * this.size.x]);
            }
        }
    }

    find(discriminator: (pos: Vec2, element: T) => boolean): { pos: Vec2, element: T }[] {
        let result: { pos: Vec2, element: T }[] = [];
        this.forEachV((pos, element) => {
            if (discriminator(pos, element)) {
                result.push({ pos: pos, element: element });
            }
        });
        return result;
    }

    map<S>(mapper: (pos: Vec2, element: T) => S): Grid2D<S> {
        return Grid2D.initV(this.size, pos => mapper(pos, this.getV(pos)));
    }

    rows(): T[][] {
        return fromCount(this.size.y, k => this.data.slice(k * this.size.x, (k+1) * this.size.x));
    }

    // filter(discriminator: (i: number, j: number, element: T) => boolean): T[] {
    //     let result: T[] = [];
    //     for (let i = 0; i < this.width; i++) {
    //         for (let j = 0; j < this.height; j++) {
    //             if (discriminator(i, j, this.data[i + j * this.width])) {
    //                 result.push(this.data[i + j * this.width]);
    //             }
    //         }
    //     }
    //     return result;
    // }

    static initV<T>(size: Vec2, fillFunc: (pos: Vec2) => T) {
        let buffer: T[] = [];
        for (let j = 0; j < size.y; j++) {
            for (let i = 0; i < size.x; i++) {
                buffer.push(fillFunc(new Vec2(i, j)));
            }
        }
        return new Grid2D(size, buffer);
    }

    static fromAscii(ascii: string): Grid2D<string> {
        let ascii_lines = ascii.trim().split("\n").map(x => x.trim());
        let height = ascii_lines.length;
        let width = ascii_lines[0].length;
        if (ascii_lines.some(line => line.length !== width)) {
            throw new Error(`The given ascii is not a proper rectangle: ${ascii}`);
        }
        return this.initV(new Vec2(width, height), ({ x, y }) => ascii_lines[y][x]);
    }
}
