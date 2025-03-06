import { ComponentType } from "bitecs";
import { IndexSchema } from "../../value-objects";
import { ComponentProxy } from "./ComponentProxy";



export class IndexProxy extends ComponentProxy<IndexSchema> {

    constructor(component: ComponentType<IndexSchema>);
    constructor(component: ComponentType<IndexSchema>, id?: number) {
        super(component, id);
    }

    public get value(): number {
        return this._component.id[this.entityId];
    }

    public set value(value: number) {
        this._component.id[this.entityId] = value;
    }
}
