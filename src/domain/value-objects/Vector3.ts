import { Vector2 } from "./Vector2";

export class Vector3 extends Vector2 {
    private _z: number;

    constructor();
    constructor(x: number, y: number, z: number);
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super(x, y);
        this._z = z;
    }

    static get zero() : Vector3 {
        return new Vector3(0, 0, 0);
    }

    // region Getters

    get z() : number {
        return this._z;
    }

    // endregion Getters

    // region Setters

    set z(z: number) {
        this._z = z;
    }

    // endregion Setters
}