import { Shape } from "@domain/types";
import { RenderControllerBase } from "@domain/controllers";
import { PhaserScene, PhaserGameObject } from "../models";

export class ShapeRenderController extends RenderControllerBase<PhaserGameObject> {

    constructor(name: string, object: PhaserGameObject) {
        super(name, object);
    }

    public render(scene: PhaserScene, shape: Shape): void {
        this.gameObject.clear();
        this.gameObject.fillStyle(shape.color.number, 1);
        this.gameObject.fillEllipse(0, 0, shape.size.width, shape.size.height);
        scene.add.existing(this.gameObject);
    }
}
