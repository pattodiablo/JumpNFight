import { ComponentType } from "bitecs";
import { IEntity } from "../../entities";
import { IntegerSchema } from "../../value-objects";
import EntityDecorator from "./EntityDecorator";


export class BooleanComponentDecorator extends EntityDecorator {
    private _boolean: boolean;
    private _component: ComponentType<IntegerSchema>;

    constructor(entity: IEntity, component: ComponentType<IntegerSchema>);
    constructor(entity: IEntity, component: ComponentType<IntegerSchema>, boolean: boolean);
    constructor(entity: IEntity, component: ComponentType<IntegerSchema>, boolean?: boolean) {
        super(entity);
        this._boolean = boolean ?? false;
        this._component = component;
    }

    public addComponents(): void {
        super.addComponents();
        super.addComponent(this._component);
    }

    public initComponents(): void {
        super.initComponents();
        this._component.value[this.id] = this._boolean ? 1 : 0;
    }
}
