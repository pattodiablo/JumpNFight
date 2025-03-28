import { IWorld } from "bitecs";

import { ShapeTypes }           from "@domain/enums";
import { IGameObject, IScene }  from "@domain/models";
import { RenderControllerBase } from "@domain/controllers";

import 
{
    size,
    color,
    sizeProxy,
    colorProxy,
    textureId,
    textureIdProxy,

} from "@ecs/components/instances";

import { System } from "./System";

export class ShapeRenderSystem extends System {

    constructor(scene: IScene, world: IWorld) {
        super(scene, world, [size, color]);
    }
    
    public enter(object: IGameObject): void {
        const shapeRenderController = object.controllers.get(RenderControllerBase);
        if (shapeRenderController === undefined) return;

        sizeProxy.entityId = object.id;
        colorProxy.entityId = object.id;

        const shape = {
            type: ShapeTypes.ELLIPSE,
            size: sizeProxy.value,
            color: colorProxy.value
        };

        shapeRenderController.render(this._scene, shape);
    }

    public update(object: IGameObject): void {
    }

    public exit(object: IGameObject): void {
    }
}

export class TextureRenderSystem extends System {

    constructor(scene: IScene, world: IWorld) {
        super(scene, world, [size, textureId]);
    }
    
    public enter(object: IGameObject): void {
        const textureRenderController = object.controllers.get(RenderControllerBase);
        if (textureRenderController === undefined) return;

        sizeProxy.entityId = object.id;
        textureIdProxy.entityId = object.id;

        const texture = {
            size: sizeProxy.value,
            textureId: textureIdProxy.value
        };

        textureRenderController.render(this._scene, texture);
    }

    public update(object: IGameObject): void {
    }

    public exit(object: IGameObject): void {
    }
}
