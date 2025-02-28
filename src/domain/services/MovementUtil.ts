import { Vector2 } from "@domain/value-objects/Vector2";

export class MovementUtil {
    public static calculateVelocity(direction: Vector2, speed: number) : Vector2 {
        if (direction == Vector2.zero || speed <= 0) return Vector2.zero;
        const normalizedDirection = Vector2.normalize(direction);
        return Vector2.scale(normalizedDirection, speed);
    }

    public static calculateDirection(origin: Vector2, target: Vector2) {
        if (origin == target) return Vector2.zero;
        const displacement: Vector2 = this.calculateDisplacement(origin, target);
        return Vector2.normalize(displacement);
    }

    public static calculateAngle(vector: Vector2): number {
        return Math.atan2(vector.y, vector.x);
    }

    private static calculateDisplacement(origin: Vector2, target: Vector2) : Vector2 {
        if (origin == target) return Vector2.zero;
        return Vector2.subtract(target, origin);
    }
}