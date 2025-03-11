import { ShapeTypes } from "../../enums";
import { IVisual } from "./IVisual";

export interface IShape extends IVisual  {
    type: ShapeTypes,
    color: number;
}