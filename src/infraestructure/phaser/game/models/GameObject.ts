import { IGameObject } from "~/domain/models/IGameObject";
import { IBehaviours } from "~/domain/models/IBehaviours";
import { Scene } from "./Scene";


export class GameObject extends Phaser.GameObjects.Graphics implements IGameObject {
    private _id: number;
    private components: Map<new (...args: any[]) => IBehaviours, IBehaviours> = new Map();
    
    constructor(id: number, scene: Scene) {
        super(scene);
        this._id = id;
    }

    public get id(): number {
        return this._id;
    }

    addBehaviuor<T extends IBehaviours>(component: T): void {
        this.components.set(component.constructor as new (...args: any[]) => T, component);
    }

    getComponent<T extends IBehaviours>(componentClass: new (...args: any[]) => T): T | undefined {
        return this.components.get(componentClass) as T | undefined;
    }

    hasComponent<T extends IBehaviours>(componentClass: new (...args: any[]) => T): boolean {
        return this.components.has(componentClass);
    }

    removeComponent<T extends IBehaviours>(componentClass: new (...args: any[]) => T): void {
        this.components.delete(componentClass);
    }
}
