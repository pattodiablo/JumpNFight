import { ComponentType } from "bitecs";
import { IEntity } from "@ecs/entities";
import { FloatSchema } from "@ecs/value-objects";

import EntityDecorator from "./EntityDecorator";

export class FloatComponentDecorator extends EntityDecorator {
    private _float: number;
    private _component: ComponentType<FloatSchema>;

    constructor(entity: IEntity, component: ComponentType<FloatSchema>);
    constructor(entity: IEntity, component: ComponentType<FloatSchema>, float: number );
    constructor(entity: IEntity, component: ComponentType<FloatSchema>, float?: number) {
        super(entity);
        this._float = float ?? 0;
        this._component = component;
    }

    public addComponents(): void {
        super.addComponents();
        super.addComponent(this._component);
    }

    public initComponents(): void {
        super.initComponents();
        this._component.value[this.id] = this._float;
    }
}


