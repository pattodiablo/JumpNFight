import { createWorld, IWorld } from "bitecs";
import { IGameObject } from "~/domain/models/IGameObject";
import { IScene } from "~/domain/models/IScene";

export class Scene extends Phaser.Scene implements IScene {
    private _gameObjects: Map<number, IGameObject> = new Map();
    private _world: IWorld = createWorld();

    public get world(): IWorld {
        return this._world;
    }

    public get gameObjects(): Map<number, IGameObject> {
        return this._gameObjects;
    }

    public addGameObject(gameObject: IGameObject): void {
        this.gameObjects.set(gameObject.id, gameObject)
    }

    public getGameObject(id: number): IGameObject | undefined {
        return this._gameObjects.get(id);
    }

    public removeGameObject(id: number): boolean {
        return this.gameObjects.delete(id);
    }
}