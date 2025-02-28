import { IBehaviours } from "./IBehaviours";

export interface IGameObject {
    id: number;
    
    addBehaviuor<T extends IBehaviours>(
        component: T
    ): void;

    getComponent<T extends IBehaviours>(
        componentClass: new (...args: any[]) => T
    ): T | undefined;

    hasComponent<T extends IBehaviours>(
        componentClass: new (...args: any[]) => T
    ): boolean;

    removeComponent<T extends IBehaviours>(
        componentClass: new (...args: any[]) => T
    ): void;
}
