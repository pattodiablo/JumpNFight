import { RenderControllerBase } from "@domain/controllers";
import { PhaserScene, Graphic, Sprite } from "../models";
import { IShape } from "~/core/domain/types/base/IShape";
import { IImage } from "~/core/domain/types/base/IImage";
import { AssetUtils } from "~/../static/AssetUtils";

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

export class TextureRenderController extends RenderControllerBase<Sprite> {

    constructor(name: string, object: Sprite) {
        super(name, object);
    }

    public render(scene: PhaserScene, image: IImage): void {
        const texture = AssetUtils.getKeyById(image.textureId);
        if (texture === undefined) return;
        this.gameObject.setTexture(texture);
        this.gameObject.setDisplaySize(image.size.width, image.size.height);
        scene.add.existing(this.gameObject);
    }
}
