import { createSelector } from 'reselect';
import { selectUnfilteredCartesianItems } from './axisSelectors';
import { selectBarRectangles } from './barSelectors';
var pickStackId = (state, stackId) => stackId;
var pickIsPanorama = (state, stackId, isPanorama) => isPanorama;
export var selectAllBarsInStack = createSelector([pickStackId, selectUnfilteredCartesianItems, pickIsPanorama], (stackId, allItems, isPanorama) => {
  return allItems.filter(i => i.type === 'bar').filter(i => i.stackId === stackId).filter(i => i.isPanorama === isPanorama).filter(i => !i.hide);
});
var selectAllBarIdsInStack = createSelector([selectAllBarsInStack], allBars => {
  return allBars.map(bar => bar.id);
});
/**
 * Takes two rectangles and returns a new rectangle that encompasses both.
 * It takes the minimum x and y, and the maximum width and height.
 * It handles overlapping rectangles, and rectangles with a gap between them.
 * @param rect1
 * @param rect2
 */
export var expandRectangle = (rect1, rect2) => {
  if (!rect1) {
    return rect2;
  }
  if (!rect2) {
    return rect1;
  }
  var x = Math.min(rect1.x, rect1.x + rect1.width, rect2.x, rect2.x + rect2.width);
  var y = Math.min(rect1.y, rect1.y + rect1.height, rect2.y, rect2.y + rect2.height);
  var maxX = Math.max(rect1.x, rect1.x + rect1.width, rect2.x, rect2.x + rect2.width);
  var maxY = Math.max(rect1.y, rect1.y + rect1.height, rect2.y, rect2.y + rect2.height);
  var width = maxX - x;
  var height = maxY - y;
  return {
    x,
    y,
    width,
    height
  };
};
var combineStackRects = (state, stackId, isPanorama) => {
  var allBarIds = selectAllBarIdsInStack(state, stackId, isPanorama);
  var stackRects = [];
  allBarIds.forEach(barId => {
    var rectangles = selectBarRectangles(state, barId, isPanorama, undefined);
    rectangles === null || rectangles === void 0 || rectangles.forEach(rect => {
      var rectIndex = rect.originalDataIndex;
      stackRects[rectIndex] = expandRectangle(stackRects[rectIndex], rect);
    });
  });
  return stackRects;
};
export var selectStackRects = createSelector([state => state, pickStackId, pickIsPanorama], combineStackRects);