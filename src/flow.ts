 
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */
import { GetSelection, SetOnSelectionItemAdded, SetOnSelectionItemRemoved } from './selection';
import { setUncaughtExceptionCaptureCallback } from 'process';
import snappoints from './snappoints';
import Vector2D from './vector';

const PLUGIN_NAME = 'ItemFrame';
const FLOW_DATA = 'IF';
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

    console.log(`Found: ${found}`);
  if (found === null) {
    const pluginFrame = figma.createFrame();
    pluginFrame.resize(1, 1);
    pluginFrame.x = FRAME_OFFSET.x;
    pluginFrame.y = FRAME_OFFSET.y;
    pluginFrame.locked = true;
    pluginFrame.name = PLUGIN_NAME;
    pluginFrame.clipsContent = false;
    pluginFrame.setPluginData(FRAME_DATA, '1'); 
    found = figma.currentPage.findOne((x) => x.getPluginData(FRAME_DATA) === '1') as FrameNode;
    console.log(`Found2: ${found}`);
    DATA_NODE_ID = found.id;
  } else {
    console.log(`Found# : ${found}`);
    DATA_NODE_ID = found.id;
  }
  return found;
}

function UpdatePluginFrame(): void {
  figma.currentPage.insertChild(0, GetPluginFrame());
} 
// #endregion
class FlowSettings {
  strokeCap: Array<StrokeCap> = ['NONE', 'ARROW_EQUILATERAL'];
  dashPattern: Array<number> = [];
  weight: number = 1;
}
function SetPluginData(node: SceneNode, data: Array<string>) : void{
  node.setPluginData(FLOW_DATA, JSON.stringify(data));
}
function GetPluginData(node: SceneNode) : Array<string> {
  const data = node.getPluginData(FLOW_DATA);
  if (typeof (data) !== undefined) {
    const parsed = JSON.parse(data) as Array<string>;
    return parsed;
  }
  return [];
 } 
function RemoveFlows(of: SceneNode): void {
  let flows = GetPluginFrame().findChildren(x => {
    const data = GetPluginData(x);
    if (data.length === 2) {
      return data.find(x => x === of.id) !== null;
    }
    return false;
  });
  flows.forEach(x => x.remove());
}
function GetAllFlows(): Array<VectorNode> {
  return GetPluginFrame().findChildren(x => { return GetPluginData(x).length === 2; }) as Array<VectorNode>;
}
 
function GetFlow(from: SceneNode, to: SceneNode): VectorNode | null {
  return figma.currentPage.findOne(x => {
    const data = x.getPluginData(FRAME_DATA);
    if (typeof (data) !== undefined) {
      const parsed = JSON.parse(data) as string[];
      if (parsed.length === 2) {
        return parsed[0] === from.id && parsed[1] === to.id;
      }
    }
  }) as VectorNode | null;
}

// #region Flow
function UpdateFlow(flow: VectorNode): void {
  const data = GetPluginData(flow);
  const from = figma.getNodeById(data[0]) as SceneNode;
  const to = figma.getNodeById(data[1]) as SceneNode;
  if (from.removed) {
    RemoveFlows(from);
  }
  if (to.removed) {
    RemoveFlows(to);
  }
  if (!to.removed && !from.removed) {
    UpdateFlowPosition(flow, from, to);
  }
}
function UpdateFlowPosition(flow: VectorNode, from: SceneNode, to: SceneNode): void {
  const sp = snappoints.GetClosestSnapPoints(from, to);
  const x = sp[0].x - sp[1].x ;
  const y = sp[0].y - sp[1].y;
  
  flow.x = sp[0].x - x - FRAME_OFFSET.x;
  flow.y = sp[0].y - y - FRAME_OFFSET.y;
  flow.vectorPaths = [{
    windingRule: 'EVENODD',
    data: `M 0 0 L ${x} ${y} Z`,
  }]; 
}
function CreateFlow(from: SceneNode, to: SceneNode, settings: FlowSettings): void {
  let svg = null;
  svg = GetFlow(from, to);
  if (svg === null) {
    svg = figma.createVector();
    GetPluginFrame().appendChild(svg);
    svg.strokeWeight = settings.weight; 
    svg.dashPattern = settings.dashPattern;
    SetStrokeCap(svg, settings.strokeCap[0], settings.strokeCap[1]);
    SetPluginData(svg, [from.id, to.id]);
  }
   
  svg.name = `${from.name} -> ${to.name}`;
  UpdateFlowPosition(svg, from, to);
}

function SetStrokeCap(node: VectorNode, start: StrokeCap, end:  StrokeCap) { 
  const copy = JSON.parse(JSON.stringify(node.vectorNetwork));
  if ("strokeCap" in copy.vertices[copy.vertices.length - 1]) {
      copy.vertices[copy.vertices.length - 1].strokeCap = start;
      copy.vertices[0].strokeCap = end;
  }
  node.vectorNetwork = copy;
}

let lastSelection: Array<SceneNode>;
function SetEvents(): void {
  setTimeout(() => {
    const selection = GetSelection();
    GetAllFlows().forEach(x => {
      UpdateFlow(x);
    });
  }, 100);
  
  setTimeout(() => {
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
// #endregion
export { FlowSettings, SetEvents, CreateFlow };
