import { Vector2, Vector3 } from "@domain/value-objects"

export class Transform {
    private _position: Vector3;
    private _rotation: Vector2;
    private _scale: Vector2;

    constructor();
    constructor(position: Vector3, rotation: Vector2, scale: Vector2);
    constructor(position: Vector3 = Vector3.zero, rotation: Vector2 = Vector2.zero, scale: Vector2 = Vector2.zero) {
        this._position = position;
        this._rotation = rotation;
        this._scale = scale;
    }

    //#region Getters

    get position() : Vector3 {
        return this._position;
    }

    get rotation() : Vector2 {
        return this._rotation;
    }

    get scale() : Vector2 {
        return this._scale;
    }

    //#endregion Getters

    //#region Setters

    set position(position: Vector3) {
        this._position = position;
    }

    set rotation(rotation: Vector2) {
        this._rotation = rotation;
    }

    set scale(scale: Vector2) {
        this._scale = scale;
    }

    //#endregion Setters
}