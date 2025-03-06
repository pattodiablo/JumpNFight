import { ComponentType } from "bitecs";
import { FloatSchema } from "@ecs/value-objects/schemas";
import { ComponentProxy } from "./ComponentProxy";

export class FloatProxy extends ComponentProxy<FloatSchema> {

    constructor(component: ComponentType<FloatSchema>);
    constructor(component: ComponentType<FloatSchema>, id?: number) {
        super(component, id);
    }

    public get value(): number {
        return this._component.value[this.entityId];
    }

    public set value(value: number) {
        this._component.value[this.entityId] = value;
    }
}
