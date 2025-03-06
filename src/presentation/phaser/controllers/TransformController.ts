import { Vector2 } from "@domain/types";
import { TransformControllerBase } from "@domain/controllers";
import { IGameObject } from "~/core/domain";

export class TransformController<T extends IGameObject & Phaser.GameObjects.Components.Transform>
 extends TransformControllerBase<T> {

    constructor(name: string, gameObject: T) {
        super(name, gameObject);
    }

    public get position(): Vector2 {
        return {x:this.gameObject.x, y:this.gameObject.y};
    }

    public get rotation(): number {
        return this.gameObject.rotation;
    }

    public get scale(): Vector2 {
        return {x:this.gameObject.scaleX, y:this.gameObject.scaleY}
    }

    public set position(vector: Vector2) {
        this.gameObject.setPosition(vector.x, vector.y);
    }

    public set rotation(angle: number) {
        this.gameObject.rotation = angle;
    }
}
