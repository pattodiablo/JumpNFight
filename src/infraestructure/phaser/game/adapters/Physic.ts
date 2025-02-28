import { Vector2 } from "~/domain/value-objects/Vector2";
import { IBehaviours } from "~/domain/models/IBehaviours";
import { GameObject } from "../models/GameObject";

export interface IPhysic extends IBehaviours {
    setVelocity(velocity: Vector2): void;
    activateGravity(value: boolean): void;
}

export default class Physic implements IPhysic {
    public name: string;
    private _object: GameObject;

    constructor(name: string, object: GameObject) {
        this.name = name;
        this._object = object;

        this._object.scene.physics.add.existing(this._object);
    }

    //#region Getters

    private get physicBody(): Phaser.Physics.Arcade.Body {
        return this._object.body as Phaser.Physics.Arcade.Body;
    }

    //#endregion Getters

    public setVelocity(velocity: Vector2): void {
        this.physicBody.setVelocity(velocity.x, velocity.y);
    }

    public activateGravity(value: boolean): void {
        this.physicBody.setAllowGravity(value);
    }
}
