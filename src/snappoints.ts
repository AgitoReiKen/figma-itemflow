/* eslint-disable no-nested-ternary */
import Vector2D from './vector';

type SnapPointType = 'ltop' | 'top' | 'rtop' | 'right' | 'rbottom' | 'bottom' | 'lbottom' | 'left';
class SnapPoint extends Vector2D {
  _type: SnapPointType
  constructor(x: number,  y: number, _type: SnapPointType) {
    super(x, y);
    this._type = _type;
  }
}
// #region SnapPoints 
// TODO Rotation support
function GetSnapPoint(x: SceneNode, _type: SnapPointType ) : SnapPoint {
  let result: SnapPoint = new SnapPoint(0, 0, _type);
   if (_type === 'ltop') {
    result.x = x.x;
    result.y = x.y;
  }
  if (_type === 'top') {
    result.x = x.x + (x.width * 0.5);
    result.y = x.y;
  } 
  if (_type === 'rtop') {
    result.x = x.x + x.width;
    result.y = x.y;
  }
  if (_type === 'right') {
    result.x = x.x + x.width;
    result.y = x.y + (x.height * 0.5);
  }
  if (_type === 'rbottom') {
    result.x = x.x + x.width;
    result.y = x.y + x.height;
   }
  if (_type === 'bottom') {
    result.x = x.x + (x.width * 0.5);
    result.y = x.y + x.height;
  }
  if (_type === 'lbottom') {
    result.x = x.x;
    result.y = x.y + x.height;
  } 
  if (_type === 'left') {
    result.x = x.x + x.width;
    result.y = x.y + (x.height * 0.5);
  }
  return result;
}
function GetSnapPointById(x: SceneNode, id: number) : SnapPoint {
  return GetSnapPoint(x,
    id === 0 ? 'ltop'
      : id === 1 ? 'top'
        : id === 2 ? 'rtop'
          : id === 3 ? 'right'
            : id === 4 ? 'rbottom'
              : id === 5 ? 'bottom'
                : id === 6 ? 'lbottom' : 'left');
}
function GetClosestSnapPoints(from: SceneNode, to: SceneNode): Array<Vector2D> {
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
  const Map: Array<Array<SnapPointType>> = [
    ['ltop', 'rbottom'],
    ['top', 'bottom'],
    ['rtop', 'lbottom'],
    ['right', 'left'],
    ['rbottom', 'ltop'],
    ['bottom', 'top'],
    ['lbottom', 'rtop'],
    ['left', 'right'],
   
]
  const result: Array<SnapPoint> = [
    GetSnapPointById(from, 0),
    GetSnapPointById(to, 0),
  ]; 
  // on top 
  // on bottom
  // on the same 
  let lastDistance: number = 99999999;
  for (let i = 0; i < Map.length; i++) {
      const s1 = GetSnapPoint(from, Map[i][0]);
      const s2 = GetSnapPoint(to, Map[i][1])
      const distance = s1.dist(s2);
      if (distance < lastDistance) {
        result[0] = s1;
        result[1] = s2;
        lastDistance = distance;
      } 
  }
  return result;
}
export default { GetSnapPoint, GetSnapPointById, GetClosestSnapPoints };
// #endregion
