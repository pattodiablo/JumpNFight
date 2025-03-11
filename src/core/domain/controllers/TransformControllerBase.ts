import { Vector2 } from "~/core/domain/types";
import { IController } from "../models/IController";
import { IGameObject } from "../models";

export abstract class TransformControllerBase<T extends IGameObject> implements IController<T> {
    
    public readonly name: string;
    public readonly gameObject: T;

    constructor(name: string, gameObject: T) {
        this.name = name;
        this.gameObject = gameObject;
    }

    public abstract get position(): Vector2;
    public abstract get rotation(): number;
    public abstract get scale(): Vector2;

    public abstract set position(vector: Vector2);
    public abstract set rotation(angle: number);
}
