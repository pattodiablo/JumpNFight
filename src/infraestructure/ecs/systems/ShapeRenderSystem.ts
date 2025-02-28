import { IGameObject, Shape } from "@domain/models";
import ShapeRender from "~/infraestructure/phaser/game/adapters/ShapeRender";
import { Scene } from "@infra/phaser/game/models/Scene";
import { PositionComponent, SizeComponent, ColorComponent } from "@ecs/components";
import { System } from "./System";
import { FloatProxy, SizeProxy, Vector3Proxy } from "../components/proxies";

export class ShapeRenderSystem extends System {

    constructor(scene: Scene) {
        super(scene, [PositionComponent, SizeComponent, ColorComponent]);
    }
    
    public enter(object: IGameObject): void {
        const renderShape = object.getComponent(ShapeRender);
        if (!renderShape) return;

        const origin = new Vector3Proxy(PositionComponent, object.id);
        const size = new SizeProxy(SizeComponent, object.id);
        const color = new FloatProxy(ColorComponent, object.id);

        const shape: Shape = {
            position: origin.vector2,
            size: size.value,
            color: color.value
        };

        renderShape.render(this._scene, shape);
    }

    public update(object: IGameObject): void {
    }

    public exit(object: IGameObject): void {
    }
}
