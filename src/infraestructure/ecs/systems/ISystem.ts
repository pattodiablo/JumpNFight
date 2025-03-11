import { IGameObject } from "@domain/models";

export interface ISystem {
    enter(gameObject: IGameObject): void;
    update(gameObject: IGameObject): void;
    exit(gameObject: IGameObject): void;
}