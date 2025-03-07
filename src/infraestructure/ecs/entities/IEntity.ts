import { ComponentType, ISchema } from "bitecs";

export default interface IEntity {
    readonly uniqueId: number;
    addComponent<T extends ISchema>(component: ComponentType<T>): void;
    addComponentsRecursively(): void;
    initializeAllComponents(): void;
}