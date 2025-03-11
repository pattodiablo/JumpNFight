import { ComponentType } from "bitecs";
import { IntegerSchema } from "@ecs/value-objects/schemas";
import { ComponentProxy } from "./ComponentProxy";

export class BooleanProxy extends ComponentProxy<IntegerSchema> {

    constructor(component: ComponentType<IntegerSchema>);
    constructor(component: ComponentType<IntegerSchema>, id?: number) {
        super(component, id);
    }

    public get value(): boolean {
        return this._component.value[this.entityId] > 0;
    }

    public set value(value: boolean) {
        this._component.value[this.entityId] = value ? 1 : 0;
    }
}
