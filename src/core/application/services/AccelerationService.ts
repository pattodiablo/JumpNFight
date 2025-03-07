import { PhysicControllerBase } from "@domain/controllers";
import { IGameObject } from "@domain/models";
import { Vector2Utils as Vec2Utils } from "@domain/services";
import { AccelerationVector, Vector2 as Vec2 } from "@domain/types";

export class AccelerationService {
    public apply(go: IGameObject, data: AccelerationVector): void {
        const physicController = go.controllers.get(PhysicControllerBase);
        if (physicController === undefined) {
            throw new Error(`The game object with id: ${go.id} does not have a physic controller`);
        }

        const initialVelocity: Vec2 
            = this.calculateVelocity(data.direction, data.initialSpeed);
        const acceleration: Vec2
            = this.calculateAcceleration(data.direction, data.magnitude);

        physicController.setVelocity(initialVelocity);
        physicController.setAcceleration(acceleration);
    }

    private calculateAcceleration(dir: Vec2, magnitude: number): Vec2 {
        return Vec2Utils.scale(dir, magnitude);
    }

    private calculateVelocity(dir: Vec2, speed: number): Vec2 {
        return Vec2Utils.scale(dir, speed);
    }
}
