import { Shape } from "~/core/domain/types";
import { IController } from "../models/IController";
import { IScene } from "../models/IScene";
import { IGameObject } from "../models";

export abstract class RenderControllerBase<T extends IGameObject> 
implements IController<T> {
    public readonly name: string;
    public readonly gameObject: T;

    constructor(name: string, gameObject: T) {
        this.name = name;
        this.gameObject = gameObject;
    }

    public abstract render(scene: IScene, shape: Shape): void;
}
