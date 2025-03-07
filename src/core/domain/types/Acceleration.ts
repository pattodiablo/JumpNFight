import { Vector2 } from "./Vector2";

export type Acceleration = {
    magnitude: number;
    initialSpeed: number;
};

export type AccelerationVector = {
    direction: Vector2;
} & Acceleration;