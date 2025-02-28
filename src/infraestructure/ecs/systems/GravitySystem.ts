import Physic from "~/infraestructure/phaser/game/adapters/Physic";
import { Scene } from "~/infraestructure/phaser/game/models/Scene";
import { GravityComponent } from "../components";
import { BooleanProxy } from "../components/proxies";
import { System } from "./System";
import { IGameObject } from "~/domain/models";

export class GravitySystem extends System {

    constructor(scene: Scene) {
        super(scene, [GravityComponent]);
    }
    
    public enter(object: IGameObject): void {
        const physic = object.getComponent(Physic);
        if (!physic) return;

        const hasGravity = new BooleanProxy(GravityComponent, object.id);

        physic.activateGravity(hasGravity.value);
    }

    public update(object: IGameObject): void {
    }

    public exit(object: IGameObject): void {
    }
}