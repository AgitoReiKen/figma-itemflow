import { sign } from 'crypto';
import { pipeline } from 'stream';
import Vector2D from './vector';

// eslint-disable-next-line max-len
// type SnapPointType = 'ltop' | 'top' | 'rtop' | 'right' | 'rbottom' | 'bottom' | 'lbottom' | 'left';

type SnapPointType = 'top' | 'right' | 'bottom' | 'left';
class SnapPoint extends Vector2D {
  _type: SnapPointType

  constructor(x: number, y: number, _type: SnapPointType) {
    super(x, y);
    this._type = _type;
  }
}
// #region SnapPoints
function GetSnapPoint(x: SceneNode, _type: SnapPointType) : SnapPoint {
  const result: SnapPoint = new SnapPoint(0, 0, _type);
  const pi = 3.14 / 180;
  const radian = (x as LayoutMixin).rotation * pi;
  if (_type === 'top') {
    /*
      x` = x + (w / 2 * cos(rotation))
      y` = y - (w / 2 * sin(rotation))
    */
    result.x = x.x + (x.width * 0.5 * Math.cos(radian));
    result.y = x.y - (x.width * 0.5 * Math.sin(radian));
  }

  if (_type === 'right') {
    /*
      x` = x + (w * cos(rotation)) + (h/2 * sin(rotation))
      y` = y + (h/2 * cos(rotation)) - (w * sin(rotation))
    */
    result.x = x.x + (x.width * Math.cos(radian)) + (x.height * 0.5 * Math.sin(radian));
    result.y = x.y + (x.height * 0.5 * Math.cos(radian)) - (x.width * Math.sin(radian));
  }

  if (_type === 'bottom') {
    /*
      x` = x + (w/2 * cos(rotation)) + (h * sin(rotation))
      y` = y - (w/2 * sin(rotation)) + (h * cos(rotation))
    */
    result.x = x.x + (x.width * 0.5 * Math.cos(radian)) + (x.height * Math.sin(radian));
    result.y = x.y + (x.height * Math.cos(radian)) - (x.width * 0.5 * Math.sin(radian));
  }

  if (_type === 'left') {
    /*
      x` = x + (h/2 * sin(rotation))
      y` = y + (h/2 * cos(rotation))
    */
    result.x = x.x + (x.height * 0.5 * Math.sin(radian));
    result.y = x.y + (x.height * 0.5 * Math.cos(radian));
  }
  return result;
}
function GetSnapPointById(x: SceneNode, id: number) : SnapPoint {
  return GetSnapPoint(x,
    id === 0 ? 'top'
      : id === 1 ? 'right'
        : id === 2 ? 'bottom' : 'left');
}
function GetClosestSnapPoints(from: SceneNode, to: SceneNode): Array<SnapPoint> {
/*
  o - location / snappoint
  x - snappoint
  + - angle
  -
    o-----x-----+
    |           |
    x           x
    |           |
    +-----x-----+
                  +
*/
  const result: Array<SnapPoint> = [
    GetSnapPointById(from, 0),
    GetSnapPointById(to, 0),
  ];
  let lastDistance: number = 99999999;
  for (let i = 0; i < 4; i++) {
    const s1 = GetSnapPointById(from, i);
    for (let i2 = 0; i2 < 4; i2++) {
      const s2 = GetSnapPointById(to, i2);
      const distance = s1.dist(s2);
      if (distance < lastDistance) {
        result[0] = s1;
        result[1] = s2;
        lastDistance = distance;
      }
    }
  }
  return result;
}
export default { GetSnapPoint, GetSnapPointById, GetClosestSnapPoints };
// #endregion
