import { ComponentType, defineComponent } from "bitecs";
import { FloatSchema, Vector2Schema } from '../value-objects/schemas';
import { FloatComponentData, Vector2ComponentData } from "../value-objects/component-data";

export const DirectionComponent:
    ComponentType<Vector2Schema> = defineComponent(Vector2ComponentData);
export const VelocityComponent:
    ComponentType<Vector2Schema> = defineComponent(Vector2ComponentData);
export const SpeedComponent:
    ComponentType<FloatSchema> = defineComponent(FloatComponentData)