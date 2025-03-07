import { IGameObject } from "./IGameObject";

export interface IScene {
    readonly gameObjects: Map<number, IGameObject>;

    addGameObject(gameObject: IGameObject): void;
    getGameObject(id: number): IGameObject | undefined;
    removeGameObject(id: number): boolean;
}
