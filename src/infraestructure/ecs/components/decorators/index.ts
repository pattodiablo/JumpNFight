import { Vector2, Vector3 } from "@domain/types";
import IEntity from "@ecs/entities/IEntity";

import {
    
    BooleanDecorator,
    FloatDecorator,
    IndexDecorator,
    Vector2Decorator,
    Vector3Decorator,

} from "./base";

import { 

    color,
    currentPosition,
    direction,
    hasGravity,
    textureId,
    previousPosition,
    rotation,
    scale,
    speed,
    target,
    velocity,

} from "@ecs/components";

export { AccelerationDecorator, SizeDecorator } from "./base";

export class SpeedDecorator extends FloatDecorator {
    constructor(entity: IEntity);
    constructor(entity: IEntity, value: number);
    constructor(entity: IEntity, value?: number) {
        super(entity, speed, value)
    }
}

export class VelocityDecorator extends Vector2Decorator {
    constructor(entity: IEntity);
    constructor(entity: IEntity, value: Vector2);
    constructor(entity: IEntity, value?: Vector2) {
        super(entity, velocity, value);
    }
}

export class DirectionDecorator extends Vector2Decorator {
    constructor(entity: IEntity);
    constructor(entity: IEntity, value: Vector2);
    constructor(entity: IEntity, value?: Vector2) {
        super(entity, direction, value);
    }
}

export class TargetDecorator extends Vector2Decorator {
    constructor(entity: IEntity);
    constructor(entity: IEntity, value: Vector2);
    constructor(entity: IEntity, value?: Vector2) {
        super(entity, target, value);
    }
}

export class HasGravityDecorator extends BooleanDecorator {
    constructor(entity: IEntity);
    constructor(entity: IEntity, value: boolean);
    constructor(entity: IEntity, value?:boolean) {
        super(entity, hasGravity, value)
    }
}

export class ColorDecorator extends FloatDecorator {
    constructor(entity: IEntity)
    constructor(entity: IEntity, value: number)
    constructor(entity: IEntity, value?: number) {
        super(entity, color, value);
    }
}

export class PreviousPositionDecorator extends Vector3Decorator {
    constructor(entity: IEntity);
    constructor(entity: IEntity, value: Vector3);
    constructor(entity: IEntity, value?: Vector3) {
        super(entity, previousPosition, value);
    }
}

export class CurrentPositionDecorator extends Vector3Decorator {
    constructor(entity: IEntity);
    constructor(entity: IEntity, value: Vector3);
    constructor(entity: IEntity, value?: Vector3) {
        super(entity, currentPosition, value);
    }
}

export class RotationDecorator extends FloatDecorator {
    constructor(entity: IEntity,);
    constructor(entity: IEntity, value: number);
    constructor(entity: IEntity, value?: number) {
        super(entity, rotation, value);
    }
}

export class ScaleDecorator extends Vector2Decorator {
    constructor(entity: IEntity);
    constructor(entity: IEntity, value: Vector2);
    constructor(entity: IEntity, value?: Vector2) {
        super(entity, scale, value);
    }
}

export class TextureIdDecorator extends IndexDecorator {
    constructor(entity: IEntity);
    constructor(entity: IEntity, value: number);
    constructor(entity: IEntity, value?: number) {
        super(entity, textureId , value);
    }
}