import { TextAnchor, TextVerticalAnchor } from '../component/Text';
/**
 * CalculatedCartesianPosition returns horizontalAnchor and verticalAnchor
 * which work directly with an SVG text element
 * but for use in HTML context we have to translate them into CSS transform(translate)
 * so this is what this function is doing.
 *
 * horizontalPosition is type: type TextAnchor = 'start' | 'middle' | 'end' | 'inherit'
 * verticalPosition is type: type TextVerticalAnchor = 'start' | 'middle' | 'end'
 *
 * @param horizontalPosition as returned from {@link getCartesianPosition}
 * @param verticalPosition as returned from {@link getCartesianPosition}
 * @return CSS transform string
 */
export declare function cartesianPositionToCSSTranslate(horizontalPosition: TextAnchor, verticalPosition: TextVerticalAnchor): string;
