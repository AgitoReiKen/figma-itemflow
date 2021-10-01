 
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */
import { SetOnSelectionItemAdded, SetOnSelectionItemRemoved } from './selection';
import snappoints from './snappoints';
import Vector2D from './vector'; 

const PLUGIN_NAME = 'ItemFrame';
const FLOW_DATA = 'IF';
const FLOW_COORDS_DATA = 'IFC';
const FLOW_SETTINGS_DATA = 'IFS';
const FRAME_DATA = PLUGIN_NAME;
const UNDEFINED_ID = 'undefined';  
const FRAME_OFFSET = new Vector2D(-99999, -99999);
let DATA_NODE_ID = UNDEFINED_ID;

// #region Frame
function GetPluginFrame(): FrameNode {
  let found: FrameNode | any;
  if (DATA_NODE_ID !== UNDEFINED_ID) {
    found = figma.currentPage.findOne((x) => x.id === DATA_NODE_ID);
  
  } else {
    found = figma.currentPage.findOne((x) => x.getPluginData(FRAME_DATA) === '1') as FrameNode;
  }
 
  if (found === null) {
    const pluginFrame = figma.createFrame();
    pluginFrame.resize(1, 1);
    pluginFrame.x = FRAME_OFFSET.x;
    pluginFrame.y = FRAME_OFFSET.y;
    pluginFrame.locked = false;
    pluginFrame.name = PLUGIN_NAME;
    pluginFrame.clipsContent = false;
    pluginFrame.setPluginData(FRAME_DATA, '1'); 
    found = figma.currentPage.findOne((x) => x.getPluginData(FRAME_DATA) === '1') as FrameNode;
  
    DATA_NODE_ID = found.id;
  } else { 
    DATA_NODE_ID = found.id;
  }
  return found;
}

function UpdatePluginFrame(): void {
  figma.currentPage.insertChild(figma.currentPage.children.length, GetPluginFrame());
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
class FlowCoordsData { 
  snapPoints: Array<Vector2D> = [];
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
function SetFlowData(node: SceneNode, data: Array<string>) : void{
  node.setPluginData(FLOW_DATA, JSON.stringify(data));
}
function GetFlowData(node: SceneNode) : Array<string> {
  const data = node.getPluginData(FLOW_DATA); 
  if (data.length != 0) {
      const parsed = JSON.parse(data) as Array<string>;
      return parsed;
  }
  return [];
 } 
function RemoveFlows(of: SceneNode): void {
  let flows = GetPluginFrame().findChildren(x => {
    const data = GetFlowData(x);
    if (data.length === 2) {
      return data.find(x => x === of.id) !== null;
    }
    return false;
  });
  flows.forEach(x => x.remove());
}
function GetAllFlows(): Array<VectorNode> {
  return GetPluginFrame().findChildren(x => { return GetFlowData(x).length === 2; }) as Array<VectorNode>;
}
 
function GetFlow(from: SceneNode, to: SceneNode): VectorNode | null {
  return figma.currentPage.findOne(x => {
    const data = GetFlowData(x);
    if (data.length === 2) {
      return data[0] === from.id && data[1] === to.id;
    }
    return false;
  }) as VectorNode | null;
}
function UpdateFlowAppearance(flow: VectorNode) : void {
  const flowSettings = GetFlowSettings(flow);
 
  SetStrokeCap(flow, flowSettings.strokeCap[0], flowSettings.strokeCap[1]);
  flow.dashPattern = flowSettings.dashPattern;
  flow.strokeWeight = flowSettings.weight;
  const copy = JSON.parse(JSON.stringify(flow.strokes));
  
  copy[0].color.r = flowSettings.color.r;
  copy[0].color.g = flowSettings.color.g;
  copy[0].color.b = flowSettings.color.b;
  copy[0].opacity = flowSettings.color.a;
  flow.strokes = copy;
 
}
function UpdateFlow_Internal(flow: VectorNode, from: SceneNode, to: SceneNode, force: boolean): void {
  const sp = snappoints.GetClosestSnapPoints(from, to);
  const x = sp[0].x - sp[1].x;
  const y = sp[0].y - sp[1].y;
   
  const coordsData = GetFlowCoordsData(flow);
  let snapPointsChanged = true;
  // doesnt matter to calc changes if force update
  if (!force && coordsData !== null) {
  snapPointsChanged =
      coordsData.snapPoints[0].x !== sp[0].x ||
      coordsData.snapPoints[0].y !== sp[0].y ||
      coordsData.snapPoints[1].x !== sp[1].x ||
      coordsData.snapPoints[1].y !== sp[1].y;
  }
  if (snapPointsChanged) { 
    const flowX = sp[0].x - x - FRAME_OFFSET.x;
    const flowY = sp[0].y - y - FRAME_OFFSET.y; 
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

    let data: FlowCoordsData = new FlowCoordsData();
    data.snapPoints = [new Vector2D(sp[0].x, sp[0].y), new Vector2D(sp[1].x, sp[1].y)];
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
    if (from.removed) {
      RemoveFlows(from);
    }
    if (to.removed) {
      RemoveFlows(to);
    }
    if (!to.removed && !from.removed) {
      UpdateFlow_Internal(flow, from, to, force);
    }
  }
}
 
function CreateFlow(from: SceneNode, to: SceneNode, settings: FlowSettings): void {
  let svg = null;
  svg = GetFlow(from, to);
  if (svg === null) {
    svg = figma.createVector();
    GetPluginFrame().appendChild(svg);  
  }
  // Order is matter :)
  SetFlowSettings(svg, settings);
  SetFlowData(svg, [from.id, to.id]);
  UpdateFlow(svg, true);
}

// TODO Circle 
function SetStrokeCap(node: VectorNode, start: StrokeCap, end:  StrokeCap) { 
  const copy = JSON.parse(JSON.stringify(node.vectorNetwork));
  
  if ("strokeCap" in copy.vertices[copy.vertices.length - 1]) {
    copy.vertices[copy.vertices.length - 1].strokeCap = start;
    copy.vertices[0].strokeCap = end;
   
  }
  node.vectorNetwork = copy;
}
let updateFlowIntervalId = -1;
let updateFrameIntervalId = -1; 
function Enable(): void {
  GetPluginFrame().locked = true;
  updateFlowIntervalId = setInterval(() => { 
    GetAllFlows().forEach(x => {
      UpdateFlow(x);
    });
  }, 100);
   
  updateFrameIntervalId = setInterval(() => {
    UpdatePluginFrame();
  }, 1000);
  
  SetOnSelectionItemAdded((item: SceneNode) => {
   
  });

  SetOnSelectionItemRemoved((item: SceneNode) => {
    if (item.removed) {
      RemoveFlows(item);
    }
  });
}
function Disable(): void {
  if (updateFlowIntervalId !== -1) {
    clearInterval(updateFlowIntervalId);
  }
  if (updateFrameIntervalId !== -1) {
    clearInterval(updateFrameIntervalId);
  }
}
export { FlowSettings, GetPluginFrame, Enable, Disable ,CreateFlow };
