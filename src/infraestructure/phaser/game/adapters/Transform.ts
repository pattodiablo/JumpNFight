import { Vector2 } from "~/domain/value-objects/Vector2";
import { IBehaviours } from "~/domain/models/IBehaviours";
import { GameObject } from "../models/GameObject";

export interface ITransform extends IBehaviours {
    get position(): Vector2;
    get rotation(): number;
    get scale(): Vector2;
    set position(vector: Vector2);
    set rotation(angle: number);
}

export default class Transform implements ITransform {
    public name: string;
    private _object: GameObject;

    constructor(name: string, object: GameObject) {
        this.name = name;
        this._object = object;
    }

    public get position(): Vector2 {
        return new Vector2(this._object.x, this._object.y);
    }

    public get rotation(): number {
        return this._object.rotation;
    }

    public get scale(): Vector2 {
        return new Vector2(this._object.scaleX, this._object.scaleY)
    }

    public set position(vector: Vector2) {
        this._object.setPosition(vector.x, vector.y);
    }

    public set rotation(angle: number) {
        this._object.rotation = angle;
    }
}
