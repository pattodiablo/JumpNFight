import { Vector2, Vector3 } from "@domain/value-objects";
import { IEntity } from "@ecs/entities";
import { PositionComponent, PreviousPositionComponent, RotationComponent, ScaleComponent } from "@ecs/components";
import { FloatComponentDecorator, Vector2ComponentDecorator, Vector3ComponentDecorator } from "@ecs/decorators/base";

export class PreviousPositionComponentDecorator extends Vector3ComponentDecorator {
    constructor(entity: IEntity, position: Vector3) {
        super(entity, PreviousPositionComponent, position);
    }
}

export class PositionComponentDecorator extends Vector3ComponentDecorator {
    constructor(entity: IEntity, position: Vector3) {
        super(entity, PositionComponent, position);
    }
}

export class RotationComponentDecorator extends FloatComponentDecorator {
    constructor(entity: IEntity,);
    constructor(entity: IEntity, rotation: number);
    constructor(entity: IEntity, rotation?: number) {
        super(entity, RotationComponent, rotation ?? 0);
    }
}

export class ScaleComponentDecorator extends Vector2ComponentDecorator {
    constructor(entity: IEntity, scale: Vector2) {
        super(entity, ScaleComponent, scale);
    }
}