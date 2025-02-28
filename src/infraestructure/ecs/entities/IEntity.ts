// ECS
import { ComponentType, IWorld } from "bitecs";

export interface IEntity {
    addComponent(component: ComponentType<any>): void;
    addComponents(): void;
    initComponents(): void;
    get id(): number;
    get world(): IWorld;
}