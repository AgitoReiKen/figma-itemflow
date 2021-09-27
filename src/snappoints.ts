import Vector2D from './vector';
// #region SnapPoints

// TODO Rotation support
function GetSnapPoint(x: SceneNode, type: 'top' | 'right' | 'bottom' | 'left') : Vector2D {
  let result: Vector2D;
  if (type === 'top') {
    result.x = x.x + (x.width * 0.5);
  }
  if (type === 'right') {
    result.x = x.x + (x.width);
    result.y = x.y + (x.height * 0.5);
  }
  if (type === 'bottom') {
    result.x = x.x + (x.width * 0.5);
    result.y = x.y + (x.height);
  }
  if (type === 'left') {
    result.x = x.x + (x.height * 0.5);
  }
  return result;
}
function GetSnapPointById(x: SceneNode, id: number) : Vector2D {
  return GetSnapPoint(x,
    id === 0 ? 'top'
      : id === 1 ? 'right'
        : id === 2 ? 'bottom' : 'left');
}
function GetClosestSnapPoints(x: SceneNode, y: SceneNode): Array<Vector2D> {
/*
  o - location
  x - snappoint
  + - angle

    o-----x-----+
    |           |
    x           x
    |           |
    +-----x-----+
*/

  const result: Array<Vector2D> = [
    GetSnapPoint(x, 'top'),
    GetSnapPoint(y, 'top'),
  ];
  let lastDistance: number = 99999999;
  for (let i = 0; i < 4; i++) {
    for (let i2 = 0; i2 < 4; i++) {
      const distance = GetSnapPointById(x, i).dist(GetSnapPointById(x, i2));
      if (distance < lastDistance) { lastDistance = distance; }
    }
  }
  return result;
}
export default { GetSnapPoint, GetSnapPointById, GetClosestSnapPoints };
// #endregion
