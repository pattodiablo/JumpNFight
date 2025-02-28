import { DirectionComponent, PositionComponent, PreviousPositionComponent, RotationComponent} from "../components";
import { Scene } from "~/infraestructure/phaser/game/models/Scene";
import Transform from "~/infraestructure/phaser/game/adapters/Transform";
import { FloatProxy, Vector2Proxy, Vector3Proxy } from "../components/proxies";
import { IGameObject } from "~/domain/models";
import { System } from "./System";
import { MovementUtil } from "~/domain/services";

export class DirectionSystem extends System {

    constructor(scene: Scene) {
        super(scene, [PreviousPositionComponent, PositionComponent, DirectionComponent, RotationComponent]);
    }
    
    public enter(object: IGameObject): void {
    }

    public update(object: IGameObject): void {

        const transfrom = object.getComponent(Transform);
        if (!transfrom) return;

        const previousPosition = new Vector3Proxy(PreviousPositionComponent, object.id);
        const currentPosition = new Vector3Proxy(PositionComponent, object.id);
        const direction = new Vector2Proxy(DirectionComponent, object.id);

        // Calcular dirección en base a las posiciones
        direction.vector = MovementUtil.calculateDirection(previousPosition.vector2, currentPosition.vector2);

        // Calcular el ángulo de la dirección
        var angle = MovementUtil.calculateAngle(direction.vector);
        if (angle == 0) return; // Si el ángulo es cero parar ejecución
        
        // Actualizar rotación
        transfrom.rotation = angle;
    }

    public exit(object: IGameObject): void {
    }
}