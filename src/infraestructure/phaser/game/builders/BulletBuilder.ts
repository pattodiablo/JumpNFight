// Domain
import { Vector2 } from "~/domain/value-objects/Vector2";
import { Vector3 } from "~/domain/value-objects/Vector3";
import { Size } from "~/domain/value-objects/Size";
import { IGameObject } from "~/domain/models/IGameObject";
// Decorators
import { PositionComponentDecorator, PreviousPositionComponentDecorator, RotationComponentDecorator } from "~/infraestructure/ecs/decorators/TransformDecorators";
import { DirectionComponentDecorator, SpeedComponentDecorator, VelocityComponentDecorator } from "~/infraestructure/ecs/decorators/MovementDecorators";
import { TargetComponentDecorator } from "~/infraestructure/ecs/decorators/NavigationDecorators";
import { ColorComponentDecorator, SizeComponentDecorator } from "~/infraestructure/ecs/decorators/RenderDecorators";
// Builders
import { ObjectBuilder } from "./ObjectBuilder";
// Models
import { Scene } from "../models/Scene";
import { GameObject } from "../models/GameObject";
// Behaviours
import Physic from "../adapters/Physic";
import ShapeRender from "../adapters/ShapeRender";
import { GravityComponentDecorator } from "~/infraestructure/ecs/decorators";
import Transform from "../adapters/Transform";

export class BulletBuilder extends ObjectBuilder {

    //#region Fields

    private _scene: Scene;

    //#region Transform fields
    
    private _origin: Vector2 = Vector2.zero;
    private _depht: integer = 0;

    //#endregion Transform fields

    //#region Render fields
    
    private _size: Size = new Size();
    private _color: number = 0;

    //#endregion Render fields

    //#region Movement fields

    private _speed: number = 0;
    private _target: Vector2 = Vector2.zero;

    //#endregion Movement fields

    //#region Physic fields

    private _hasGravity: boolean = false;

    //#endregion Physic fields

    //#endregion Fields

    constructor(scene: Scene) {
        super(scene.world)
        this._scene = scene;
    }

    //#region Setters

    public setOrigin(origin: Vector2): BulletBuilder {
        this._origin = origin;
        return this;
    }

    public setDepht(depht: integer): BulletBuilder {
        this._depht = depht;
        return this;
    }

    public setSpeed(speed: number): BulletBuilder {
        this._speed = speed;
        return this;
    }

    public setTarget(target: Vector2): BulletBuilder {
        this._target = target;
        return this;
    }

    public setColor(color: number): BulletBuilder {
        this._color = color;
        return this;
    }

    public setSize(size: Size): BulletBuilder {
        this._size = size;
        return this;
    }

    public hasGravity(value: boolean): BulletBuilder {
        this._hasGravity = value;
        return this;
    }

    //#endregion Setters

    build(): IGameObject {
        this.addComponents();
        const object = new GameObject(this._entity.id, this._scene);
        this.addBehaviours(object);
        return object;
    }

    private addComponents() {
        const position: Vector3 = new Vector3(this._origin.x, this._origin.y, this._depht);

        this._entity = new PreviousPositionComponentDecorator(this._entity, position);
        this._entity = new PositionComponentDecorator(this._entity, position);
        this._entity = new RotationComponentDecorator(this._entity);
        this._entity = new SpeedComponentDecorator(this._entity, this._speed);
        this._entity = new DirectionComponentDecorator(this._entity);
        this._entity = new TargetComponentDecorator(this._entity, this._target);
        this._entity = new ColorComponentDecorator(this._entity, this._color);
        this._entity = new SizeComponentDecorator(this._entity, this._size);
        this._entity = new GravityComponentDecorator(this._entity, this._hasGravity)

        this._entity.addComponents();
        this._entity.initComponents();
    }

    private addBehaviours(object: GameObject) {
        object.addBehaviuor(new Physic("Physic", object));
        object.addBehaviuor(new ShapeRender("ShapeRender", object))
        object.addBehaviuor(new Transform("Transform", object));
    }
}
