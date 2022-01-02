import { SSL_OP_EPHEMERAL_RSA } from 'constants';
import { resolve } from 'path/posix';
import { SetOnSelectionChanged, SetOnSelectionItemAdded, SetOnSelectionItemRemoved } from './selection';
import snappoints from './snappoints';
import Vector2D from './vector';

const PLUGIN_NAME = 'ItemFlow';
const FLOW_DATA = 'IF';
const FLOW_COORDS_DATA = 'IFC';
const FLOW_SETTINGS_DATA = 'IFS';
const FRAME_DATA = PLUGIN_NAME;
let PluginFrameCached: GroupNode = null;
let lastPageId = null;
// #region Frame
function ConvertPluginFrameIntoGroup(pluginFrame: FrameNode): GroupNode {
  const dummyFrame = figma.createFrame();
  dummyFrame.visible = false;
  dummyFrame.name = 'group-holder';
  dummyFrame.locked = true;
  pluginFrame.appendChild(dummyFrame);
  const created = figma.group(pluginFrame.children, figma.currentPage);
  pluginFrame.setPluginData(FRAME_DATA, '0');
  pluginFrame.remove();
  created.name = PLUGIN_NAME;
  created.setPluginData(FRAME_DATA, '1');
  return created;
}
// eslint-disable-next-line camelcase
function CreatePluginNode_Internal(): FrameNode {
  const pluginFrame = figma.createFrame();
  pluginFrame.locked = true;
  ConvertPluginFrameIntoGroup(pluginFrame);
  return figma.currentPage.findOne((x) => x.getPluginData(FRAME_DATA) === '1') as FrameNode;
}
function GetPluginNode(): GroupNode {
  const pageChanged = figma.currentPage.id || lastPageId;
  const isValidNode = function (node: SceneNode) : boolean {
    return node != null && typeof (node) !== 'undefined' && !node.removed;
  };
  const getOrCreateNode = function (): GroupNode {
    let found = figma.currentPage.findOne((x) => x.getPluginData(FRAME_DATA) === '1');

    if (!isValidNode(found)) {
      found = CreatePluginNode_Internal();
      // eslint-disable-next-line no-use-before-define
      UpdatePluginNode();
    } else if (found.type === 'FRAME') { found = ConvertPluginFrameIntoGroup(found); }

    return found as GroupNode;
  };
  if (pageChanged) {
    PluginFrameCached = getOrCreateNode();
  }
  if (PluginFrameCached === null || PluginFrameCached.removed) {
    lastPageId = figma.currentPage.id;
    PluginFrameCached = getOrCreateNode();
  }
  return PluginFrameCached;
}

function UpdatePluginNode(): void {
  const pluginNode = GetPluginNode();

  if ((pluginNode as SceneNode).type === 'FRAME') {
    ConvertPluginFrameIntoGroup((pluginNode as unknown) as FrameNode);
  }
  figma.currentPage.insertChild(figma.currentPage.children.length, pluginNode);
  pluginNode.name = PLUGIN_NAME;
}

class Color {
  r: number;

  g: number;

  b: number;

  a: number;

  constructor(r: number, g: number, b: number, a: number) {
    console.assert(r <= 1.0 && g <= 1.0 && b <= 1.0 && a <= 1.0);
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}
// #endregion
class FlowSettings {
  strokeCap: Array<StrokeCap> = ['NONE', 'ARROW_EQUILATERAL'];

  dashPattern: Array<number> = [];

  weight: number = 1;

  color: Color = new Color(0, 0, 0, 1);

