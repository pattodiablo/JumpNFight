import { 

    color,
    direction,
    hasGravity,
    currentPosition,
    previousPosition,
    rotation,
    scale,
    speed,
    target,
    velocity,

} from "./components";

import {
    
    FloatProxy,
    Vector2Proxy,
    Vector3Proxy,
    BooleanProxy,
    SizeProxy,
    AccelerationProxy,
    
} from "../proxies";

export const directionProxy 
    = new Vector2Proxy(direction);

export const velocityProxy 
    = new Vector2Proxy(velocity);

export const sizeProxy 
    = new SizeProxy();

export const accelerationProxy 
    = new AccelerationProxy();

export const speedProxy 
    = new FloatProxy(speed);

export const targetProxy 
    = new Vector2Proxy(target);

export const hasGravityProxy 
    = new BooleanProxy(hasGravity);

export const colorProxy 
    = new FloatProxy(color);

export const previousPositionProxy 
    = new Vector3Proxy(previousPosition);

export const currentPositionProxy 
    = new Vector3Proxy(currentPosition);

export const rotationProxy 
    = new FloatProxy(rotation);

export const scaleProxy 
    = new Vector2Proxy(scale);
