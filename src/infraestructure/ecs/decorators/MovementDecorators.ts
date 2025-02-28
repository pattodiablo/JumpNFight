import { Vector2 } from "@domain/value-objects";
import { IEntity } from "@ecs/entities";
import { DirectionComponent, SpeedComponent, VelocityComponent } from "@ecs/components";
import { FloatComponentDecorator, Vector2ComponentDecorator } from "@ecs/decorators/base";

export class SpeedComponentDecorator extends FloatComponentDecorator {
    constructor(entity: IEntity);
    constructor(entity: IEntity, speed: number);
    constructor(entity: IEntity, speed?: number) {
        super(entity, SpeedComponent, speed ?? 0)
    }
}

export class VelocityComponentDecorator extends Vector2ComponentDecorator {
    constructor(entity: IEntity);
    constructor(entity: IEntity, velocity: Vector2);
    constructor(entity: IEntity, velocity?: Vector2) {
        super(entity, VelocityComponent, velocity ?? Vector2.zero);
    }
}

export class DirectionComponentDecorator extends Vector2ComponentDecorator {
    constructor(entity: IEntity);
    constructor(entity: IEntity, velocity: Vector2);
    constructor(entity: IEntity, direction?: Vector2) {
        super(entity, DirectionComponent, direction ?? Vector2.zero);
    }
}