  bezier: boolean = true;
}

const flowSettings: FlowSettings = new FlowSettings();
class FlowCoordsData {
  nodesAbsoluteTransform: Array<Vector2D> = [];
}
function SetFlowCoordsData(node: SceneNode, data: FlowCoordsData): void {
  node.setPluginData(FLOW_COORDS_DATA, JSON.stringify(data));
}
function GetFlowCoordsData(node: SceneNode): FlowCoordsData | null {
  const data = node.getPluginData(FLOW_COORDS_DATA);
  if (data.length !== 0) {
    const parsed = JSON.parse(data);
    return parsed as FlowCoordsData;
  }
  return null;
}
function SetFlowSettings(node: SceneNode, settings: FlowSettings): void {
  node.setPluginData(FLOW_SETTINGS_DATA, JSON.stringify(settings));
}
function GetFlowSettings(node: SceneNode): FlowSettings | null {
  const data = node.getPluginData(FLOW_SETTINGS_DATA);
  if (data.length !== 0) {
    const parsed = JSON.parse(data);
    return parsed as FlowSettings;
  }
  return null;
}
function SetFlowData(node: SceneNode, data: Array<string>) : void {
  node.setPluginData(FLOW_DATA, JSON.stringify(data));
}
function GetFlowData(node: SceneNode) : Array<string> {
  const data = node.getPluginData(FLOW_DATA);
  if (data.length !== 0) {
    const parsed = JSON.parse(data) as Array<string>;
    return parsed;
  }
  return [];
}
function RemoveFlows(of: SceneNode): void {
  const flows = GetPluginNode().findChildren((x) => {
    const data = GetFlowData(x);
    if (data.length === 2) {
      const res = typeof (data.find((y) => y === of.id)) !== 'undefined';

      return res;
    }
    return false;
  });
  flows.forEach((x) => x.remove());
}
function GetAllFlows(): Array<VectorNode> {
  return GetPluginNode().findChildren((x) => GetFlowData(x).length === 2) as Array<VectorNode>;
}
function GetFlow(from: SceneNode, to: SceneNode): VectorNode | null {
  return figma.currentPage.findOne((x) => {
    const data = GetFlowData(x);
    if (data.length === 2) {
      return data[0] === from.id && data[1] === to.id;
    }
    return false;
  }) as VectorNode | null;
}

// TODO Circle
function SetStrokeCap(node: VectorNode, start: StrokeCap, end: StrokeCap) {
  const copy = JSON.parse(JSON.stringify(node.vectorNetwork));
  if ('strokeCap' in copy.vertices[copy.vertices.length - 1]) {
    copy.vertices[copy.vertices.length - 1].strokeCap = start;
    copy.vertices[0].strokeCap = end;
  }
  node.vectorNetwork = copy;
}

function UpdateFlowAppearance(flow: VectorNode) : void {
  const _flowSettings = GetFlowSettings(flow);

  SetStrokeCap(flow, _flowSettings.strokeCap[0], _flowSettings.strokeCap[1]);
  // eslint-disable-next-line no-param-reassign
  flow.dashPattern = _flowSettings.dashPattern;
  flow.strokeWeight = _flowSettings.weight;
  const copy = JSON.parse(JSON.stringify(flow.strokes));

  copy[0].color.r = _flowSettings.color.r;
  copy[0].color.g = _flowSettings.color.g;
  copy[0].color.b = _flowSettings.color.b;
  copy[0].opacity = _flowSettings.color.a;
  flow.strokes = copy;
}
// eslint-disable-next-line camelcase
function UpdateFlow_Internal(flow: VectorNode, from: SceneNode, to: SceneNode,
  force: boolean): void {
  const fromAbsoluteTransformObject = from.absoluteTransform;
  const toAbsoluteTransformObject = to.absoluteTransform;
  const fromAbsoluteTransform = new Vector2D(
    fromAbsoluteTransformObject[0][2],
    fromAbsoluteTransformObject[1][2],
  );

  const toAbsoluteTransform = new Vector2D(
    toAbsoluteTransformObject[0][2],
    toAbsoluteTransformObject[1][2],
  );
  const coordsData = GetFlowCoordsData(flow);
  let transformChanged = true;
  if (coordsData !== null) {
    transformChanged = coordsData.nodesAbsoluteTransform[0].x !== fromAbsoluteTransform.x
    || coordsData.nodesAbsoluteTransform[0].y !== fromAbsoluteTransform.y
    || coordsData.nodesAbsoluteTransform[1].x !== toAbsoluteTransform.x
    || coordsData.nodesAbsoluteTransform[1].y !== toAbsoluteTransform.y;
  }
  // doesnt matter to calc changes if force update
  if (force || transformChanged) {
    const sp = snappoints.GetClosestSnapPoints(from, to);
    const x = sp[0].x - sp[1].x;
    const y = sp[0].y - sp[1].y;

    const flowX = sp[0].x - x;
    const flowY = sp[0].y - y;
    flow.x = flowX;
    flow.y = flowY;

    if (GetFlowSettings(flow).bezier) {
      const cX: [number, number] = [0, 0];
      const cY: [number, number] = [0, 0];

      // TODO Rotation support
      // // ENDPOINT IF FROM IS RIGHT
      // const fromRadian = (from as LayoutMixin).rotation * (3.14 / 180);
      // const toRadian = (to as LayoutMixin).rotation * (3.14 / 180);

      // if (sp[0]._type === 'right') {
      //   cX[0] = x2 * Math.cos(toRadian) + (y2 * Math.sin(toRadian));
      //   cY[0] = x2 * (2/5 * 3.14) * Math.sin(-1 * toRadian) + (y2 * Math.sin(toRadian));
      // }
      // //STARTPOINT IF TO IS LEFT
      // if (sp[1]._type === 'left') {
      //   cX[1] = x2 * Math.cos(fromRadian);
      //   cY[1] = x2 * (2/5*3.14) * Math.sin(-1 * toRadian) + y2 * 2  * Math.cos(fromRadian);
      // }
      const y2 = y * 0.5;
      const x2 = x * 0.5;
      if (sp[0]._type === 'right' || sp[0]._type === 'left') {
        cX[1] = x2;
        cY[1] = y;
      }
      if (sp[0]._type === 'top' || sp[0]._type === 'bottom') {
        cX[1] = x;
        cY[1] = y2;
      }
      if (sp[1]._type === 'right' || sp[1]._type === 'left') {
        cX[0] = x2;
        cY[0] = 0;
      }
      if (sp[1]._type === 'top' || sp[1]._type === 'bottom') {
        cX[0] = 0;
        cY[0] = y2;
      }
      flow.vectorPaths = [{
        windingRule: 'EVENODD',
        data: `M 0 0 C ${cX[0]} ${cY[0]} ${cX[1]} ${cY[1]} ${x} ${y}`,
      }];
    } else {
      flow.vectorPaths = [{
        windingRule: 'EVENODD',
        data: `M 0 0 L ${x} ${y}`,
      }];
    }

    UpdateFlowAppearance(flow);

    const data: FlowCoordsData = new FlowCoordsData();
    data.nodesAbsoluteTransform = [fromAbsoluteTransform, toAbsoluteTransform];
    SetFlowCoordsData(flow, data);

    flow.name = `${from.name} -> ${to.name}`;
  }
}

function UpdateFlow(flow: VectorNode, force: boolean = false): void {
  const data = GetFlowData(flow);
  const from = figma.getNodeById(data[0]) as SceneNode;
  const to = figma.getNodeById(data[1]) as SceneNode;

  if (from === null || to === null) {
    flow.remove();
  } else {
    const fromRemoved = from.removed;
    const toRemoved = to.removed;
    if (fromRemoved) {
      RemoveFlows(from);
    }
    if (toRemoved) {
      RemoveFlows(to);
    }
    if (!toRemoved && !fromRemoved) {
      UpdateFlow_Internal(flow, from, to, force);
    }
  }
}

function CreateFlow(from: SceneNode, to: SceneNode, settings: FlowSettings): void {
  let svg = null;
  svg = GetFlow(from, to);
  if (svg === null) {
    svg = figma.createVector();
    GetPluginNode().appendChild(svg);
  }
  // Order is matter :)
  SetFlowSettings(svg, settings);
  SetFlowData(svg, [from.id, to.id]);
  UpdateFlow(svg, true);
}

let updateFlowIntervalId = -1;
let updateFrameIntervalId = -1;
let updateIntervalsIntervalId = -1;
let enabled = false;
let update = false;
const portionLength = 100;
const portionDelay = 1000 / 30; // 30 fps
function UpdateFlowInterval(intervalMS: number = 50, force: boolean = false) {
  if (intervalMS < (portionDelay * 2)) intervalMS = portionDelay * 2;
  if (force || update) {
    if (updateFlowIntervalId !== -1) clearInterval(updateFlowIntervalId);
    updateFlowIntervalId = setInterval(() => {
      if (update) {
        // split task to portions, so user will not notice lag spikes
        const _nodes = GetAllFlows();

        if (_nodes.length > 0) {
          for (let portion = 0; portion <= _nodes.length / portionLength; portion++) {
            setTimeout(() => {
              // const now1 = Date.now();
              let start = portion * portionLength;
              let end = start + portionLength;

              if (start >= _nodes.length) {
                start = _nodes.length - 1;
              }
              if (end > _nodes.length) {
                end = _nodes.length;
              }
              const nodes = _nodes.slice(
                start,
                end,
              );
              nodes.forEach((x) => {
                if (x !== null && !x.removed) {
                  UpdateFlow(x);
                }
              });

              // const now2 = Date.now();
              // console.log(`${(now2 - now1).toString()}ms. for ${nodes.length} nodes. Cost per flow: ${((now2 - now1) / nodes.length).toFixed(2)}`);
            }, portion * portionDelay);
          }
        }
      }
    }, intervalMS);
  }
}
function UpdateIntervals() {
  const getInterval = () => {
    const { length } = GetAllFlows();
    const portions = length / portionLength;
    return length + (portions * portionDelay);
  };

  UpdateFlowInterval(getInterval(), true); // now
  updateIntervalsIntervalId = setInterval(() => {
    if (update) {
      UpdateFlowInterval(getInterval()); // each 10 seconds
    }
  }, 10000);
}

function EnableFlowEvents(): void {
  enabled = true;
  SetOnSelectionChanged((_selection: Array<SceneNode>) => {
    if (_selection.length === 2) {
      CreateFlow(_selection[0], _selection[1], flowSettings);
    }
  });
  SetOnSelectionItemAdded((item: SceneNode) => {
  });
  SetOnSelectionItemRemoved((item: SceneNode) => {
    if (item !== null && item.removed) {
      RemoveFlows(item);
    }
  });
}
function DisableFlowEvents(): void {
  enabled = false;
  SetOnSelectionChanged((_selection: Array<SceneNode>) => {
  });
  SetOnSelectionItemAdded((item: SceneNode) => {
  });
  SetOnSelectionItemRemoved((item: SceneNode) => {
  });
}
function EnableFlowUpdate(): void {
  update = true;
  UpdateIntervals();
}
function DisableFlowUpdate(): void {
  update = false;
  if (updateIntervalsIntervalId !== -1) {
    clearInterval(updateIntervalsIntervalId);
    updateIntervalsIntervalId = -1;
  }
  if (updateFlowIntervalId !== -1) {
    clearInterval(updateFlowIntervalId);
    updateFlowIntervalId = -1;
  }
}
function Enable(): void {
  // figma.ui.postMessage('Hi from flow');
  updateFrameIntervalId = setInterval(() => {
    if (enabled) {
      UpdatePluginNode();
    }
  }, 1000);
  EnableFlowEvents();
  EnableFlowUpdate();
}
function Disable(): void {
  if (updateFrameIntervalId !== -1) {
    clearInterval(updateFrameIntervalId);
    updateFrameIntervalId = -1;
  }
  DisableFlowEvents();
  DisableFlowUpdate();
}
export {
  FlowSettings, flowSettings,
  GetPluginNode,
  Enable, Disable,
  CreateFlow,
  EnableFlowEvents, DisableFlowEvents,
  EnableFlowUpdate, DisableFlowUpdate,
};
