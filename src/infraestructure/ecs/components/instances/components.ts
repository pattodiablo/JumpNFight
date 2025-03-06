import { ComponentType, defineComponent } from "bitecs"

import {

    AccelerationSchema,
    FloatSchema,
    IntegerSchema,
    SizeSchema,
    Vector2Schema,
    Vector3Schema, 

} from "../../value-objects/schemas"

import { 

    AccelerationComponentData,
    FloatComponentData,
    IntegerComponentData,
    SizeComponentData,
    Vector2ComponentData,
    Vector3ComponentData, 

} from "../../value-objects/component-data"

export const direction    
    : ComponentType<Vector2Schema>      
    = defineComponent(Vector2ComponentData)
    
export const velocity     
    : ComponentType<Vector2Schema>      
    = defineComponent(Vector2ComponentData)
    
export const speed        
    : ComponentType<FloatSchema>        
    = defineComponent(FloatComponentData)
    
export const target       
    : ComponentType<Vector2Schema>      
    = defineComponent(Vector2ComponentData)
    
export const hasGravity      
    : ComponentType<IntegerSchema>      
    = defineComponent(IntegerComponentData)
    
export const acceleration 
    : ComponentType<AccelerationSchema> 
    = defineComponent(AccelerationComponentData)
    
export const size         
    : ComponentType<SizeSchema>         
    = defineComponent(SizeComponentData)
    
export const color        
    : ComponentType<FloatSchema>        
    = defineComponent(FloatComponentData)
    
export const previousPosition 
    : ComponentType<Vector3Schema>      
    = defineComponent(Vector3ComponentData)
    
export const currentPosition     
    : ComponentType<Vector3Schema>      
    = defineComponent(Vector3ComponentData)
    
export const rotation     
    : ComponentType<FloatSchema>        
    = defineComponent(FloatComponentData)
    
export const scale        
    : ComponentType<Vector2Schema>      
    = defineComponent(Vector2ComponentData)