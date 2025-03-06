import { IGameObject, IController } from "@domain/models";
import { PhaserScene } from ".";
import { IControllerManager } from "~/core/domain/models/IGameObject";

export class ControllerManager implements IControllerManager {

    public readonly controllers: Map<
        new (...args: any[]) => IController<IGameObject>, IController<IGameObject>
    > = new Map();

    constructor() {
    }

    public addController<T extends IController<IGameObject>>(component: T): void {
        let controllerClass = component.constructor as new (...args: any[]) => IController<IGameObject>;

        const superclass = Object.getPrototypeOf(controllerClass);
        if (superclass !== Object) {
            controllerClass = superclass as new (...args: any[]) => IController<IGameObject>;
        }

        this.controllers.set(controllerClass, component);
    }

    public getController<T extends IController<IGameObject>>
    (controllerClass: new (...args: any[]) => T): T | undefined {
        const controller = this.controllers.get(controllerClass);
        return controller instanceof controllerClass ? controller as T : undefined;
    }

    public hasController<T extends IController<IGameObject>>
    (componentClass: new (...args: any[]) => T): boolean {
        return this.controllers.has(componentClass);
    }

    public removeController<T extends IController<IGameObject>>
    (componentClass: new (...args: any[]) => T): void {
        this.controllers.delete(componentClass);
    }
}

export class Graphic 
extends Phaser.GameObjects.Graphics implements IGameObject {
    public readonly uniqueId: number;
    public readonly controllerManager: IControllerManager = new ControllerManager();
    
    constructor(id: number, scene: PhaserScene) {
        super(scene);
        this.uniqueId = id;
    }
}

export class Sprite 
extends Phaser.GameObjects.Image implements IGameObject {
    public readonly uniqueId: number;
    public readonly controllerManager: IControllerManager = new ControllerManager();
    
    constructor(id: number, scene: PhaserScene) {
        super(scene, 0, 0, '');
        this.uniqueId = id;
    }
}
