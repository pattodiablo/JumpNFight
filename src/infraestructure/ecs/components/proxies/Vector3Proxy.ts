import { ComponentType } from "bitecs";
import { Vector2, Vector3 } from "@domain/types";
import { Vector3Schema } from "@ecs/value-objects/schemas";
import { ComponentProxy } from "./ComponentProxy";

export class Vector3Proxy extends ComponentProxy<Vector3Schema> {

    constructor(component: ComponentType<Vector3Schema>);   
    constructor(component: ComponentType<Vector3Schema>, id?: number) {
        super(component, id);
    }

    public get x(): number {
        return this._component.x[this.entityId];
    }

    public get y(): number {
        return this._component.y[this.entityId];
    }

    public get z(): number {
        return this._component.z[this.entityId];
    }

    public get vector2(): Vector2 {
        return {x:this.x, y:this.y};
    }

    public get vector3(): Vector3 {
        return {x:this.x, y:this.y, z:this.z};
    }

    public set x(value: number) {
        this._component.x[this.entityId] = value;
    }

    public set y(value: number) {
        this._component.y[this.entityId] = value;
    }

    public set z(value: number) {
        this._component.z[this.entityId] = value;
    }

    public set vector2(value: Vector2) {
        this._component.x[this.entityId] = value.x;
        this._component.y[this.entityId] = value.y;
    }

    public set vector3(value: Vector3) {
        this._component.x[this.entityId] = value.x;
        this._component.y[this.entityId] = value.y;
        this._component.z[this.entityId] = value.z;
    }
}