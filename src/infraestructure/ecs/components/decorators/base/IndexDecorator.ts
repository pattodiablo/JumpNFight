import { ComponentType } from "bitecs";
import IEntity from "~/infraestructure/ecs/entities/IEntity";
import { IndexSchema } from "~/infraestructure/ecs/value-objects";
import EntityDecorator from "./EntityDecorator";


export class IndexDecorator extends EntityDecorator<number, IndexSchema> {

    constructor(entity: IEntity, component: ComponentType<IndexSchema>);
    constructor(entity: IEntity, component: ComponentType<IndexSchema>, id: number);
    constructor(entity: IEntity, component: ComponentType<IndexSchema>, id: number | undefined);
    constructor(entity: IEntity, component: ComponentType<IndexSchema>, id?: number) {
        super(entity, component, id);
    }

    public get value(): number {
        return this._value ?? -1;
    }

    public addComponentsRecursively(): void {
        super.addComponentsRecursively();
        super.addComponent(this._component);
    }

    public initializeAllComponents(): void {
        super.initializeAllComponents();
        this._component.id[this.uniqueId] = this.value;
    }
}
