import { Color, Size } from ".";
import { ShapeTypes } from "../enums";

export type Shape = {
    type: ShapeTypes,
    size: Size,
    color: Color
}