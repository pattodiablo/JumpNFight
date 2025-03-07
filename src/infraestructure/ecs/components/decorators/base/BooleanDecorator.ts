import { ComponentType } from "bitecs";
import { IntegerSchema } from "@ecs/value-objects/schemas";
import IEntity from "@ecs/entities/IEntity";
import EntityDecorator from "./EntityDecorator";

export class BooleanDecorator extends EntityDecorator<boolean, IntegerSchema> {

    constructor(entity: IEntity, component: ComponentType<IntegerSchema>);
    constructor(entity: IEntity, component: ComponentType<IntegerSchema>, value: boolean);
    constructor(entity: IEntity, component: ComponentType<IntegerSchema>, value: boolean | undefined);
    constructor(entity: IEntity, component: ComponentType<IntegerSchema>, value?: boolean) {
        super(entity, component, value);
    }
    
    public get value(): boolean {
        return this._value ?? false;
    }

    public addComponentsRecursively(): void {
        super.addComponentsRecursively();
        super.addComponent(this._component);
    }

    public initializeAllComponents(): void {
        super.initializeAllComponents();
        this._component.value[this.uniqueId] = this.value ? 1 : 0;
    }
}
