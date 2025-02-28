import { ComponentType } from "bitecs";
import { Vector2Schema } from "@ecs/value-objects";
import { ComponentProxy } from "./ComponentProxy";
import { Vector2 } from "@domain/value-objects";

export class Vector2Proxy extends ComponentProxy<Vector2Schema> {

    constructor(component: ComponentType<Vector2Schema>, id: number) { 
        super(component, id);
    }

    //#region Getters

    public get x(): number {
        return this.component.x[this.id] 
    }

    public get y(): number {
        return this.component.y[this.id];
    }

    public get vector(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    //#endregion Getters

    //#region Setters

    public set x(value: number) {
        this.component.x[this.id] = value;
    }
    
    public set y(value: number) {
        this.component.y[this.id] = value;
    }

    public set vector(value: Vector2) {
        this.component.x[this.id] = value.x;
        this.component.y[this.id] = value.y;
    }

    //#endregion Setters
}
