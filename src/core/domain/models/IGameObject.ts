import { IController } from "./IController";

export interface IGameObject {
    readonly uniqueId: number;
    readonly controllerManager: IControllerManager;
}

export interface IControllerManager {
    readonly controllers: Map<abstract new (...args: any[]) => IController<IGameObject>, IController<IGameObject>>;
    
    addController<T extends IController<IGameObject>>
        (component: T): void;

    getController<T extends IController<IGameObject>>
        (componentClass: abstract new (...args: any[]) => T): T | undefined;

    hasController<T extends IController<IGameObject>>
        (componentClass: abstract new (...args: any[]) => T): boolean;

    removeController<T extends IController<IGameObject>>
        (componentClass: abstract new (...args: any[]) => T): void;
}
