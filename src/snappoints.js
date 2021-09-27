// #region SnapPoints
// TODO Rotation support
function GetSnapPoint(x, type) {
    let result;
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
function GetSnapPointById(x, id) {
    return GetSnapPoint(x, id === 0 ? 'top'
        : id === 1 ? 'right'
            : id === 2 ? 'bottom' : 'left');
}
function GetClosestSnapPoints(x, y) {
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
    const result = [
        GetSnapPoint(x, 'top'),
        GetSnapPoint(y, 'top'),
    ];
    let lastDistance = 99999999;
    for (let i = 0; i < 4; i++) {
        for (let i2 = 0; i2 < 4; i++) {
            const distance = GetSnapPointById(x, i).dist(GetSnapPointById(x, i2));
            if (distance < lastDistance) {
                lastDistance = distance;
            }
        }
    }
    return result;
}
export default { GetSnapPoint, GetSnapPointById, GetClosestSnapPoints };
// #endregion
