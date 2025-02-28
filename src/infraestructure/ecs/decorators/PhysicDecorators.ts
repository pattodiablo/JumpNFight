import { GravityComponent } from "../components";
import { IEntity } from "../entities";
import { BooleanComponentDecorator } from "./base";

export class GravityComponentDecorator extends BooleanComponentDecorator {
    constructor(entity: IEntity);
    constructor(entity: IEntity, hasGravity: boolean);
    constructor(entity: IEntity, hasGravity?:boolean) {
        super(entity, GravityComponent, hasGravity ?? false)
    }
}