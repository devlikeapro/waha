import { AnimationController } from './AnimationController';
/**
 * JavaScript animations require trigger and repaint as soon as possible,
 * so this class uses the timeoutController to trigger updates as quickly as the controller allows.
 *
 * JavaScript animation progress is represented as a stream of values. The exact type depends on the animationHandle type.
 * Each individual consumer is then responsible for mapping those values onto a React component.
 */
export declare const animationControllerImpl: AnimationController;
