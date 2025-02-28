// ECS
import { IWorld, ComponentType } from "bitecs";
// Entities
import { IEntity } from "../../entities/IEntity";

export default abstract class EntityDecorator implements IEntity {
    protected _entity: IEntity;

    constructor(entity: IEntity) {
        this._entity = entity;
    }

    //#region Getters

    public get id(): number {
        return this._entity.id;
    }

    public get world(): IWorld {
        return this._entity.world;
    }

    //#endregion Getters

    public addComponent(component: ComponentType<any>): void {
        this._entity.addComponent(component);
    }

    public addComponents(): void {
        this._entity.addComponents();
    }

    public initComponents(): void {
        this._entity.initComponents();
    }
}
