import { ISchema, ComponentType } from "bitecs";
import { IComponentProxy } from "./IComponentProxy";

export abstract class ComponentProxy<T extends ISchema> implements IComponentProxy<T> {
    protected _component: ComponentType<T>;
    private _id: number;

    constructor(component: ComponentType<T>);
    constructor(component: ComponentType<T>, id: number | undefined)
    constructor(component: ComponentType<T>, id?: number) {
        this._id = id ?? -1;
        this._component = component;
    }

    public get entityId(): number {
        return this._id;
    }

    public set entityId(value: number) {
        this._id = value;
    }

    public set component(value: ComponentType<T>) {
        this._component = value;
    }
}
