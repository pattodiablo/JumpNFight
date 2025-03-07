import { IController, IGameObject } from "@domain/models";
import { Vector2 } from "@domain/types";

export abstract class PhysicControllerBase<T extends IGameObject> implements IController<T> {
    public readonly name: string;
    public readonly gameObject: T;

    constructor(name: string, gameObject: T) {
        this.name = name;
        this.gameObject = gameObject;
    }
    
    public abstract setVelocity(velocity: Vector2): void;
    public abstract setAcceleration(acceleration: Vector2): void;
    public abstract enableGravity(enable: boolean): void;
}
