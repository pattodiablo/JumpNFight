import { RenderControllerBase } from "@domain/controllers";
import { Graphic } from "../models";
import PhaserScene from "../models/PhaserScene";
import { IShape } from "@domain/types";

export class ShapeRenderController extends RenderControllerBase<Graphic> {

    constructor(name: string, object: Graphic) {
        super(name, object);
    }

    public render(scene: PhaserScene, shape: IShape): void {
        this.gameObject.clear();
        this.gameObject.fillStyle(shape.color, 1);
        this.gameObject.fillEllipse(0, 0, shape.size.width, shape.size.height);
        scene.add.existing(this.gameObject);
    }
}
