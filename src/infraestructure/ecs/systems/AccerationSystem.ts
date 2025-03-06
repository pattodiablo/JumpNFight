import { IWorld } from "bitecs";

import { IScene, IGameObject }  from "@domain/models";
import { MovementUtil }         from "@domain/services";
import { PhysicControllerBase } from "@domain/controllers";

import { 

    direction,
    acceleration,
    directionProxy,
    accelerationProxy,

} from "@ecs/components";

import { System } from "./System";

export class AccelerationSystem extends System {

    constructor(scene: IScene, world: IWorld) {
        super(scene, world, [acceleration, direction]);
    }

    public enter(object: IGameObject): void {
        const physicController = object.getController(PhysicControllerBase);
        if (physicController === undefined) return;

        directionProxy.entityId = object.uniqueId;
        accelerationProxy.entityId = object.uniqueId;

        const velocity 
            = MovementUtil.calculateVelocity(directionProxy.vector, 
                accelerationProxy.initialSpeed);
        const acceleration 
            = MovementUtil.calculateVelocity(directionProxy.vector,
                accelerationProxy.magnitude);

        physicController.velocity = velocity;
        physicController.acceleration = acceleration;
    }

    public update(object: IGameObject): void {
    }

    public exit(object: IGameObject): void {
    }
}
