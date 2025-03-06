import { Vector2 } from "@domain/types";
import { PhysicControllerBase } from "@domain/controllers";
import { IGameObject } from "~/core/domain";

export class PhaserPhysicController<T extends Phaser.GameObjects.GameObject & IGameObject> 
extends PhysicControllerBase<T> {

    constructor(name: string, object: T) {
        super(name, object);
        this.gameObject.scene.physics.add.existing(this.gameObject);
    }

    private get physicBody(): Phaser.Physics.Arcade.Body {
        return this.gameObject.body as Phaser.Physics.Arcade.Body;
    }

    public set velocity(vector: Vector2) {
        this.physicBody.setVelocity(vector.x, vector.y);
    }

    public set acceleration(vector: Vector2) {
        this.physicBody.setAcceleration(vector.x, vector.y);
    }

    public enableGravity(value: boolean): void {
        this.physicBody.setAllowGravity(value);
    }
}