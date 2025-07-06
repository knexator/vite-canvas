import { Vec2 } from "./vec2";

export function randomFloat(low_inclusive: number, high_exclusive: number): number {
    return low_inclusive + Math.random() * (high_exclusive - low_inclusive);
}

export function randomInt(low_inclusive: number, high_exclusive: number): number {
    return low_inclusive + Math.floor(Math.random() * (high_exclusive - low_inclusive));
}

export function randomCentered(half_size: number): number {
    return (Math.random() * 2 - 1) * half_size;
}

/** random float between -.5 & .5 */
export function rand05(): number {
    return Math.random() - .5;
}

export function roundTo(value: number, digits: number): number {
    const asdf = Math.pow(10, digits);
    return Math.round(value * asdf) / asdf;
}

export function max(arr: number[]) {
    if (arr.length === 0) {
        return undefined
    }
    return arr[argmax(arr)!];
}

export function argmax(arr: number[]) {
    if (arr.length === 0) {
        throw new Error("empty array");
    }
    let res = 0;
    let biggest = arr[0];
    for (let k = 1; k < arr.length; k++) {
        if (arr[k] > biggest) {
            biggest = arr[k];
            res = k;
        }
    }
    return res;
}

export function min(arr: number[]) {
    if (arr.length === 0) {
        return undefined
    }
    return arr[argmin(arr)!];
}


export function argmin(arr: number[]) {
    if (arr.length === 0) {
        throw new Error("cant argmin of empty array");
    }
    let res = 0;
    let smallest = arr[0];
    for (let k = 1; k < arr.length; k++) {
        if (arr[k] < smallest) {
            smallest = arr[k];
            res = k;
        }
    }
    return res;
}

export function lerp(a: number, b: number, t: number): number {
    return a * (1 - t) + b * t;
}

/** t === inverseLerp(a, b, lerp(a, b, t)) */
export function inverseLerp(a: number, b: number, value: number): number {
    if (a === b) return 0.5;
    let t = (value - a) / (b - a);
    return t;
}

export function towards(cur: number, target: number, max_delta: number): number {
    if (cur > target) {
        return Math.max(cur - max_delta, target);
    } else if (cur < target) {
        return Math.min(cur + max_delta, target);
    } else {
        return target;
    }
}

export function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

export function wrap(value: number, low: number, high: number) {
    return mod(value - low, high - low) + low;
}

export function remap(value: number, old_a: number, old_b: number, new_a: number, new_b: number) {
    let t = (value - old_a) / (old_b - old_a);
    return t * (new_b - new_a) + new_a;
}

export function smoothstep(toZero: number, toOne: number, value: number) {
    let x = Math.max(0, Math.min(1, (value - toZero) / (toOne - toZero)));
    return x * x * (3 - 2 * x);
};

export function clamp(value: number, min_inclusive: number, max_inclusive: number): number {
    return Math.max(min_inclusive, Math.min(max_inclusive, value));
}

export function clamp01(value: number): number {
    return Math.max(0, Math.min(1, value));
}

export function inRange(value: number, min_inclusive: number, max_exclusive: number): boolean {
    return value >= min_inclusive && value < max_exclusive;
}

export function onBorder(value: number, min_inclusive: number, max_exclusive: number): boolean {
    return value == min_inclusive || (value + 1) === max_exclusive;
}

// from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle<T>(array: T[]) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

export function randomChoice<T>(arr: T[]) {
    if (arr.length === 0) {
        throw new Error("can't choose out of an empty array");
    }
    return arr[Math.floor(Math.random() * arr.length)];
}

// written by GPT
export function doSegmentsIntersect(segmentA: [Vec2, Vec2], segmentB: [Vec2, Vec2]): boolean {
    const [a1, a2] = segmentA;
    const [b1, b2] = segmentB;

    const d1 = b1.sub(a1);
    const d2 = b2.sub(a1);
    const d3 = a2.sub(a1);

    const cross1 = d1.cross(d3);
    const cross2 = d2.cross(d3);

    if (cross1 * cross2 >= 0) {
        return false;
    }

    const d4 = a1.sub(b1);
    const d5 = a2.sub(b1);
    const d6 = b2.sub(b1);

    const cross3 = d4.cross(d6);
    const cross4 = d5.cross(d6);

    return cross3 * cross4 < 0;
}

export function closestPointOnSegment(segment: [Vec2, Vec2], point: Vec2): Vec2 {
    const [segmentStart, segmentEnd] = segment;
    const segmentVector = segmentEnd.sub(segmentStart);
    const pointVector = point.sub(segmentStart);
    const segmentLengthSquared = segmentVector.magSq();
    const t = clamp01(pointVector.dot(segmentVector) / segmentLengthSquared);
    const closestPoint = Vec2.lerp(segmentStart, segmentEnd, t);
    return closestPoint;
}
