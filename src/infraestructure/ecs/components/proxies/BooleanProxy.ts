import { ComponentType } from "bitecs";
import { IntegerSchema } from "../../value-objects";
import { ComponentProxy } from "./ComponentProxy";


export class BooleanProxy extends ComponentProxy<IntegerSchema> {

    constructor(component: ComponentType<IntegerSchema>, id: number) {
        super(component, id);
    }

    //#region Getters
    public get value(): boolean {
        return this.component.value[this.id] > 0;
    }

    //#endregion Getters
    //#region Setters
    public set(value: boolean) {
        this.component.value[this.id] = value ? 1 : 0;
    }

}
