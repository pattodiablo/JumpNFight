import { Acceleration } from "@domain/types";

import { AccelerationSchema } from "@ecs/value-objects/schemas";
import { acceleration }       from "@ecs/components/instances";
import IEntity                from "@ecs/entities/IEntity";

import EntityDecorator from "./EntityDecorator";

export class AccelerationDecorator extends EntityDecorator<Acceleration, AccelerationSchema> {

    constructor(entity: IEntity, value: Acceleration)
    constructor(entity: IEntity, value: Acceleration | undefined);
    constructor(entity: IEntity, value?: Acceleration) {
        super(entity, acceleration, value);
    }

    public get value(): Acceleration {
        return this._value ?? { magnitude: 0, initialSpeed: 0 };
    }

    public addComponentsRecursively(): void {
        super.addComponentsRecursively();
        super.addComponent(this._component);
    }

    public initializeAllComponents(): void {
        super.initializeAllComponents();
        this._component.magnitude[this.uniqueId] = this.value.magnitude;
        this._component.initialSpeed[this.uniqueId] = this.value.initialSpeed;
    }
}