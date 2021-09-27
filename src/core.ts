/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */

const PLUGIN_NAME = 'ItemFrame';
const MAIN_NODE_NAME = 'Data';
const UNDEFINED_ID = 'undefined';
const KeyMap = [
  { name: 'Left Ctrl', id: 'lctrl' },
  { name: 'Left Shift', id: 'lshift' },
];

const DATA_NODE_ID = UNDEFINED_ID;

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
function CreateFlow(from: NodeInfo, to: NodeInfo): void {

}

function ForceUpdateFlow(): void {
  const line = figma.createLine();
  const frame = figma.createFrame();
}
// #endregion
