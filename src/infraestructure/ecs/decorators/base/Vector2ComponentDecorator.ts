import { ComponentType } from "bitecs";
import { Vector2 } from "@domain/value-objects";
import { IEntity } from "@ecs/entities";
import { Vector2Schema } from "@ecs/value-objects";
import EntityDecorator from "./EntityDecorator";

export abstract class Vector2ComponentDecorator extends EntityDecorator {
    private _vector: Vector2;
    private _component: ComponentType<Vector2Schema>;

    constructor(entity: IEntity, component: ComponentType<Vector2Schema>);
    constructor(entity: IEntity, component: ComponentType<Vector2Schema>, vector: Vector2);
    constructor(entity: IEntity, component: ComponentType<Vector2Schema>, vector?: Vector2) {
        super(entity);
        this._vector = vector ?? Vector2.zero;
        this._component = component;
    }

    public addComponents(): void {
        super.addComponents();
        super.addComponent(this._component);
    }

    public initComponents(): void {
        super.initComponents();
        this._component.x[this.id] = this._vector.x;
        this._component.y[this.id] = this._vector.y;
    }
}
