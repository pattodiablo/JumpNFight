import { ISchema, ComponentType } from "bitecs";


export abstract class ComponentProxy<T extends ISchema> {
    private _component: ComponentType<T>;
    private _id: number;

    constructor(component: ComponentType<T>, id: number) {
        this._id = id;
        this._component = component;
    }

    protected get component(): ComponentType<T> {
        return this._component;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }
}
