import { IWorld } from "bitecs";

import { Shape }                from "@domain/types";
import { ShapeTypes }           from "@domain/enums";
import { IGameObject, IScene }  from "@domain/models";
import { RenderControllerBase } from "@domain/controllers";

import 
{
    currentPosition,
    size,
    color,
    currentPositionProxy,
    sizeProxy,
    colorProxy,

} from "@ecs/components/instances";

import { System } from "./System";

export class ShapeRenderSystem extends System {

    constructor(scene: IScene, world: IWorld) {
        super(scene, world, [currentPosition, size, color]);
    }
    
    public enter(object: IGameObject): void {
        const shapeRenderController = object.getController(RenderControllerBase);
        if (shapeRenderController === undefined) return;
        
        currentPositionProxy.entityId = object.uniqueId;
        sizeProxy.entityId = object.uniqueId;
        colorProxy.entityId = object.uniqueId;

        const shape: Shape = {
            type: ShapeTypes.ELLIPSE,
            size: sizeProxy.value,
            color: {name: "Red", number: colorProxy.value},
        };

        shapeRenderController.render(this._scene, shape);
    }

    public update(object: IGameObject): void {
    }

    public exit(object: IGameObject): void {
    }
}
