import { RenderControllerBase } from "@core/domain/controllers";
import { IImage } from "@domain/types";
import { AssetUtils } from "../../../../static/AssetUtils";
import { Sprite, PhaserScene } from "../models";


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
