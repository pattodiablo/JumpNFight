import { ComponentType, defineComponent } from "bitecs";
import { IntegerComponentData, IntegerSchema } from "../value-objects";

export const GravityComponent:
    ComponentType<IntegerSchema> = defineComponent(IntegerComponentData);