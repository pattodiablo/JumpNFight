import { ComponentType } from "bitecs";
import { Vector2, Vector3 } from "~/domain/value-objects";
import { Vector3Schema } from "../../value-objects";
import { ComponentProxy } from "./ComponentProxy";

export class Vector3Proxy extends ComponentProxy<Vector3Schema> {

    constructor(component: ComponentType<Vector3Schema>, id: number) {
        super(component, id);
    }

    //#region Getters
    public get x(): number {
        return this.component.x[this.id];
    }

    public get y(): number {
        return this.component.y[this.id];
    }

    public get z(): number {
        return this.component.z[this.id];
    }

    public get vector2(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public get vector3(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    //#endregion Getters
    //#region Setters
    public set x(value: number) {
        this.component.x[this.id] = value;
    }

    public set y(value: number) {
        this.component.y[this.id] = value;
    }

    public set z(value: number) {
        this.component.z[this.id] = value;
    }

    public set vector2(value: Vector2) {
        this.component.x[this.id] = value.x;
        this.component.y[this.id] = value.y;
    }

    public set vector3(value: Vector3) {
        this.component.x[this.id] = value.x;
        this.component.y[this.id] = value.y;
        this.component.z[this.id] = value.z;
    }

}
