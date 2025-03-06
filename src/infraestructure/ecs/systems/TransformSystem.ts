import { IWorld } from "bitecs";

import { IGameObject, IScene }     from "@domain/models";
import { TransformControllerBase } from "@domain/controllers";

import {

    currentPosition,
    previousPosition,
    rotation,
    currentPositionProxy,
    previousPositionProxy,
    rotationProxy,

} from "@ecs/components/instances";

import { System } from "./System";

export class TransformSystem extends System {

    constructor(scene: IScene, world: IWorld) {
        super(scene, world, [previousPosition, currentPosition, rotation]);
    }

    public enter(object: IGameObject): void {
        const transfromController = object.controllerManager.getController(TransformControllerBase);
        if (transfromController === undefined) return;

        currentPositionProxy.entityId = object.uniqueId;

        transfromController.position = currentPositionProxy.vector2;
    }

    public update(object: IGameObject): void {
        const transfromController = object.controllerManager.getController(TransformControllerBase);
        if (transfromController === undefined) return;

        previousPositionProxy.entityId = object.uniqueId;
        currentPositionProxy.entityId = object.uniqueId;
        rotationProxy.entityId = object.uniqueId;

        previousPositionProxy.vector2 = currentPositionProxy.vector2;
        currentPositionProxy.vector2 = transfromController.position;

        rotationProxy.value = transfromController.rotation;
    }

    public exit(object: IGameObject): void {
    }
}
