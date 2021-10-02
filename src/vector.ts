// #region Vector
export default class Vector2D {
  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  dist(to: Vector2D): number {
    const xd = this.x - to.x;
    const yd = this.y - to.y;
    return Math.sqrt(xd * xd + yd * yd);
  }
}
// #endregion
