import { ComponentType, ISchema } from "bitecs";
import IEntity from "@ecs/entities/IEntity";

export default abstract class EntityDecorator<T, U extends ISchema> implements IEntity {
    protected _entity: IEntity;
    protected _value: T | undefined;
    protected _component: ComponentType<U>;

    constructor(entity: IEntity, component: ComponentType<U>);
    constructor(entity: IEntity, component: ComponentType<U>, value: T);
    constructor(entity: IEntity, component: ComponentType<U>, value: T | undefined);
    constructor(entity: IEntity, component: ComponentType<U>, value?: T) {
        this._entity = entity;
        this._value = value;
        this._component = component;
    }

    public get uniqueId(): number {
        return this._entity.uniqueId;
    }

    public abstract get value(): T;

    public addComponent<T extends ISchema>(component: ComponentType<T>): void {
        return this._entity.addComponent(component);
    }

    public addComponentsRecursively(): void {
        this._entity.addComponentsRecursively();
    }

    public initializeAllComponents(): void {
        this._entity.initializeAllComponents();
    }
}
