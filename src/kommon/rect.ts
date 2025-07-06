import { Vec2 } from "./vec2";

// TODO: all measures
export type MeasureKind = 'center' | 'size';

export class Rect {
    constructor(
        public readonly top_left: Vec2,
        public readonly size: Vec2,
    ) { }


    toString(): string {
        return `Rect(top_left:${this.top_left},size:${this.size})`;
    }

    static lerp(a: Rect, b: Rect, t: number): Rect {
        return new Rect(
            Vec2.lerp(a.top_left, b.top_left, t),
            Vec2.lerp(a.size, b.size, t),
        );
    }

    equal(other: Rect): boolean {
        return this.top_left.equal(other.top_left) && this.size.equal(other.size);
    }

    equalAprox(other: Rect, eps: number = 1e-10): boolean {
        return this.top_left.equalAprox(other.top_left, eps) && this.size.equalAprox(other.size, eps);
    }

    withAspectRatio(target_ratio: number, mode: 'grow' | 'shrink', keep: MeasureKind): Rect {
        if (keep == 'size') throw new Error("BAD");
        const new_size = this.size.withAspectRatio(target_ratio, mode);
        return this.with('size', new_size, keep);
    }

    with( change_kind: MeasureKind, change_value: Vec2, keep: MeasureKind): Rect {
        return Rect.from(keep, this.get(keep), change_kind, change_value);
    }

    get(which: MeasureKind) : Vec2 {
        switch (which) {
            case "center": return this.top_left.add(this.size.scale(0.5));
            case "size": return this.size;
        };
    }

    static from(
        measure_1_kind: MeasureKind, measure_1_value: Vec2,  
        measure_2_kind: MeasureKind, measure_2_value: Vec2,  
    ): Rect {
        switch (measure_1_kind) {
            case "center": {
                switch (measure_2_kind) {
                    case "center": throw new Error("BAD");
                    case "size": return new Rect(
                        measure_1_value.sub(measure_2_value.scale(0.5)), 
                        measure_2_value,
                    );
                }
            }
            case "size": throw new Error("TODO");
        }
    }
}
