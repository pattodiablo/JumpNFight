import { Size } from "~/core/domain";
import { SizeSchema } from "@ecs/value-objects";
import { size } from "@ecs/components";
import IEntity from "@ecs/entities/IEntity";
import EntityDecorator from "./EntityDecorator";

export class SizeDecorator extends EntityDecorator<Size, SizeSchema> {

    constructor(entity: IEntity);
    constructor(entity: IEntity, value: Size | undefined);
    constructor(entity: IEntity, value?: Size) {
        super(entity, size, value);
    }

    public get value(): Size {
        return this._value ?? { width: 0, height: 0 };
    }

    public addComponentsRecursively(): void {
        super.addComponentsRecursively();
        super.addComponent(this._component);
    }

    public initializeAllComponents(): void {
        super.initializeAllComponents();
        this._component.width[this.uniqueId] = this.value.width;
        this._component.height[this.uniqueId] = this.value.height;
    }
}
