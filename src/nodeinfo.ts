// #region NodeInfo
class NodeInfo {
  id: string;

  x: number;

  y: number;

  w: number;

  h: number;

  r: number; // TODO

  constructor(id: string, x: number, y: number, w: number, h: number) {
    const t = this;
    t.id = id;
    t.x = x;
    t.y = y;
    t.w = w;
    t.h = h;
  }

  public equal(to: NodeInfo): boolean {
    return this.id === to.id
    && this.x === to.x
    && this.y === to.y
    && this.w === to.w
    && this.h === to.h
    && this.r === to.r;
  }
}
function GetCurrentNodeInfo(): Array<NodeInfo> {
  let result: Array<NodeInfo>;
  figma.currentPage.selection.forEach((x, i) => {
    result.push(
      new NodeInfo(
        x.id,
        x.x,
        x.y,
        x.width,
        x.height,
      ),
    );
  });
  return result;
}
const LastNodeInfo: Array<NodeInfo> = GetCurrentNodeInfo();
// #endregion
