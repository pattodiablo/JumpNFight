import { addComponent, ComponentType, ISchema, IWorld } from "bitecs";
import IEntity from "./IEntity";

export class Entity implements IEntity {
    private readonly _id: number;
    private readonly _world: IWorld;

    constructor(id: number, world: IWorld) {
        this._id = id;
        this._world = world;
    }

    addComponent<T extends ISchema>(component: ComponentType<T>): void {
        addComponent(this._world, component, this._id);
    }

    public get uniqueId(): number {
        return this._id;
    }

    public addComponentsRecursively(): void {
    }

    public initializeAllComponents(): void {
    }
}