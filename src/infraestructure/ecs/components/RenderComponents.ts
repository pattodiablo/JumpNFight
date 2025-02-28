import { ComponentType, defineComponent } from "bitecs";
import { FloatSchema, SizeSchema } from '../value-objects/schemas';
import { SizeComponentData, FloatComponentData } from "../value-objects/component-data";

export const SizeComponent:
    ComponentType<SizeSchema> = defineComponent(SizeComponentData);
export const ColorComponent:
    ComponentType<FloatSchema> = defineComponent(FloatComponentData)