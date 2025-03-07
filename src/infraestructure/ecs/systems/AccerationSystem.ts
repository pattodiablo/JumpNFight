import { AccelerationService } from "@application/services";
import { IGameObject, IScene } from "@domain/models";
import { AccelerationVector, Vector2 } from "@domain/types";
import { acceleration, accelerationProxy, direction, directionProxy } from "@ecs/components";

import { IWorld } from "bitecs";

import { System } from "./System";

export class DynamicMotionSystem extends System {
    private _accelerationService: AccelerationService;

    constructor(scene: IScene, world: IWorld, accelerationService: AccelerationService) {
        super(scene, world, [acceleration, direction]);
        this._accelerationService = accelerationService
    }

    public enter(gameObject: IGameObject): void {
        this._accelerationService.apply(
            gameObject, dynamicMotionProxy.getAccelerationVector(gameObject.id)
        );
    }
}

class DynamicMotionProxy {
    public getAccelerationVector(entityId: number): AccelerationVector {
    
        accelerationProxy.entityId = entityId;
        directionProxy.entityId = entityId;
    
        return {
            direction: directionProxy.vector,
            magnitude: accelerationProxy.magnitude,
            initialSpeed: accelerationProxy.initialSpeed
        };
    }
}

const dynamicMotionProxy = new DynamicMotionProxy();
