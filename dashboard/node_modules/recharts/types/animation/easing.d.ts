export declare const ACCURACY = 0.0001;
type CubicBezierTemplate = `cubic-bezier(${number},${number},${number},${number})`;
export type NamedBezier = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | CubicBezierTemplate;
type BezierInput = [NamedBezier] | [number, number, number, number];
export type BezierEasingFunction = {
    isStepper: false;
    (animationElapsedTime: number): number;
};
export declare const configBezier: (...args: BezierInput) => BezierEasingFunction;
type SpringInput = {
    /**
     * The stiffness coefficient of the spring.
     * Higher values create a more forceful, faster pull towards the target.
     */
    stiff?: number;
    /**
     * The damping coefficient (friction/resistance).
     * Higher values reduce bounciness and stop oscillation sooner. Lower values create more bounce.
     */
    damping?: number;
    /**
     * The physics simulation time step in milliseconds.
     * Determines the granularity of the baked frames. 16.67ms roughly equals a 60fps frame delta.
     */
    dt?: number;
};
/**
 * Creates a performance-optimized, progress-based spring easing function.
 * It pre-calculates ("bakes") spring physics frames upfront based on a fixed duration,
 * then returns a pure, lightweight function mapping progress (0 to 1) to the animated position.
 * This approach is ideal for low-power devices because it removes heavy physics math from the frame loop.
 */
export declare const createSpringEasing: (config?: SpringInput) => EasingFunction;
export type EasingFunction = (t: number) => number;
/**
 * @inline
 */
export type EasingInput = NamedBezier | 'spring' | EasingFunction;
export declare const createEasingFunction: (easing: EasingInput) => EasingFunction | null;
export {};
