/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */

import { setUncaughtExceptionCaptureCallback } from 'process';
import snappoints from './snappoints';
import Vector2D from './vector';

const PLUGIN_NAME = 'ItemFrame';
const MAIN_NODE_NAME = 'Data';
const UNDEFINED_ID = 'undefined';
const FLOW_START = 'FlowStart';
const FLOW_END = 'FlowEnd';
const KeyMap = [
  { name: 'Left Ctrl', id: 'lctrl' },
  { name: 'Left Shift', id: 'lshift' },
];
let DATA_NODE_ID = UNDEFINED_ID;

// #region Frame
function GetPluginFrame(): FrameNode | any {
  let found: FrameNode | any;
  if (DATA_NODE_ID === UNDEFINED_ID) {
    found = figma.currentPage.findOne((x) => x.getPluginData(MAIN_NODE_NAME) === '1') as FrameNode;
    if (typeof (found) === 'undefined') {
      const pluginFrame = figma.createFrame();
      pluginFrame.resize(0, 0);
      pluginFrame.locked = true;
      pluginFrame.name = MAIN_NODE_NAME;
      pluginFrame.clipsContent = false;
      pluginFrame.setPluginData(MAIN_NODE_NAME, '1');
      figma.currentPage.appendChild(pluginFrame);
      found = figma.currentPage.findOne((x) => x.name === MAIN_NODE_NAME) as FrameNode;
    }
    DATA_NODE_ID = found.id;
  }
  return found;
}

function UpdatePluginFrame(): void {
  figma.currentPage.insertChild(0, GetPluginFrame());
}
function UpdateFlow(): void {
  const currentNodeInfo = GetCurrentNodeInfo();
  if (currentNodeInfo.length !== LastNodeInfo.length) {

  } else {
    for (let it = 0; it < LastNodeInfo.length; it++) {
      if (!LastNodeInfo[it].equal(currentNodeInfo[it])) {
        // TODO update for current node info
      }
    }
  }
}
// #endregion

// #region Flow
function CreateFlow(from: SceneNode, to: SceneNode): void {
  console.log(from);
  console.log(to);
  const sp = snappoints.GetClosestSnapPoints(from, to);
  console.log(sp);
  const distance = sp[0].dist(sp[1]);
  console.log(distance);
  let svg = figma.createVector();
  
  console.log(sp);
  const width =  Math.abs(sp[0].x - sp[1].x);
  const height = Math.abs(sp[0].y - sp[1].y);
  console.log(`Width: ${width} | Height: ${height}`);
  
  svg.resize(width, height);
  svg.vectorPaths = [{
    windingRule: 'EVENODD',
    data: `M 0 1 L 1 0 Z`,
  }]; 
  svg.name = 'ASDASDASDASDASDAS';
  svg.strokeWeight = 2; 
  svg.strokeStyleId = 'Dash';
  svg.outlineStroke();
  if (sp[0].x < sp[1].x) {
    svg.rotation = 180;
  }
  let up = sp[0].y > sp[1].y;
  console.log(`Up: ${up}`); 
  svg.x = sp[0].x;
  svg.y = up ? sp[1].y + height : sp[1].y - height; 
  figma.currentPage.appendChild(svg); 
} 
 
function ForceUpdateFlow(): void {
  const line = figma.createLine();

  const frame = figma.createFrame();
}
// #endregion
export { CreateFlow };
