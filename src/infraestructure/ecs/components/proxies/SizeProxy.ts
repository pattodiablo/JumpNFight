import { ComponentType } from "bitecs";
import { Size, Vector2 } from "~/domain/value-objects";
import { SizeSchema } from "../../value-objects";
import { ComponentProxy } from "./ComponentProxy";

export class SizeProxy extends ComponentProxy<SizeSchema> {

    constructor(component: ComponentType<SizeSchema>, id: number) {
        super(component, id);
    }

    //#region Getters
    public get width(): number {
        return this.component.width[this.id];
    }

    public get height(): number {
        return this.component.height[this.id];
    }

    public get value(): Size {
        return new Size(this.width, this.height);
    }

    //#endregion Getters
    //#region Setters
    public set width(value: number) {
        this.component.width[this.id] = value;
    }

    public set height(value: number) {
        this.component.height[this.id] = value;
    }

    public set value(value: Vector2) {
        this.component.width[this.id] = value.x;
        this.component.height[this.id] = value.y;
    }

}
