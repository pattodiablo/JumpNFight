import { ComponentType, defineComponent } from "bitecs";
import { Vector2Schema } from '../value-objects/schemas';
import { Vector2ComponentData } from "../value-objects/component-data";

export const TargetComponent:
    ComponentType<Vector2Schema> = defineComponent(Vector2ComponentData);
    