import { ComponentType } from "bitecs";
import { Vector3 } from "@domain/value-objects";
import { IEntity } from "@ecs/entities";
import { Vector3Schema } from "@ecs/value-objects";
import EntityDecorator from "./EntityDecorator";

export abstract class Vector3ComponentDecorator extends EntityDecorator {
    private _vector: Vector3;
    private _component: ComponentType<Vector3Schema>;

    constructor(entity: IEntity, component: ComponentType<Vector3Schema>);
    constructor(entity: IEntity, component: ComponentType<Vector3Schema>, vector: Vector3);
    constructor(entity: IEntity, component: ComponentType<Vector3Schema>, vector?: Vector3) {
        super(entity);
        this._vector = vector ?? Vector3.zero;
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
        this._component.z[this.id] = this._vector.z;
    }
}
