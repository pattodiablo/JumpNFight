import { Vector2, Vector3, Size, Acceleration } from "@domain/types";
import { IGameObject }                          from "@domain/models";
import { Vector2Utils }                         from "@domain/services";

import { 

    CurrentPositionDecorator,
    PreviousPositionDecorator,
    RotationDecorator,
    DirectionDecorator,
    TargetDecorator,
    ColorDecorator,
    SizeDecorator, 
    AccelerationDecorator,
    HasGravityDecorator,

} from "@ecs/components/decorators";

import { PhaserScene, PhaserGameObject }            from "@presentation/phaser/models";
import { PhaserPhysicController, ShapeRenderController, TransformController } from "@presentation/phaser/controllers";

import { ObjectBuilder } from "./ObjectBuilder";

export class BulletBuilder extends ObjectBuilder {

    //#region Fields

    private _scene: PhaserScene;

    //#region Transform fields
    
    private _origin: Vector2 = Vector2Utils.zero();
    private _depht: integer = 0;

    //#endregion Transform fields

    //#region Render fields
    
    private _size: Size = { width: 0, height: 0 };
    private _color: number = 0;

    //#endregion Render fields

    //#region Movement fields

    private _acceleration: Acceleration = { magnitude: 0, initialSpeed: 0 };
    private _target: Vector2 = Vector2Utils.zero();

    //#endregion Movement fields

    //#region Physic fields

    private _hasGravity: boolean = false;

    //#endregion Physic fields

    //#endregion Fields

    constructor(scene: PhaserScene) {
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

    public setAcceleration(acceleration: Acceleration): BulletBuilder {
        this._acceleration = acceleration;
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
        const object = new PhaserGameObject(this._entity.uniqueId, this._scene);
        this.addBehaviours(object);
        return object;
    }

    private addComponents() {
        const position: Vector3 = { x:this._origin.x, y:this._origin.y, z:this._depht };

        this._entity = new PreviousPositionDecorator(this._entity, position);
        this._entity = new CurrentPositionDecorator(this._entity, position);
        this._entity = new RotationDecorator(this._entity);
        this._entity = new AccelerationDecorator(this._entity, this._acceleration);
        this._entity = new DirectionDecorator(this._entity);
        this._entity = new TargetDecorator(this._entity, this._target);
        this._entity = new ColorDecorator(this._entity, this._color);
        this._entity = new SizeDecorator(this._entity, this._size);
        this._entity = new HasGravityDecorator(this._entity, this._hasGravity)

        this._entity.addComponentsRecursively();
        this._entity.initializeAllComponents();
    }

    private addBehaviours(object: PhaserGameObject) {
        object.addController(new PhaserPhysicController("Physic", object));
        object.addController(new ShapeRenderController("ShapeRender", object))
        object.addController(new TransformController("Transform", object));
    }
}
