import { ComponentType } from "bitecs";
import { Vector2 } from "@domain/types";
import { Vector2Utils } from "@domain/services";
import { Vector2Schema } from "@ecs/value-objects";
import IEntity from "@ecs/entities/IEntity";
import EntityDecorator from "./EntityDecorator";

export abstract class Vector2Decorator extends EntityDecorator<Vector2, Vector2Schema> {

    constructor(entity: IEntity, component: ComponentType<Vector2Schema>);
    constructor(entity: IEntity, component: ComponentType<Vector2Schema>, value: Vector2);
    constructor(entity: IEntity, component: ComponentType<Vector2Schema>, value: Vector2 | undefined);
    constructor(entity: IEntity, component: ComponentType<Vector2Schema>, value?: Vector2) {
        super(entity, component, value);
    }

    public get value(): Vector2 {
        return this._value ?? Vector2Utils.zero();
    }

    public addComponentsRecursively(): void {
        super.addComponentsRecursively();
        super.addComponent(this._component);
    }

    public initializeAllComponents(): void {
        super.initializeAllComponents();
        this._component.x[this.uniqueId] = this.value.x;
        this._component.y[this.uniqueId] = this.value.y;
    }
}
