import { MovementUtil } from "@domain/services";
import { PositionComponent, TargetComponent, SpeedComponent } from "@ecs/components";
import { Scene } from "~/infraestructure/phaser/game/models/Scene";
import { FloatProxy, Vector2Proxy, Vector3Proxy } from "../components/proxies";
import Physic from "~/infraestructure/phaser/game/adapters/Physic";
import { System } from "./System";
import { IGameObject } from "~/domain/models";

export class VelocitySystem extends System {

    constructor(scene: Scene) {
        super(scene, [PositionComponent, SpeedComponent, TargetComponent]);
    }
    
    public enter(object: IGameObject): void {
        const physic = object.getComponent(Physic);
        if (!physic) return;

        const origin = new Vector3Proxy(PositionComponent, object.id);
        const target = new Vector2Proxy(TargetComponent, object.id);
        const speed = new FloatProxy(SpeedComponent, object.id)

        const direction = MovementUtil.calculateDirection(origin.vector2, target.vector);
        const velocity = MovementUtil.calculateVelocity(direction, speed.value);

        physic.setVelocity(velocity);
    }

    public update(object: IGameObject): void {
    }

    public exit(object: IGameObject): void {
    }
}

