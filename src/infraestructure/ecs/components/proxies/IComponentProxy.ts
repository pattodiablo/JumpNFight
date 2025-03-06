import { ComponentType, ISchema } from "bitecs";

export interface IComponentProxy<T extends ISchema> {
    get entityId(): number;
    set entityId(value: number);
    set component(value: ComponentType<T>)
}
