import { PositionComponent, PreviousPositionComponent, RotationComponent, ScaleComponent } from "../components";
import { Scene } from "~/infraestructure/phaser/game/models/Scene";
import Transform from "~/infraestructure/phaser/game/adapters/Transform";
import { FloatProxy, Vector3Proxy } from "../components/proxies";
import { IGameObject } from "~/domain/models";
import { System } from "./System";

export class TransformSystem extends System {

    constructor(scene: Scene) {
        super(scene, [PreviousPositionComponent, PositionComponent, RotationComponent]);
    }

    public enter(object: IGameObject): void {
        const transfrom = object.getComponent(Transform);
        if (!transfrom) return;

        const origin = new Vector3Proxy(PositionComponent, object.id);
        // Inicializa la posición
        transfrom.position = origin.vector2;
    }

    public update(object: IGameObject): void {
        const transfrom = object.getComponent(Transform);
        if (!transfrom) return;

        const prevPosition = new Vector3Proxy(PreviousPositionComponent, object.id);
        const currentPosition = new Vector3Proxy(PositionComponent, object.id);
        const rotation = new FloatProxy(RotationComponent, object.id);

        // Actualizar posiciones
        prevPosition.vector2 = currentPosition.vector2;
        currentPosition.vector2 = transfrom.position;
        // Actualizar rotación
        rotation.set(transfrom.rotation);
    }

    public exit(object: IGameObject): void {
    }
}
