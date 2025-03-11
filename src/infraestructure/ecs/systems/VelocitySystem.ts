import { IWorld } from "bitecs";

import { IGameObject, IScene } from "@domain/models";
import { MovementUtil } from "@domain/services";
import { PhysicControllerBase } from "@domain/controllers";

import {

    direction,
    speed,
    directionProxy,
    speedProxy,

} from "@ecs/components/instances";

import { System } from "./System";

export class VelocitySystem extends System {

    constructor(scene: IScene, world: IWorld) {
        super(scene, world, [speed, direction]);
    }
    
    public enter(object: IGameObject): void {
        const physic = object.controllers.get(PhysicControllerBase);
        if (!physic) return;

        speedProxy.entityId = object.id;
        directionProxy.entityId = object.id;

        const velocity = MovementUtil.calculateVelocity(
            directionProxy.vector, speedProxy.value
        );

        physic.setVelocity(velocity);
    }

    public update(object: IGameObject): void {
    }

    public exit(object: IGameObject): void {
    }
}
