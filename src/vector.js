// #region Vector
export default class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    dist(to) {
        const xd = this.x - to.x;
        const yd = this.y - to.y;
        return Math.sqrt(xd * xd + yd * yd);
    }
}
// #endregion
