import { IWorld } from "bitecs";

import { IGameObject, IScene }  from "@domain/models";
import { PhysicControllerBase } from "@domain/controllers";

import { hasGravity, hasGravityProxy } from "@ecs/components/instances";

import { System } from "./System";

export class GravitySystem extends System {

    constructor(scene: IScene, world: IWorld) {
        super(scene, world, [hasGravity]);
    }
    
    public enter(object: IGameObject): void {
        const physicController = object.controllers.get(PhysicControllerBase);
        if (!physicController) return;

        hasGravityProxy.entityId = object.id;

        physicController.enableGravity(hasGravityProxy.value);
    }

    public update(object: IGameObject): void {
    }

    public exit(object: IGameObject): void {
    }
}