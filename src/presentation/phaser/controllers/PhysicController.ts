import { Vector2 } from "@domain/types";
import { PhysicControllerBase } from "@domain/controllers";
import { PhaserGameObject } from "../models";

export class PhaserPhysicController extends PhysicControllerBase<PhaserGameObject> {

    constructor(name: string, object: PhaserGameObject) {
        super(name, object);
        this.gameObject.scene.physics.add.existing(this.gameObject);
    }

    private get physicBody(): Phaser.Physics.Arcade.Body {
        return this.gameObject.getPhysicBody<Phaser.Physics.Arcade.Body>();
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