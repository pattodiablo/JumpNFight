import { ComponentType } from "bitecs";
import { FloatSchema } from "../../value-objects";
import { ComponentProxy } from "./ComponentProxy";

export class FloatProxy extends ComponentProxy<FloatSchema> {

    constructor(component: ComponentType<FloatSchema>, id: number) {
        super(component, id);
    }

    //#region Getters
    
    public get value(): number {
        return this.component.value[this.id];
    }

    //#endregion Getters

    //#region Setters

    public set(value: number) {
        this.component.value[this.id] = value;
    }

    //#endregion Setters
}
