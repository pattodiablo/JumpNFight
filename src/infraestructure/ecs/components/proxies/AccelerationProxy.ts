import { AccelerationSchema } from "@ecs/value-objects";
import { ComponentProxy } from "./ComponentProxy";
import { acceleration } from "@ecs/components/instances";

export class AccelerationProxy extends ComponentProxy<AccelerationSchema> {

    constructor();
    constructor(id?: number | undefined) {
        super(acceleration, id);
    }

    public get magnitude(): number {
        return this._component.magnitude[this.entityId];
    }

    public get initialSpeed(): number {
        return this._component.initialSpeed[this.entityId];
    }

    public set magnitude(value: number) {
        this._component.magnitude[this.entityId] = value;
    }

    public set initialSpeed(value: number) {
        this._component.initialSpeed[this.entityId] = value;
    }
}
