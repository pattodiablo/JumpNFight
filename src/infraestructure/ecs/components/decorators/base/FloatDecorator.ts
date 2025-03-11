import { ComponentType } from "bitecs";
import { FloatSchema } from "@ecs/value-objects";
import EntityDecorator from "./EntityDecorator";
import IEntity from "@ecs/entities/IEntity";

export class FloatDecorator extends EntityDecorator<number, FloatSchema> {

    constructor(entity: IEntity, component: ComponentType<FloatSchema>);
    constructor(entity: IEntity, component: ComponentType<FloatSchema>, value: number);
    constructor(entity: IEntity, component: ComponentType<FloatSchema>, value: number | undefined);
    constructor(entity: IEntity, component: ComponentType<FloatSchema>, value?: number) {
        super(entity, component, value);
    }

    public get value(): number {
        return this._value ?? 0;
    }

    public addComponentsRecursively(): void {
        super.addComponentsRecursively();
        super.addComponent(this._component);
    }

    public initializeAllComponents(): void {
        super.initializeAllComponents();
        this._component.value[this.uniqueId] = this.value;
    }
}
