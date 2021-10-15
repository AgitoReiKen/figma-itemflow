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
// TODO Frame Parent
// #region SnapPoints
function GetSnapPoint(x: SceneNode, _type: SnapPointType) : SnapPoint {
  const result: SnapPoint = new SnapPoint(0, 0, _type);
  const pi = 3.14 / 180;
  const radian = (x as LayoutMixin).rotation * pi;
  const absoluteX = x.absoluteTransform[0][2];
  const absoluteY = x.absoluteTransform[1][2];
  if (_type === 'top') {
    /*
      x` = x + (w / 2 * cos(rotation))
      y` = y - (w / 2 * sin(rotation))
    */
    result.x = absoluteX + (x.width * 0.5 * Math.cos(radian));
    result.y = absoluteY - (x.width * 0.5 * Math.sin(radian));
  }

  if (_type === 'right') {
    /*
      x` = x + (w * cos(rotation)) + (h/2 * sin(rotation))
      y` = y + (h/2 * cos(rotation)) - (w * sin(rotation))
    */
    result.x = absoluteX + (x.width * Math.cos(radian)) + (x.height * 0.5 * Math.sin(radian));
    result.y = absoluteY + (x.height * 0.5 * Math.cos(radian)) - (x.width * Math.sin(radian));
  }

  if (_type === 'bottom') {
    /*
      x` = x + (w/2 * cos(rotation)) + (h * sin(rotation))
      y` = y - (w/2 * sin(rotation)) + (h * cos(rotation))
    */
    result.x = absoluteX + (x.width * 0.5 * Math.cos(radian)) + (x.height * Math.sin(radian));
    result.y = absoluteY + (x.height * Math.cos(radian)) - (x.width * 0.5 * Math.sin(radian));
  }

  if (_type === 'left') {
    /*
      x` = x + (h/2 * sin(rotation))
      y` = y + (h/2 * cos(rotation))
    */
    result.x = absoluteX + (x.height * 0.5 * Math.sin(radian));
    result.y = absoluteY + (x.height * 0.5 * Math.cos(radian));
  }
  return result;
}
function GetSnapPoints(x: SceneNode): Array<SnapPoint> {
  const result: Array<SnapPoint> = [];
  const pi = 3.14 / 180;
  const radian = (x as LayoutMixin).rotation * pi;
  const absoluteX = x.absoluteTransform[0][2];
  const absoluteY = x.absoluteTransform[1][2];
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);
  const { height, width } = x;
  result.push(new SnapPoint(
    absoluteX + (width * 0.5 * cos),
    absoluteY - (width * 0.5 * sin),
    'top',
  ));
  result.push(new SnapPoint(
    absoluteX + (width * cos) + (height * 0.5 * sin),
    absoluteY + (height * 0.5 * cos) - (width * sin),
    'right',
  ));
  result.push(new SnapPoint(
    absoluteX + (width * 0.5 * cos) + (height * sin),
    absoluteY + (height * cos) - (width * 0.5 * sin),
    'bottom',
  ));
  result.push(new SnapPoint(
    absoluteX + (height * 0.5 * sin),
    absoluteY + (height * 0.5 * cos),
    'left',
  ));
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

  const fromSnapPoints = GetSnapPoints(from);
  const fromXSnapPoints = [fromSnapPoints[1], fromSnapPoints[3]];
  const fromYSnapPoints = [fromSnapPoints[0], fromSnapPoints[2]];
  const toSnapPoints = GetSnapPoints(to);
  const toXSnapPoints = [toSnapPoints[1], toSnapPoints[3]];
  const toYSnapPoints = [toSnapPoints[0], toSnapPoints[2]];

  const getClosestFrom = function getClosestFrom(_fromSnapPoints, _toSnapPoints)
    : [number, Array<SnapPoint>] {
    const _result: Array<SnapPoint> = [
      null, null,
    ];
    let lastDistance: number = 99999999;

    for (let i = 0; i < 2; i++) {
      // left to right
      // right to left
      const compareTo = (i + 1) % 2;
      const distance = _fromSnapPoints[i].dist(_toSnapPoints[compareTo]);
      if (distance < lastDistance) {
        _result[0] = _fromSnapPoints[i];
        _result[1] = _toSnapPoints[compareTo];
        lastDistance = distance;
      }
    }
    return [lastDistance, _result];
  };
  const closestX = getClosestFrom(fromXSnapPoints, toXSnapPoints);

  // Check closest X
  const wX = Math.abs(closestX[1][0].x - closestX[1][1].x);
  const hX = Math.abs(closestX[1][0].y - closestX[1][1].y);
  const distX = closestX[1][0].dist(closestX[1][1]);
  /*
    PREVENT THAT
                      o-----x-----+
                      |           |
                    -x           x
                    / |           |
                    | +-----x-----+
                    |
                    |
      o-----x-----+ |
      |           | /
      x           x -
      |           |
      +-----x-----+

      DO INSTEAD THAT
                      o-----x-----+
                      |           |
              /-------x           x
            /        |           |
            /         +-----x-----+
            |
            |
      o-----x-----+
      |           |
      x           x
      |           |
      +-----x-----+
  */

  const closestY = getClosestFrom(fromYSnapPoints, toYSnapPoints);
  const wY = Math.abs(closestY[1][0].x - closestY[1][1].x);
  const hY = Math.abs(closestY[1][0].y - closestY[1][1].y);
  const distY = closestY[1][0].dist(closestY[1][1]);

  const wXY = Math.abs(closestY[1][0].x - closestX[1][1].x);
  const hXY = Math.abs(closestY[1][0].y - closestX[1][1].y);
  const distXY = closestY[1][0].dist(closestX[1][1]);

  // prefer Y over X if X got bad width/height proportions
  // if good X proportions
  let closestDistance = 9999999;

  if (distX < closestDistance) closestDistance = distX;
  if (distY < closestDistance) closestDistance = distY;
  if (distXY < closestDistance) closestDistance = distXY;
  if (wX * 1.5 > hX) {
    const _from = closestX[1][0];
    const _to = closestX[1][1];
    if ((_from._type === 'right') ? _from.x < _to.x : _from.x > _to.x) {
      return [closestX[1][0], closestX[1][1]];
    }
  }
  if (hY * 2 > wY) {
    return [closestY[1][0], closestY[1][1]];
  }

  return [closestX[1][0], closestY[1][1]];
}
export default { GetSnapPoint, GetSnapPointById, GetClosestSnapPoints };
// #endregion
