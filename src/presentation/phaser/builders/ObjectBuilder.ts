import { addEntity, IWorld } from "bitecs";

import { IGameObject } from "@domain/models";

import { Entity } from "@ecs/entities/Entity";
import IEntity    from "@ecs/entities/IEntity";

export abstract class ObjectBuilder {
    protected _entity: IEntity;

    constructor(world: IWorld) {
        const id: number = addEntity(world);
        this._entity = new Entity(id, world);
    }

    abstract build(): IGameObject; 
}
