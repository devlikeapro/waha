export function cartesianViewBoxToTrapezoid(box) {
  if (!box) {
    return undefined;
  }
  return {
    x: box.x,
    y: box.y,
    upperWidth: 'upperWidth' in box ? box.upperWidth : box.width,
    lowerWidth: 'lowerWidth' in box ? box.lowerWidth : box.width,
    width: box.width,
    height: box.height
  };
}