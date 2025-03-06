import { IWorld } from "bitecs";

import { IGameObject, IScene }     from "@domain/models";
import { MovementUtil }            from "@domain/services";
import { TransformControllerBase } from "@domain/controllers";

import {
    
    currentPosition,
    previousPosition,
    currentPositionProxy,
    previousPositionProxy,

} from "@ecs/components/instances";


import { System } from "./System";

export class DirectionSystem extends System {

    constructor(scene: IScene, world: IWorld) {
        super(scene, world, [previousPosition, currentPosition]);
    }
    
    public enter(object: IGameObject): void {
    }

    public update(object: IGameObject): void {

        const transfromController = object.controllerManager.getController(TransformControllerBase);
        if (transfromController === undefined) return;

        previousPositionProxy.entityId = object.uniqueId;
        currentPositionProxy.entityId = object.uniqueId;

        const direction = MovementUtil.calculateDirection(
                previousPositionProxy.vector2, currentPositionProxy.vector2
            );

        var angle = MovementUtil.calculateAngle(direction);
        if (angle == 0) return;
        
        transfromController.rotation = angle;
    }

    public exit(object: IGameObject): void {
    }
}