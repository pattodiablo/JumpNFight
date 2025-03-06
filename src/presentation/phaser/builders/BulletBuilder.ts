import { Vector2, Vector3, Size, Acceleration } from "@domain/types";
import { IGameObject } from "@domain/models";
import { Vector2Utils } from "@domain/services";

import { 
    CurrentPositionDecorator,
    PreviousPositionDecorator,
    RotationDecorator,
    DirectionDecorator,
    TargetDecorator,
    SizeDecorator, 
    AccelerationDecorator,
    HasGravityDecorator,
} from "@ecs/components/decorators";

import { PhaserScene, Graphic, Sprite } from "@presentation/phaser/models";
import { PhaserPhysicController, ShapeRenderController, TransformController } from "@presentation/phaser/controllers";

import { ObjectBuilder } from "./ObjectBuilder";

export abstract class BaseProjectileBuilder extends ObjectBuilder {

    protected _scene: PhaserScene;

    protected _origin: Vector2 = Vector2Utils.zero();
    protected _depht: number = 0;
    protected _size: Size = { width: 0, height: 0 };
    protected _acceleration: Acceleration = { magnitude: 0, initialSpeed: 0 };
    protected _target: Vector2 = Vector2Utils.zero();
    protected _hasGravity: boolean = false;

    constructor(scene: PhaserScene) {
        super(scene.world);
        this._scene = scene;
    }

    public setOrigin(origin: Vector2): this {
        this._origin = origin;
        return this;
    }

    public setDepht(depht: number): this {
        this._depht = depht;
        return this;
    }

    public setAcceleration(acceleration: Acceleration): this {
        this._acceleration = acceleration;
        return this;
    }

    public setTarget(target: Vector2): this {
        this._target = target;
        return this;
    }

    public setSize(size: Size): this {
        this._size = size;
        return this;
    }

    public hasGravity(value: boolean): this {
        this._hasGravity = value;
        return this;
    }

    public abstract build(): IGameObject;

    protected addComponents(): void {
        const position: Vector3 = { x: this._origin.x, y: this._origin.y, z: this._depht };

        this._entity = new PreviousPositionDecorator(this._entity, position);
        this._entity = new CurrentPositionDecorator(this._entity, position);
        this._entity = new RotationDecorator(this._entity);
        this._entity = new AccelerationDecorator(this._entity, this._acceleration);
        this._entity = new DirectionDecorator(this._entity);
        this._entity = new TargetDecorator(this._entity, this._target);
        this._entity = new SizeDecorator(this._entity, this._size);
        this._entity = new HasGravityDecorator(this._entity, this._hasGravity);
    }

    protected abstract addControllers(object: IGameObject): void;
}

import { ColorDecorator } from "@ecs/components/decorators";

export class ColoredBulletBuilder extends BaseProjectileBuilder {
    private _color: number = 0;

    public setColor(color: number): this {
        this._color = color;
        return this;
    }

    public build(): IGameObject {
        this.addComponents();
        const object = new Graphic(this._entity.uniqueId, this._scene);
        this.addControllers(object);
        return object;
    }

    protected addComponents(): void {
        super.addComponents();
        this._entity = new ColorDecorator(this._entity, this._color);
        this._entity.addComponentsRecursively();
        this._entity.initializeAllComponents();
    }

    protected addControllers(object: Graphic): void {
        object.controllerManager.addController(new TransformController("transform", object));
        object.controllerManager.addController(new ShapeRenderController("shape", object));
        object.controllerManager.addController(new PhaserPhysicController("physic", object));
    }
}

import { TextureIdDecorator } from "@ecs/components/decorators";
import { TextureRenderController } from "../controllers/ShapeRenderController";
import { AssetUtils } from "../../../../static/AssetUtils";

export class TexturedBulletBuilder extends BaseProjectileBuilder {
    private _textureId: string = "";

    public setTextureKey(key: string): this {
        this._textureId = key;
        return this;
    }

    public build(): IGameObject {
        this.addComponents();
        const object = new Sprite(this._entity.uniqueId, this._scene);
        this.addControllers(object);
        return object;
    }

    protected addComponents(): void {
        super.addComponents();

        const textureId = AssetUtils.getIdByKey(this._textureId);
        if (textureId === undefined) {
            throw new Error(`Texture key ${this._textureId} not found`);
        }
        
        this._entity = new TextureIdDecorator(this._entity, textureId);
        this._entity.addComponentsRecursively();
        this._entity.initializeAllComponents();
    }

    protected addControllers(object: Sprite): void {
        object.controllerManager.addController(new TransformController("transform", object));
        object.controllerManager.addController(new PhaserPhysicController("physic", object));
        object.controllerManager.addController(new TextureRenderController("texture", object));
    }
}

