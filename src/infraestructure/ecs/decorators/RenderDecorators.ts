import { Size } from "@domain/value-objects";
import { IEntity } from "@ecs/entities";
import { ColorComponent, SizeComponent } from "@ecs/components";
import EntityDecorator from "./base/EntityDecorator";
import { FloatComponentDecorator } from "@ecs/decorators/base";

export class SizeComponentDecorator extends EntityDecorator {
    private _size: Size;

    constructor(entity: IEntity, size: Size) {
        super(entity);
        this._size = size;
    }

    public addComponents(): void {
        super.addComponents();
        super.addComponent(SizeComponent);
    }

    public initComponents(): void {
        super.initComponents();
        SizeComponent.width[this.id] = this._size.width;
        SizeComponent.height[this.id] = this._size.height;
    }
}

export class ColorComponentDecorator extends FloatComponentDecorator {
    constructor(entity: IEntity)
    constructor(entity: IEntity, color: number)
    constructor(entity: IEntity, color?: number) {
        super(entity, ColorComponent, color ?? 0);
    }
}
