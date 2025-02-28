import { Vector2 } from "@domain/value-objects";
import { IEntity } from "@ecs/entities";
import { TargetComponent } from "@ecs/components";
import { Vector2ComponentDecorator } from "@ecs/decorators/base";

export class TargetComponentDecorator extends Vector2ComponentDecorator {
    constructor(entity: IEntity, target: Vector2) {
        super(entity, TargetComponent, target);
    }
}
