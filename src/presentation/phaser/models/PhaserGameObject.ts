import { IGameObject, IController } from "@domain/models";
import { PhaserScene } from ".";

export class PhaserGameObject 
extends Phaser.GameObjects.Graphics implements IGameObject {
    public readonly uniqueId: number;
    public readonly controllers: Map<
        new (...args: any[]) => IController<IGameObject>, IController<IGameObject>
    > = new Map();
    
    constructor(id: number, scene: PhaserScene) {
        super(scene);
        this.uniqueId = id;
    }

    getPhysicBody<T>(): T {
        return this.body as T;
    }

    addController<T extends IController<IGameObject>>(component: T): void {
        let controllerClass = component.constructor as new (...args: any[]) => IController<IGameObject>;

        const superclass = Object.getPrototypeOf(controllerClass);
        if (superclass !== Object) {
            controllerClass = superclass as new (...args: any[]) => IController<IGameObject>;
        }

        this.controllers.set(controllerClass, component);
    }

    getController<T extends IController<IGameObject>>
    (controllerClass: new (...args: any[]) => T): T | undefined {
        const controller = this.controllers.get(controllerClass);
        return controller instanceof controllerClass ? controller as T : undefined;
    }

    hasController<T extends IController<IGameObject>>
    (componentClass: new (...args: any[]) => T): boolean {
        return this.controllers.has(componentClass);
    }

    removeController<T extends IController<IGameObject>>
    (componentClass: new (...args: any[]) => T): void {
        this.controllers.delete(componentClass);
    }
}
