import { ComponentType, defineComponent } from 'bitecs';
import { FloatSchema, Vector2Schema, Vector3Schema } from '../value-objects/schemas';
import { FloatComponentData, Vector2ComponentData, Vector3ComponentData } from "../value-objects/component-data";

export const PreviousPositionComponent:
    ComponentType<Vector3Schema> = defineComponent(Vector3ComponentData);
export const PositionComponent:
    ComponentType<Vector3Schema> = defineComponent(Vector3ComponentData);
export const RotationComponent:
    ComponentType<FloatSchema> = defineComponent(FloatComponentData);
export const ScaleComponent: 
    ComponentType<Vector2Schema> = defineComponent(Vector2ComponentData);