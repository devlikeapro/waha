import * as React from 'react';
import { EasingInput } from './easing';
import { AnimationController } from './AnimationController';
type JavascriptAnimateProps = {
    animationId: string;
    animationController?: AnimationController;
    duration?: number;
    begin?: number;
    easing?: EasingInput;
    isActive?: boolean | 'auto';
    canBegin?: boolean;
    onAnimationStart?: () => void;
    onAnimationEnd?: () => void;
    children: (animationElapsedTime: number) => React.ReactNode;
};
export declare function JavascriptAnimate(outsideProps: JavascriptAnimateProps): React.ReactNode;
export {};
