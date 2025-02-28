import { Shape, IBehaviours } from "@domain/models/";
import { Scene } from "../models/Scene";
import { GameObject } from "../models/GameObject";

export interface IRender extends IBehaviours {
    render(scene: Scene, shape: Shape): void
}

export default class ShapeRender implements IRender {
    public name: string;
    private _object: GameObject;

    constructor(name: string, object: GameObject) {
        this.name = name;
        this._object = object;
    }

    public render(scene: Scene, shape: Shape): void {
        this._object.clear();
        this._object.fillStyle(shape.color, 1);
        this._object.fillEllipse(0, 0, shape.size.width, shape.size.height);
        scene.add.existing(this._object);
    }
}
