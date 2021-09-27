/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */

import { PathArray, Svg, SVG } from '@svgdotjs/svg.js';
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
  const closestSnappoints = snappoints.GetClosestSnapPoints(from, to);
  const distance = closestSnappoints[0].dist(closestSnappoints[1]);
  let svg = SVG();
  svg = svg.viewbox(0, 0, Math.abs(from.x - to.x), Math.abs(from.y - to.y));
  svg.path(new PathArray([
    ['M', 0, 0],
    ['L', 100, 100],
    ['z'],
  ]));

  const node = figma.createNodeFromSvg(svg.toString());
  node.name = 'TEST';
  figma.currentPage.appendChild(node);
}

function ForceUpdateFlow(): void {
  const line = figma.createLine();

  const frame = figma.createFrame();
}
// #endregion
