import { Vector2 } from "../types";

export const Vector2Utils = {
    zero: (): Vector2 => ({ x: 0, y: 0 }),

    normalize: (vector: Vector2): Vector2 => {
        const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
        return magnitude !== 0 ? { x: vector.x / magnitude, y: vector.y / magnitude } : Vector2Utils.zero();
    },

    scale: (vector: Vector2, scalar: number): Vector2 => {
        if (Vector2Utils.isZero(vector)) return Vector2Utils.zero();
        const normalizedVector = Vector2Utils.normalize(vector);
        return { x: normalizedVector.x * scalar, y: normalizedVector.y * scalar };
    },

    multiply: (a: Vector2, b: Vector2): Vector2 => {
        return { x: a.x * b.x, y: a.y * b.y };
    },

    subtract: (a: Vector2, b: Vector2): Vector2 => {
        return { x: a.x - b.x, y: a.y - b.y };
    },

    equals: (a: Vector2, b: Vector2): boolean => {
        return a.x === b.x && a.y === b.y;
    },

    isZero: (vector: Vector2): boolean => {
        return vector.x === 0 && vector.y === 0;
    },
};
