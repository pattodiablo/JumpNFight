import { Size, Vector2 } from "@domain/types";
import { ComponentProxy } from "./ComponentProxy";
import { SizeSchema } from "@ecs/value-objects/schemas";
import { size } from "@ecs/components/instances";

export class SizeProxy extends ComponentProxy<SizeSchema> {

    constructor();
    constructor(id?: number | undefined) {
        super(size, id);
    }

    public get width(): number {
        return this._component.width[this.entityId];
    }

    public get height(): number {
        return this._component.height[this.entityId];
    }

    public get value(): Size {
        return {width:this.width, height:this.height};
    }

    public set width(value: number) {
        this._component.width[this.entityId] = value;
    }

    public set height(value: number) {
        this._component.height[this.entityId] = value;
    }

    public set value(value: Vector2) {
        this._component.width[this.entityId] = value.x;
        this._component.height[this.entityId] = value.y;
    }
}