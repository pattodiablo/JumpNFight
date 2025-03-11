import { ComponentType } from "bitecs";
import { Vector3, Vector3Utils } from "@core/domain";
import { Vector3Schema } from "@ecs/value-objects";
import IEntity from "@ecs/entities/IEntity";
import EntityDecorator from "./EntityDecorator";

export abstract class Vector3Decorator extends EntityDecorator<Vector3, Vector3Schema> {
    
    constructor(entity: IEntity, component: ComponentType<Vector3Schema>);
    constructor(entity: IEntity, component: ComponentType<Vector3Schema>, value: Vector3);
    constructor(entity: IEntity, component: ComponentType<Vector3Schema>, value: Vector3 | undefined);
    constructor(entity: IEntity, component: ComponentType<Vector3Schema>, value?: Vector3) {
        super(entity, component, value);
    }

    public get value(): Vector3 {
        return this._value ?? Vector3Utils.zero();
    }

    public addComponentsRecursively(): void {
        super.addComponentsRecursively();
        super.addComponent(this._component);
    }

    public initializeAllComponents(): void {
        super.initializeAllComponents();
        this._component.x[this.uniqueId] = this.value.x;
        this._component.y[this.uniqueId] = this.value.y;
        this._component.z[this.uniqueId] = this.value.z;
    }
}
