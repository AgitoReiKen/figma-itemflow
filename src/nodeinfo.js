// #region NodeInfo
class NodeInfo {
    constructor(id, x, y, w, h) {
        const t = this;
        t.id = id;
        t.x = x;
        t.y = y;
        t.w = w;
        t.h = h;
    }
    equal(to) {
        return this.id === to.id
            && this.x === to.x
            && this.y === to.y
            && this.w === to.w
            && this.h === to.h
            && this.r === to.r;
    }
}
function GetCurrentNodeInfo() {
    let result;
    figma.currentPage.selection.forEach((x, i) => {
        result.push(new NodeInfo(x.id, x.x, x.y, x.width, x.height));
    });
    return result;
}
const LastNodeInfo = GetCurrentNodeInfo();
// #endregion
