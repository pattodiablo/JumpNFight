import { addComponent, ComponentType, IWorld } from "bitecs";
import { IEntity } from "@infra/ecs/entities/IEntity";

export class Entity implements IEntity {
    private _id: number;
    private _world: IWorld;

    constructor(id: number, world: IWorld) {
        this._id = id;
        this._world = world;
    }

    public get id(): number {
        return this._id;
    }

    public get world(): IWorld {
        return this._world;
    }
    
    public addComponent(component: ComponentType<any>): void {
        addComponent(this._world, component, this._id);
    }

    public addComponents(): void {
        // Nothing by now
    }

    public initComponents(): void {
        // nothing by now
    }
}