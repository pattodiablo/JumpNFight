import { Vector2 } from "../types";
import { Vector2Utils } from ".";

export class MovementUtil {
    public static calculateVelocity(direction: Vector2, speed: number) : Vector2 {
        return this.scaleVector(direction, speed);
    }

    public static calculateAcceleration(direction: Vector2, acceleration: number) : Vector2 {
        return this.scaleVector(direction, acceleration);
    }

    public static calculateDirection(origin: Vector2, target: Vector2): Vector2 {
        if (Vector2Utils.equals(origin, target)) return Vector2Utils.zero();
        const displacement: Vector2 = this.calculateDisplacement(origin, target);
        return Vector2Utils.normalize(displacement);
    }

    public static calculateAngle(vector: Vector2): number {
        return Math.atan2(vector.y, vector.x);
    }

    private static scaleVector(direction: Vector2, magnitude: number): Vector2 {
        if (Vector2Utils.isZero(direction)) return Vector2Utils.zero();
        const normalizedDirection = Vector2Utils.normalize(direction);
        return Vector2Utils.scale(normalizedDirection, magnitude);
    }

    private static calculateDisplacement(origin: Vector2, target: Vector2): Vector2 {
        if (Vector2Utils.equals(origin, target)) return Vector2Utils.zero();
        return Vector2Utils.subtract(target, origin);
    }
}