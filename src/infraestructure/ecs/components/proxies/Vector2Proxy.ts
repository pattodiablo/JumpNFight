import { ComponentType } from "bitecs";
import { Vector2Schema } from "@ecs/value-objects";
import { Vector2 } from "@domain/types";
import { ComponentProxy } from "./ComponentProxy";

export class Vector2Proxy extends ComponentProxy<Vector2Schema> {

    constructor(component: ComponentType<Vector2Schema>);
    constructor(component: ComponentType<Vector2Schema>, id?: number) { 
        super(component, id);
    }

    public get x(): number {
        return this._component.x[this.entityId] 
    }

    public get y(): number {
        return this._component.y[this.entityId];
    }

    public get vector(): Vector2 {
        return {x:this.x, y:this.y};
    }

    public set x(value: number) {
        this._component.x[this.entityId] = value;
    }
    
    public set y(value: number) {
        this._component.y[this.entityId] = value;
    }

    public set vector(value: Vector2) {
        this._component.x[this.entityId] = value.x;
        this._component.y[this.entityId] = value.y;
    }
}