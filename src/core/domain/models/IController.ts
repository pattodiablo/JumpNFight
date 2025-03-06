import { IGameObject } from "./IGameObject";

export interface IController<T extends IGameObject> {
    readonly name: string;
    readonly gameObject: T;
}