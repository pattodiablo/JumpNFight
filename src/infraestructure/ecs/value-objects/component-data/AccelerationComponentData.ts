import { Types } from "bitecs";
import { AccelerationSchema } from "../schemas/AccelerationSchema";


export const AccelerationComponentData: AccelerationSchema = {
    magnitude: Types.f32,
    initialSpeed: Types.f32,
};
