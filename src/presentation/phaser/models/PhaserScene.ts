import { createWorld, IWorld } from "bitecs";
import { IGameObject, IScene } from "@domain/models";

export class PhaserScene extends Phaser.Scene implements IScene {
    public readonly gameObjects: Map<number, IGameObject>;
    public readonly world: IWorld;

    constructor(name: string) {
        super(name)
        this.gameObjects = new Map();
        this.world = createWorld();
    }

    public addGameObject(gameObject: IGameObject): void {
        this.gameObjects.set(gameObject.uniqueId, gameObject)
    }

    public getGameObject(id: number): IGameObject | undefined {
        return this.gameObjects.get(id);
    }

    public removeGameObject(id: number): boolean {
        return this.gameObjects.delete(id);
    }
}