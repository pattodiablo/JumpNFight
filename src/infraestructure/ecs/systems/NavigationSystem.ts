import { IWorld } from "bitecs";

import { IGameObject, IScene }  from "@domain/models";
import { MovementUtil }         from "@domain/services";
import { PhysicControllerBase } from "@domain/controllers";

import 
{
    direction,
    target,
    currentPosition,
    directionProxy,
    targetProxy,
    currentPositionProxy,
    
} from "@ecs/components/instances";

import { System } from "./System";

export class NavigationSystem extends System {

    constructor(scene: IScene, world: IWorld) {
        super(scene, world, [currentPosition, target, direction]);
    }

    public enter(object: IGameObject): void {
        const physic = object.controllers.get(PhysicControllerBase);
        if (!physic) return;

        currentPositionProxy.entityId = object.id;
        targetProxy.entityId = object.id;
        directionProxy.entityId = object.id;

        directionProxy.vector = MovementUtil.calculateDirection(
            currentPositionProxy.vector2, targetProxy.vector
        );
    }

    public update(object: IGameObject): void {
    }

    public exit(object: IGameObject): void {
    }
}
