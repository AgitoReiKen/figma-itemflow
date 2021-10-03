/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const flow_1 = __webpack_require__(/*! ./flow */ "./src/flow.ts");
const selection = __importStar(__webpack_require__(/*! ./selection */ "./src/selection.ts"));
const flow = __importStar(__webpack_require__(/*! ./flow */ "./src/flow.ts"));
figma.showUI(__html__);
figma.ui.resize(300, 330);
const flowSettings = new flow.FlowSettings();
/* todo update z index */
flow.Enable();
flow.GetPluginFrame().locked = true;
selection.SetOnSelectionChanged((_selection) => {
    if (_selection.length === 2) {
        flow.CreateFlow(_selection[0], _selection[1], flowSettings);
    }
});
figma.on('close', () => {
    flow.Disable();
    figma.closePlugin();
});
figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case 'set-stroke-weight': {
            flowSettings.weight = parseInt(msg.value, 10);
            break;
        }
        case 'set-stroke-cap': {
            if (msg.value[0] !== null) {
                flowSettings.strokeCap[0] = msg.value[0];
            }
            if (msg.value[1] !== null) {
                flowSettings.strokeCap[1] = msg.value[1];
            }
            break;
        }
        case 'set-color': {
            // eslint-disable-next-line func-names
            const getColor = function getColor(pos, value) {
                return parseFloat((parseInt(value.substr(pos, 2), 16) / 0xFF).toPrecision(3));
            };
            // #ABACAD
            flowSettings.color.r = getColor(1, msg.value); // AB
            flowSettings.color.g = getColor(3, msg.value); // AC
            flowSettings.color.b = getColor(5, msg.value); // AD
            break;
        }
        case 'set-color-opacity': {
            flowSettings.color.a = msg.value;
            break;
        }
        case 'set-dash-pattern': {
            flowSettings.dashPattern = [parseInt(msg.value, 10)];
            break;
        }
        case 'set-bezier': {
            flowSettings.bezier = msg.value;
            break;
        }
        case 'set-enabled': {
            if (msg.value) {
                flow.Enable();
            }
            else {
                flow.Disable();
            }
            break;
        }
        case 'set-framelocked': {
            (0, flow_1.GetPluginFrame)().locked = msg.value;
            break;
        }
    }
};


/***/ }),

/***/ "./src/flow.ts":
/*!*********************!*\
  !*** ./src/flow.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateFlow = exports.Disable = exports.Enable = exports.GetPluginFrame = exports.FlowSettings = void 0;
const selection_1 = __webpack_require__(/*! ./selection */ "./src/selection.ts");
const snappoints_1 = __importDefault(__webpack_require__(/*! ./snappoints */ "./src/snappoints.ts"));
const vector_1 = __importDefault(__webpack_require__(/*! ./vector */ "./src/vector.ts"));
const PLUGIN_NAME = 'ItemFrame';
const FLOW_DATA = 'IF';
const FLOW_COORDS_DATA = 'IFC';
const FLOW_SETTINGS_DATA = 'IFS';
const FRAME_DATA = PLUGIN_NAME;
const UNDEFINED_ID = 'undefined';
const FRAME_OFFSET = new vector_1.default(-99999, -99999);
let DATA_NODE_ID = UNDEFINED_ID;
// #region Frame
function GetPluginFrame() {
    let found;
    if (DATA_NODE_ID !== UNDEFINED_ID) {
        found = figma.currentPage.findOne((x) => x.id === DATA_NODE_ID);
    }
    else {
        found = figma.currentPage.findOne((x) => x.getPluginData(FRAME_DATA) === '1');
    }
    if (found === null) {
        const pluginFrame = figma.createFrame();
        pluginFrame.locked = true;
        pluginFrame.setPluginData(FRAME_DATA, '1');
        found = figma.currentPage.findOne((x) => x.getPluginData(FRAME_DATA) === '1');
        DATA_NODE_ID = found.id;
        // eslint-disable-next-line no-use-before-define
        UpdatePluginFrame();
    }
    else {
        DATA_NODE_ID = found.id;
    }
    return found;
}
exports.GetPluginFrame = GetPluginFrame;
function UpdatePluginFrame() {
    const pluginFrame = GetPluginFrame();
    figma.currentPage.insertChild(figma.currentPage.children.length, pluginFrame);
    pluginFrame.resize(1, 1);
    pluginFrame.x = FRAME_OFFSET.x;
    pluginFrame.y = FRAME_OFFSET.y;
    pluginFrame.name = PLUGIN_NAME;
    pluginFrame.clipsContent = false;
}
class Color {
    constructor(r, g, b, a) {
        console.assert(r <= 1.0 && g <= 1.0 && b <= 1.0 && a <= 1.0);
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}
// #endregion
class FlowSettings {
    constructor() {
        this.strokeCap = ['NONE', 'ARROW_EQUILATERAL'];
        this.dashPattern = [];
        this.weight = 1;
        this.color = new Color(0, 0, 0, 1);
        this.bezier = true;
    }
}
exports.FlowSettings = FlowSettings;
class FlowCoordsData {
    constructor() {
        this.nodesAbsoluteTransform = [];
    }
}
function SetFlowCoordsData(node, data) {
    node.setPluginData(FLOW_COORDS_DATA, JSON.stringify(data));
}
function GetFlowCoordsData(node) {
    const data = node.getPluginData(FLOW_COORDS_DATA);
    if (data.length !== 0) {
        const parsed = JSON.parse(data);
        return parsed;
    }
    return null;
}
function SetFlowSettings(node, settings) {
    node.setPluginData(FLOW_SETTINGS_DATA, JSON.stringify(settings));
}
function GetFlowSettings(node) {
    const data = node.getPluginData(FLOW_SETTINGS_DATA);
    if (data.length !== 0) {
        const parsed = JSON.parse(data);
        return parsed;
    }
    return null;
}
function SetFlowData(node, data) {
    node.setPluginData(FLOW_DATA, JSON.stringify(data));
}
function GetFlowData(node) {
    const data = node.getPluginData(FLOW_DATA);
    if (data.length !== 0) {
        const parsed = JSON.parse(data);
        return parsed;
    }
    return [];
}
function RemoveFlows(of) {
    const flows = GetPluginFrame().findChildren((x) => {
        const data = GetFlowData(x);
        if (data.length === 2) {
            const res = typeof (data.find((y) => y === of.id)) !== 'undefined';
            return res;
        }
        return false;
    });
    flows.forEach((x) => x.remove());
}
function GetAllFlows() {
    return GetPluginFrame().findChildren((x) => GetFlowData(x).length === 2);
}
function GetFlow(from, to) {
    return figma.currentPage.findOne((x) => {
        const data = GetFlowData(x);
        if (data.length === 2) {
            return data[0] === from.id && data[1] === to.id;
        }
        return false;
    });
}
// TODO Circle
function SetStrokeCap(node, start, end) {
    const copy = JSON.parse(JSON.stringify(node.vectorNetwork));
    if ('strokeCap' in copy.vertices[copy.vertices.length - 1]) {
        copy.vertices[copy.vertices.length - 1].strokeCap = start;
        copy.vertices[0].strokeCap = end;
    }
    node.vectorNetwork = copy;
}
function UpdateFlowAppearance(flow) {
    const flowSettings = GetFlowSettings(flow);
    SetStrokeCap(flow, flowSettings.strokeCap[0], flowSettings.strokeCap[1]);
    // eslint-disable-next-line no-param-reassign
    flow.dashPattern = flowSettings.dashPattern;
    flow.strokeWeight = flowSettings.weight;
    const copy = JSON.parse(JSON.stringify(flow.strokes));
    copy[0].color.r = flowSettings.color.r;
    copy[0].color.g = flowSettings.color.g;
    copy[0].color.b = flowSettings.color.b;
    copy[0].opacity = flowSettings.color.a;
    flow.strokes = copy;
}
// eslint-disable-next-line camelcase
function UpdateFlow_Internal(flow, from, to, force) {
    const fromAbsoluteTransform = new vector_1.default(from.absoluteTransform[0][2], from.absoluteTransform[1][2]);
    const toAbsoluteTransform = new vector_1.default(to.absoluteTransform[0][2], to.absoluteTransform[1][2]);
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
        const sp = snappoints_1.default.GetClosestSnapPoints(from, to);
        const x = sp[0].x - sp[1].x;
        const y = sp[0].y - sp[1].y;
        const flowX = sp[0].x - x - FRAME_OFFSET.x;
        const flowY = sp[0].y - y - FRAME_OFFSET.y;
        flow.x = flowX;
        flow.y = flowY;
        if (GetFlowSettings(flow).bezier) {
            const cX = [0, 0];
            const cY = [0, 0];
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
        }
        else {
            flow.vectorPaths = [{
                    windingRule: 'EVENODD',
                    data: `M 0 0 L ${x} ${y}`,
                }];
        }
        UpdateFlowAppearance(flow);
        const data = new FlowCoordsData();
        data.nodesAbsoluteTransform = [fromAbsoluteTransform, toAbsoluteTransform];
        SetFlowCoordsData(flow, data);
        flow.name = `${from.name} -> ${to.name}`;
    }
}
function UpdateFlow(flow, force = false) {
    const data = GetFlowData(flow);
    const from = figma.getNodeById(data[0]);
    const to = figma.getNodeById(data[1]);
    if (from === null || to === null) {
        flow.remove();
    }
    else {
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
function CreateFlow(from, to, settings) {
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
exports.CreateFlow = CreateFlow;
let updateFlowIntervalId = -1;
let updateFrameIntervalId = -1;
let updateIntervalsIntervalId = -1;
let enabled = false;
function UpdateFlowInterval(intervalMS = 50, force = false) {
    if (intervalMS < 50)
        intervalMS = 50;
    if (force || enabled) {
        if (updateFlowIntervalId !== -1)
            clearInterval(updateFlowIntervalId);
        updateFlowIntervalId = setInterval(() => {
            if (enabled) {
                // const now1 = Date.now();
                const _nodes = GetAllFlows();
                _nodes.forEach((x) => {
                    UpdateFlow(x);
                });
                // const now2 = Date.now();
                // console.log(`${(now2 - now1).toString()}ms. for ${_nodes.length} nodes`);
            }
        }, intervalMS);
    }
}
function UpdateIntervals() {
    UpdateFlowInterval(GetAllFlows().length, true); // now
    updateIntervalsIntervalId = setInterval(() => {
        if (enabled) {
            UpdateFlowInterval(GetAllFlows().length); // each 10 seconds
        }
    }, 10000);
    updateFrameIntervalId = setInterval(() => {
        if (enabled) {
            UpdatePluginFrame();
        }
    }, 1000);
}
function Enable() {
    enabled = true;
    UpdateIntervals();
    (0, selection_1.SetOnSelectionItemAdded)((item) => {
        // Prevent main frame selecting
        if (item.id === GetPluginFrame().id) {
            figma.currentPage.selection = [];
        }
    });
    (0, selection_1.SetOnSelectionItemRemoved)((item) => {
        if (item !== null && item.removed) {
            RemoveFlows(item);
        }
    });
}
exports.Enable = Enable;
function Disable() {
    enabled = false;
    if (updateIntervalsIntervalId !== -1) {
        clearInterval(updateIntervalsIntervalId);
        updateIntervalsIntervalId = -1;
    }
    if (updateFlowIntervalId !== -1) {
        clearInterval(updateFlowIntervalId);
        updateFlowIntervalId = -1;
    }
    if (updateFrameIntervalId !== -1) {
        clearInterval(updateFrameIntervalId);
        updateFrameIntervalId = -1;
    }
}
exports.Disable = Disable;


/***/ }),

/***/ "./src/selection.ts":
/*!**************************!*\
  !*** ./src/selection.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateSelection = exports.GetSelection = exports.SetOnSelectionItemRemoved = exports.SetOnSelectionItemAdded = exports.SetOnSelectionChanged = void 0;
/* eslint-disable brace-style */
let lastSelection = [];
let OnSelectionChanged;
let OnSelectionItemRemoved;
let OnSelectionItemAdded;
function UpdateSelection() {
    const { selection } = figma.currentPage;
    const lastSelectionLength = lastSelection.length;
    const result = [];
    // removed
    if (lastSelection.length > selection.length) {
        lastSelection.forEach((x, i) => {
            const found = selection.find((y, i2) => x.id === y.id) !== undefined;
            if (found) {
                result.push(x);
            }
        });
        result.forEach((x) => {
            OnSelectionItemRemoved(x);
        });
        lastSelection = result;
    }
    // added
    else if (lastSelection.length < selection.length) {
        selection.forEach((x, i) => {
            const found = lastSelection.find((y, i2) => x.id === y.id) !== undefined;
            if (!found) {
                lastSelection.push(x);
                OnSelectionItemAdded(x);
            }
        });
    }
    // changed
    else if (selection.length === lastSelection.length && selection.length === 1) {
        if (selection[0].id !== lastSelection[0].id) {
            result.push(selection[0]);
            OnSelectionItemAdded(selection[0]);
            OnSelectionItemRemoved(lastSelection[0]);
            lastSelection = result;
        }
    }
    if (lastSelectionLength === 1 && lastSelection.length === 2) {
        OnSelectionChanged(lastSelection);
    }
}
exports.UpdateSelection = UpdateSelection;
function GetSelection() {
    return lastSelection;
}
exports.GetSelection = GetSelection;
function SetOnSelectionItemRemoved(callback) {
    OnSelectionItemRemoved = callback;
}
exports.SetOnSelectionItemRemoved = SetOnSelectionItemRemoved;
function SetOnSelectionItemAdded(callback) {
    OnSelectionItemAdded = callback;
}
exports.SetOnSelectionItemAdded = SetOnSelectionItemAdded;
function SetOnSelectionChanged(callback) {
    OnSelectionChanged = callback;
    figma.on('selectionchange', () => {
        UpdateSelection();
    });
}
exports.SetOnSelectionChanged = SetOnSelectionChanged;


/***/ }),

/***/ "./src/snappoints.ts":
/*!***************************!*\
  !*** ./src/snappoints.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const vector_1 = __importDefault(__webpack_require__(/*! ./vector */ "./src/vector.ts"));
class SnapPoint extends vector_1.default {
    constructor(x, y, _type) {
        super(x, y);
        this._type = _type;
    }
}
// TODO Frame Parent
// #region SnapPoints
function GetSnapPoint(x, _type) {
    const result = new SnapPoint(0, 0, _type);
    const pi = 3.14 / 180;
    const radian = x.rotation * pi;
    const absoluteX = x.absoluteTransform[0][2];
    const absoluteY = x.absoluteTransform[1][2];
    if (_type === 'top') {
        /*
          x` = x + (w / 2 * cos(rotation))
          y` = y - (w / 2 * sin(rotation))
        */
        result.x = absoluteX + (x.width * 0.5 * Math.cos(radian));
        result.y = absoluteY - (x.width * 0.5 * Math.sin(radian));
    }
    if (_type === 'right') {
        /*
          x` = x + (w * cos(rotation)) + (h/2 * sin(rotation))
          y` = y + (h/2 * cos(rotation)) - (w * sin(rotation))
        */
        result.x = absoluteX + (x.width * Math.cos(radian)) + (x.height * 0.5 * Math.sin(radian));
        result.y = absoluteY + (x.height * 0.5 * Math.cos(radian)) - (x.width * Math.sin(radian));
    }
    if (_type === 'bottom') {
        /*
          x` = x + (w/2 * cos(rotation)) + (h * sin(rotation))
          y` = y - (w/2 * sin(rotation)) + (h * cos(rotation))
        */
        result.x = absoluteX + (x.width * 0.5 * Math.cos(radian)) + (x.height * Math.sin(radian));
        result.y = absoluteY + (x.height * Math.cos(radian)) - (x.width * 0.5 * Math.sin(radian));
    }
    if (_type === 'left') {
        /*
          x` = x + (h/2 * sin(rotation))
          y` = y + (h/2 * cos(rotation))
        */
        result.x = absoluteX + (x.height * 0.5 * Math.sin(radian));
        result.y = absoluteY + (x.height * 0.5 * Math.cos(radian));
    }
    return result;
}
function GetSnapPoints(x) {
    const result = [];
    const pi = 3.14 / 180;
    const radian = x.rotation * pi;
    const absoluteX = x.absoluteTransform[0][2];
    const absoluteY = x.absoluteTransform[1][2];
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);
    result.push(new SnapPoint(absoluteX + (x.width * 0.5 * cos), absoluteY - (x.width * 0.5 * sin), 'top'));
    result.push(new SnapPoint(absoluteX + (x.width * cos) + (x.height * 0.5 * sin), absoluteY + (x.height * 0.5 * cos) - (x.width * sin), 'right'));
    result.push(new SnapPoint(absoluteX + (x.width * 0.5 * cos) + (x.height * sin), absoluteY + (x.height * cos) - (x.width * 0.5 * sin), 'bottom'));
    result.push(new SnapPoint(absoluteX + (x.height * 0.5 * sin), absoluteY + (x.height * 0.5 * cos), 'left'));
    return result;
}
function GetSnapPointById(x, id) {
    return GetSnapPoint(x, id === 0 ? 'top'
        : id === 1 ? 'right'
            : id === 2 ? 'bottom' : 'left');
}
function GetClosestSnapPoints(from, to) {
    /*
      o - location / snappoint
      x - snappoint
      + - angle
      -
        o-----x-----+
        |           |
        x           x
        |           |
        +-----x-----+
                      +
    */
    const fromSnapPoints = GetSnapPoints(from);
    const fromXSnapPoints = [fromSnapPoints[1], fromSnapPoints[3]];
    const fromYSnapPoints = [fromSnapPoints[0], fromSnapPoints[2]];
    const toSnapPoints = GetSnapPoints(to);
    const toXSnapPoints = [toSnapPoints[1], toSnapPoints[3]];
    const toYSnapPoints = [toSnapPoints[0], toSnapPoints[2]];
    const getClosestFrom = function getClosestFrom(_fromSnapPoints, _toSnapPoints) {
        const _result = [
            null, null,
        ];
        let lastDistance = 99999999;
        for (let i = 0; i < 2; i++) {
            for (let i2 = 0; i2 < 2; i2++) {
                const distance = _fromSnapPoints[i].dist(_toSnapPoints[i2]);
                if (distance < lastDistance) {
                    _result[0] = _fromSnapPoints[i];
                    _result[1] = _toSnapPoints[i2];
                    lastDistance = distance;
                }
            }
        }
        return [lastDistance, _result];
    };
    const closestX = getClosestFrom(fromXSnapPoints, toXSnapPoints);
    // Check closest X
    const wX = Math.abs(closestX[1][0].x - closestX[1][1].x);
    const hX = Math.abs(closestX[1][0].y - closestX[1][1].y);
    const distX = closestX[1][0].dist(closestX[1][1]);
    /*
      PREVENT THAT
                        o-----x-----+
                        |           |
                      -x           x
                      / |           |
                      | +-----x-----+
                      |
                      |
        o-----x-----+ |
        |           | /
        x           x -
        |           |
        +-----x-----+
  
        DO INSTEAD THAT
                        o-----x-----+
                        |           |
                /-------x           x
              /        |           |
              /         +-----x-----+
              |
              |
        o-----x-----+
        |           |
        x           x
        |           |
        +-----x-----+
    */
    const closestY = getClosestFrom(fromYSnapPoints, toYSnapPoints);
    const wY = Math.abs(closestY[1][0].x - closestY[1][1].x);
    const hY = Math.abs(closestY[1][0].y - closestY[1][1].y);
    const distY = closestY[1][0].dist(closestY[1][1]);
    const wXY = Math.abs(closestY[1][0].x - closestX[1][1].x);
    const hXY = Math.abs(closestY[1][0].y - closestX[1][1].y);
    const distXY = closestY[1][0].dist(closestX[1][1]);
    // prefer Y over X if X got bad width/height proportions
    // if good X proportions
    let closestDistance = 9999999;
    if (distX < closestDistance)
        closestDistance = distX;
    if (distY < closestDistance)
        closestDistance = distY;
    if (distXY < closestDistance)
        closestDistance = distXY;
    if (wX * 1.5 > hX) {
        const _from = closestX[1][0];
        const _to = closestX[1][1];
        if ((_from._type === 'right') ? _from.x < _to.x : _from.x > _to.x) {
            return [closestX[1][0], closestX[1][1]];
        }
    }
    if (hY * 2 > wY) {
        return [closestY[1][0], closestY[1][1]];
    }
    return [closestX[1][0], closestY[1][1]];
}
exports["default"] = { GetSnapPoint, GetSnapPointById, GetClosestSnapPoints };
// #endregion


/***/ }),

/***/ "./src/vector.ts":
/*!***********************!*\
  !*** ./src/vector.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
// #region Vector
class Vector2D {
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
exports["default"] = Vector2D;
// #endregion


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/code.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0EsbUNBQW1DLG9DQUFvQyxnQkFBZ0I7QUFDdkYsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSwwQ0FBMEMsNEJBQTRCO0FBQ3RFLENBQUM7QUFDRDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxlQUFlLG1CQUFPLENBQUMsNkJBQVE7QUFDL0IsK0JBQStCLG1CQUFPLENBQUMsdUNBQWE7QUFDcEQsMEJBQTBCLG1CQUFPLENBQUMsNkJBQVE7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDtBQUMzRCwyREFBMkQ7QUFDM0QsMkRBQTJEO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDM0ZhO0FBQ2I7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsa0JBQWtCLEdBQUcsZUFBZSxHQUFHLGNBQWMsR0FBRyxzQkFBc0IsR0FBRyxvQkFBb0I7QUFDckcsb0JBQW9CLG1CQUFPLENBQUMsdUNBQWE7QUFDekMscUNBQXFDLG1CQUFPLENBQUMseUNBQWM7QUFDM0QsaUNBQWlDLG1CQUFPLENBQUMsaUNBQVU7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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bWEvLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9pdGVtZmxvdy1maWdtYS8uL3NyYy9mbG93LnRzIiwid2VicGFjazovL2l0ZW1mbG93LWZpZ21hLy4vc3JjL3NlbGVjdGlvbi50cyIsIndlYnBhY2s6Ly9pdGVtZmxvdy1maWdtYS8uL3NyYy9zbmFwcG9pbnRzLnRzIiwid2VicGFjazovL2l0ZW1mbG93LWZpZ21hLy4vc3JjL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly9pdGVtZmxvdy1maWdtYS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9pdGVtZmxvdy1maWdtYS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2l0ZW1mbG93LWZpZ21hL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9pdGVtZmxvdy1maWdtYS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufSk7XHJcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGZsb3dfMSA9IHJlcXVpcmUoXCIuL2Zsb3dcIik7XHJcbmNvbnN0IHNlbGVjdGlvbiA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9zZWxlY3Rpb25cIikpO1xyXG5jb25zdCBmbG93ID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2Zsb3dcIikpO1xyXG5maWdtYS5zaG93VUkoX19odG1sX18pO1xyXG5maWdtYS51aS5yZXNpemUoMzAwLCAzMzApO1xyXG5jb25zdCBmbG93U2V0dGluZ3MgPSBuZXcgZmxvdy5GbG93U2V0dGluZ3MoKTtcclxuLyogdG9kbyB1cGRhdGUgeiBpbmRleCAqL1xyXG5mbG93LkVuYWJsZSgpO1xyXG5mbG93LkdldFBsdWdpbkZyYW1lKCkubG9ja2VkID0gdHJ1ZTtcclxuc2VsZWN0aW9uLlNldE9uU2VsZWN0aW9uQ2hhbmdlZCgoX3NlbGVjdGlvbikgPT4ge1xyXG4gICAgaWYgKF9zZWxlY3Rpb24ubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgZmxvdy5DcmVhdGVGbG93KF9zZWxlY3Rpb25bMF0sIF9zZWxlY3Rpb25bMV0sIGZsb3dTZXR0aW5ncyk7XHJcbiAgICB9XHJcbn0pO1xyXG5maWdtYS5vbignY2xvc2UnLCAoKSA9PiB7XHJcbiAgICBmbG93LkRpc2FibGUoKTtcclxuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbn0pO1xyXG5maWdtYS51aS5vbm1lc3NhZ2UgPSAobXNnKSA9PiB7XHJcbiAgICBzd2l0Y2ggKG1zZy50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnc2V0LXN0cm9rZS13ZWlnaHQnOiB7XHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy53ZWlnaHQgPSBwYXJzZUludChtc2cudmFsdWUsIDEwKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgJ3NldC1zdHJva2UtY2FwJzoge1xyXG4gICAgICAgICAgICBpZiAobXNnLnZhbHVlWzBdICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBmbG93U2V0dGluZ3Muc3Ryb2tlQ2FwWzBdID0gbXNnLnZhbHVlWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChtc2cudmFsdWVbMV0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGZsb3dTZXR0aW5ncy5zdHJva2VDYXBbMV0gPSBtc2cudmFsdWVbMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgJ3NldC1jb2xvcic6IHtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcclxuICAgICAgICAgICAgY29uc3QgZ2V0Q29sb3IgPSBmdW5jdGlvbiBnZXRDb2xvcihwb3MsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCgocGFyc2VJbnQodmFsdWUuc3Vic3RyKHBvcywgMiksIDE2KSAvIDB4RkYpLnRvUHJlY2lzaW9uKDMpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gI0FCQUNBRFxyXG4gICAgICAgICAgICBmbG93U2V0dGluZ3MuY29sb3IuciA9IGdldENvbG9yKDEsIG1zZy52YWx1ZSk7IC8vIEFCXHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy5jb2xvci5nID0gZ2V0Q29sb3IoMywgbXNnLnZhbHVlKTsgLy8gQUNcclxuICAgICAgICAgICAgZmxvd1NldHRpbmdzLmNvbG9yLmIgPSBnZXRDb2xvcig1LCBtc2cudmFsdWUpOyAvLyBBRFxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnc2V0LWNvbG9yLW9wYWNpdHknOiB7XHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy5jb2xvci5hID0gbXNnLnZhbHVlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnc2V0LWRhc2gtcGF0dGVybic6IHtcclxuICAgICAgICAgICAgZmxvd1NldHRpbmdzLmRhc2hQYXR0ZXJuID0gW3BhcnNlSW50KG1zZy52YWx1ZSwgMTApXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgJ3NldC1iZXppZXInOiB7XHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy5iZXppZXIgPSBtc2cudmFsdWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlICdzZXQtZW5hYmxlZCc6IHtcclxuICAgICAgICAgICAgaWYgKG1zZy52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgZmxvdy5FbmFibGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZsb3cuRGlzYWJsZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlICdzZXQtZnJhbWVsb2NrZWQnOiB7XHJcbiAgICAgICAgICAgICgwLCBmbG93XzEuR2V0UGx1Z2luRnJhbWUpKCkubG9ja2VkID0gbXNnLnZhbHVlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuQ3JlYXRlRmxvdyA9IGV4cG9ydHMuRGlzYWJsZSA9IGV4cG9ydHMuRW5hYmxlID0gZXhwb3J0cy5HZXRQbHVnaW5GcmFtZSA9IGV4cG9ydHMuRmxvd1NldHRpbmdzID0gdm9pZCAwO1xyXG5jb25zdCBzZWxlY3Rpb25fMSA9IHJlcXVpcmUoXCIuL3NlbGVjdGlvblwiKTtcclxuY29uc3Qgc25hcHBvaW50c18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3NuYXBwb2ludHNcIikpO1xyXG5jb25zdCB2ZWN0b3JfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi92ZWN0b3JcIikpO1xyXG5jb25zdCBQTFVHSU5fTkFNRSA9ICdJdGVtRnJhbWUnO1xyXG5jb25zdCBGTE9XX0RBVEEgPSAnSUYnO1xyXG5jb25zdCBGTE9XX0NPT1JEU19EQVRBID0gJ0lGQyc7XHJcbmNvbnN0IEZMT1dfU0VUVElOR1NfREFUQSA9ICdJRlMnO1xyXG5jb25zdCBGUkFNRV9EQVRBID0gUExVR0lOX05BTUU7XHJcbmNvbnN0IFVOREVGSU5FRF9JRCA9ICd1bmRlZmluZWQnO1xyXG5jb25zdCBGUkFNRV9PRkZTRVQgPSBuZXcgdmVjdG9yXzEuZGVmYXVsdCgtOTk5OTksIC05OTk5OSk7XHJcbmxldCBEQVRBX05PREVfSUQgPSBVTkRFRklORURfSUQ7XHJcbi8vICNyZWdpb24gRnJhbWVcclxuZnVuY3Rpb24gR2V0UGx1Z2luRnJhbWUoKSB7XHJcbiAgICBsZXQgZm91bmQ7XHJcbiAgICBpZiAoREFUQV9OT0RFX0lEICE9PSBVTkRFRklORURfSUQpIHtcclxuICAgICAgICBmb3VuZCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUoKHgpID0+IHguaWQgPT09IERBVEFfTk9ERV9JRCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmb3VuZCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUoKHgpID0+IHguZ2V0UGx1Z2luRGF0YShGUkFNRV9EQVRBKSA9PT0gJzEnKTtcclxuICAgIH1cclxuICAgIGlmIChmb3VuZCA9PT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IHBsdWdpbkZyYW1lID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcclxuICAgICAgICBwbHVnaW5GcmFtZS5sb2NrZWQgPSB0cnVlO1xyXG4gICAgICAgIHBsdWdpbkZyYW1lLnNldFBsdWdpbkRhdGEoRlJBTUVfREFUQSwgJzEnKTtcclxuICAgICAgICBmb3VuZCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUoKHgpID0+IHguZ2V0UGx1Z2luRGF0YShGUkFNRV9EQVRBKSA9PT0gJzEnKTtcclxuICAgICAgICBEQVRBX05PREVfSUQgPSBmb3VuZC5pZDtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlLWJlZm9yZS1kZWZpbmVcclxuICAgICAgICBVcGRhdGVQbHVnaW5GcmFtZSgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgREFUQV9OT0RFX0lEID0gZm91bmQuaWQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZm91bmQ7XHJcbn1cclxuZXhwb3J0cy5HZXRQbHVnaW5GcmFtZSA9IEdldFBsdWdpbkZyYW1lO1xyXG5mdW5jdGlvbiBVcGRhdGVQbHVnaW5GcmFtZSgpIHtcclxuICAgIGNvbnN0IHBsdWdpbkZyYW1lID0gR2V0UGx1Z2luRnJhbWUoKTtcclxuICAgIGZpZ21hLmN1cnJlbnRQYWdlLmluc2VydENoaWxkKGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmxlbmd0aCwgcGx1Z2luRnJhbWUpO1xyXG4gICAgcGx1Z2luRnJhbWUucmVzaXplKDEsIDEpO1xyXG4gICAgcGx1Z2luRnJhbWUueCA9IEZSQU1FX09GRlNFVC54O1xyXG4gICAgcGx1Z2luRnJhbWUueSA9IEZSQU1FX09GRlNFVC55O1xyXG4gICAgcGx1Z2luRnJhbWUubmFtZSA9IFBMVUdJTl9OQU1FO1xyXG4gICAgcGx1Z2luRnJhbWUuY2xpcHNDb250ZW50ID0gZmFsc2U7XHJcbn1cclxuY2xhc3MgQ29sb3Ige1xyXG4gICAgY29uc3RydWN0b3IociwgZywgYiwgYSkge1xyXG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KHIgPD0gMS4wICYmIGcgPD0gMS4wICYmIGIgPD0gMS4wICYmIGEgPD0gMS4wKTtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgfVxyXG59XHJcbi8vICNlbmRyZWdpb25cclxuY2xhc3MgRmxvd1NldHRpbmdzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuc3Ryb2tlQ2FwID0gWydOT05FJywgJ0FSUk9XX0VRVUlMQVRFUkFMJ107XHJcbiAgICAgICAgdGhpcy5kYXNoUGF0dGVybiA9IFtdO1xyXG4gICAgICAgIHRoaXMud2VpZ2h0ID0gMTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gbmV3IENvbG9yKDAsIDAsIDAsIDEpO1xyXG4gICAgICAgIHRoaXMuYmV6aWVyID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkZsb3dTZXR0aW5ncyA9IEZsb3dTZXR0aW5ncztcclxuY2xhc3MgRmxvd0Nvb3Jkc0RhdGEge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5ub2Rlc0Fic29sdXRlVHJhbnNmb3JtID0gW107XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gU2V0Rmxvd0Nvb3Jkc0RhdGEobm9kZSwgZGF0YSkge1xyXG4gICAgbm9kZS5zZXRQbHVnaW5EYXRhKEZMT1dfQ09PUkRTX0RBVEEsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxufVxyXG5mdW5jdGlvbiBHZXRGbG93Q29vcmRzRGF0YShub2RlKSB7XHJcbiAgICBjb25zdCBkYXRhID0gbm9kZS5nZXRQbHVnaW5EYXRhKEZMT1dfQ09PUkRTX0RBVEEpO1xyXG4gICAgaWYgKGRhdGEubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuZnVuY3Rpb24gU2V0Rmxvd1NldHRpbmdzKG5vZGUsIHNldHRpbmdzKSB7XHJcbiAgICBub2RlLnNldFBsdWdpbkRhdGEoRkxPV19TRVRUSU5HU19EQVRBLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xyXG59XHJcbmZ1bmN0aW9uIEdldEZsb3dTZXR0aW5ncyhub2RlKSB7XHJcbiAgICBjb25zdCBkYXRhID0gbm9kZS5nZXRQbHVnaW5EYXRhKEZMT1dfU0VUVElOR1NfREFUQSk7XHJcbiAgICBpZiAoZGF0YS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZWQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5mdW5jdGlvbiBTZXRGbG93RGF0YShub2RlLCBkYXRhKSB7XHJcbiAgICBub2RlLnNldFBsdWdpbkRhdGEoRkxPV19EQVRBLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbn1cclxuZnVuY3Rpb24gR2V0Rmxvd0RhdGEobm9kZSkge1xyXG4gICAgY29uc3QgZGF0YSA9IG5vZGUuZ2V0UGx1Z2luRGF0YShGTE9XX0RBVEEpO1xyXG4gICAgaWYgKGRhdGEubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtdO1xyXG59XHJcbmZ1bmN0aW9uIFJlbW92ZUZsb3dzKG9mKSB7XHJcbiAgICBjb25zdCBmbG93cyA9IEdldFBsdWdpbkZyYW1lKCkuZmluZENoaWxkcmVuKCh4KSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IEdldEZsb3dEYXRhKHgpO1xyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICBjb25zdCByZXMgPSB0eXBlb2YgKGRhdGEuZmluZCgoeSkgPT4geSA9PT0gb2YuaWQpKSAhPT0gJ3VuZGVmaW5lZCc7XHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG4gICAgZmxvd3MuZm9yRWFjaCgoeCkgPT4geC5yZW1vdmUoKSk7XHJcbn1cclxuZnVuY3Rpb24gR2V0QWxsRmxvd3MoKSB7XHJcbiAgICByZXR1cm4gR2V0UGx1Z2luRnJhbWUoKS5maW5kQ2hpbGRyZW4oKHgpID0+IEdldEZsb3dEYXRhKHgpLmxlbmd0aCA9PT0gMik7XHJcbn1cclxuZnVuY3Rpb24gR2V0Rmxvdyhmcm9tLCB0bykge1xyXG4gICAgcmV0dXJuIGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUoKHgpID0+IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gR2V0Rmxvd0RhdGEoeCk7XHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhWzBdID09PSBmcm9tLmlkICYmIGRhdGFbMV0gPT09IHRvLmlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9KTtcclxufVxyXG4vLyBUT0RPIENpcmNsZVxyXG5mdW5jdGlvbiBTZXRTdHJva2VDYXAobm9kZSwgc3RhcnQsIGVuZCkge1xyXG4gICAgY29uc3QgY29weSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobm9kZS52ZWN0b3JOZXR3b3JrKSk7XHJcbiAgICBpZiAoJ3N0cm9rZUNhcCcgaW4gY29weS52ZXJ0aWNlc1tjb3B5LnZlcnRpY2VzLmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgICAgY29weS52ZXJ0aWNlc1tjb3B5LnZlcnRpY2VzLmxlbmd0aCAtIDFdLnN0cm9rZUNhcCA9IHN0YXJ0O1xyXG4gICAgICAgIGNvcHkudmVydGljZXNbMF0uc3Ryb2tlQ2FwID0gZW5kO1xyXG4gICAgfVxyXG4gICAgbm9kZS52ZWN0b3JOZXR3b3JrID0gY29weTtcclxufVxyXG5mdW5jdGlvbiBVcGRhdGVGbG93QXBwZWFyYW5jZShmbG93KSB7XHJcbiAgICBjb25zdCBmbG93U2V0dGluZ3MgPSBHZXRGbG93U2V0dGluZ3MoZmxvdyk7XHJcbiAgICBTZXRTdHJva2VDYXAoZmxvdywgZmxvd1NldHRpbmdzLnN0cm9rZUNhcFswXSwgZmxvd1NldHRpbmdzLnN0cm9rZUNhcFsxXSk7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICAgIGZsb3cuZGFzaFBhdHRlcm4gPSBmbG93U2V0dGluZ3MuZGFzaFBhdHRlcm47XHJcbiAgICBmbG93LnN0cm9rZVdlaWdodCA9IGZsb3dTZXR0aW5ncy53ZWlnaHQ7XHJcbiAgICBjb25zdCBjb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShmbG93LnN0cm9rZXMpKTtcclxuICAgIGNvcHlbMF0uY29sb3IuciA9IGZsb3dTZXR0aW5ncy5jb2xvci5yO1xyXG4gICAgY29weVswXS5jb2xvci5nID0gZmxvd1NldHRpbmdzLmNvbG9yLmc7XHJcbiAgICBjb3B5WzBdLmNvbG9yLmIgPSBmbG93U2V0dGluZ3MuY29sb3IuYjtcclxuICAgIGNvcHlbMF0ub3BhY2l0eSA9IGZsb3dTZXR0aW5ncy5jb2xvci5hO1xyXG4gICAgZmxvdy5zdHJva2VzID0gY29weTtcclxufVxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXHJcbmZ1bmN0aW9uIFVwZGF0ZUZsb3dfSW50ZXJuYWwoZmxvdywgZnJvbSwgdG8sIGZvcmNlKSB7XHJcbiAgICBjb25zdCBmcm9tQWJzb2x1dGVUcmFuc2Zvcm0gPSBuZXcgdmVjdG9yXzEuZGVmYXVsdChmcm9tLmFic29sdXRlVHJhbnNmb3JtWzBdWzJdLCBmcm9tLmFic29sdXRlVHJhbnNmb3JtWzFdWzJdKTtcclxuICAgIGNvbnN0IHRvQWJzb2x1dGVUcmFuc2Zvcm0gPSBuZXcgdmVjdG9yXzEuZGVmYXVsdCh0by5hYnNvbHV0ZVRyYW5zZm9ybVswXVsyXSwgdG8uYWJzb2x1dGVUcmFuc2Zvcm1bMV1bMl0pO1xyXG4gICAgY29uc3QgY29vcmRzRGF0YSA9IEdldEZsb3dDb29yZHNEYXRhKGZsb3cpO1xyXG4gICAgbGV0IHRyYW5zZm9ybUNoYW5nZWQgPSB0cnVlO1xyXG4gICAgaWYgKGNvb3Jkc0RhdGEgIT09IG51bGwpIHtcclxuICAgICAgICB0cmFuc2Zvcm1DaGFuZ2VkID0gY29vcmRzRGF0YS5ub2Rlc0Fic29sdXRlVHJhbnNmb3JtWzBdLnggIT09IGZyb21BYnNvbHV0ZVRyYW5zZm9ybS54XHJcbiAgICAgICAgICAgIHx8IGNvb3Jkc0RhdGEubm9kZXNBYnNvbHV0ZVRyYW5zZm9ybVswXS55ICE9PSBmcm9tQWJzb2x1dGVUcmFuc2Zvcm0ueVxyXG4gICAgICAgICAgICB8fCBjb29yZHNEYXRhLm5vZGVzQWJzb2x1dGVUcmFuc2Zvcm1bMV0ueCAhPT0gdG9BYnNvbHV0ZVRyYW5zZm9ybS54XHJcbiAgICAgICAgICAgIHx8IGNvb3Jkc0RhdGEubm9kZXNBYnNvbHV0ZVRyYW5zZm9ybVsxXS55ICE9PSB0b0Fic29sdXRlVHJhbnNmb3JtLnk7XHJcbiAgICB9XHJcbiAgICAvLyBkb2VzbnQgbWF0dGVyIHRvIGNhbGMgY2hhbmdlcyBpZiBmb3JjZSB1cGRhdGVcclxuICAgIGlmIChmb3JjZSB8fCB0cmFuc2Zvcm1DaGFuZ2VkKSB7XHJcbiAgICAgICAgY29uc3Qgc3AgPSBzbmFwcG9pbnRzXzEuZGVmYXVsdC5HZXRDbG9zZXN0U25hcFBvaW50cyhmcm9tLCB0byk7XHJcbiAgICAgICAgY29uc3QgeCA9IHNwWzBdLnggLSBzcFsxXS54O1xyXG4gICAgICAgIGNvbnN0IHkgPSBzcFswXS55IC0gc3BbMV0ueTtcclxuICAgICAgICBjb25zdCBmbG93WCA9IHNwWzBdLnggLSB4IC0gRlJBTUVfT0ZGU0VULng7XHJcbiAgICAgICAgY29uc3QgZmxvd1kgPSBzcFswXS55IC0geSAtIEZSQU1FX09GRlNFVC55O1xyXG4gICAgICAgIGZsb3cueCA9IGZsb3dYO1xyXG4gICAgICAgIGZsb3cueSA9IGZsb3dZO1xyXG4gICAgICAgIGlmIChHZXRGbG93U2V0dGluZ3MoZmxvdykuYmV6aWVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNYID0gWzAsIDBdO1xyXG4gICAgICAgICAgICBjb25zdCBjWSA9IFswLCAwXTtcclxuICAgICAgICAgICAgLy8gVE9ETyBSb3RhdGlvbiBzdXBwb3J0XHJcbiAgICAgICAgICAgIC8vIC8vIEVORFBPSU5UIElGIEZST00gSVMgUklHSFRcclxuICAgICAgICAgICAgLy8gY29uc3QgZnJvbVJhZGlhbiA9IChmcm9tIGFzIExheW91dE1peGluKS5yb3RhdGlvbiAqICgzLjE0IC8gMTgwKTtcclxuICAgICAgICAgICAgLy8gY29uc3QgdG9SYWRpYW4gPSAodG8gYXMgTGF5b3V0TWl4aW4pLnJvdGF0aW9uICogKDMuMTQgLyAxODApO1xyXG4gICAgICAgICAgICAvLyBpZiAoc3BbMF0uX3R5cGUgPT09ICdyaWdodCcpIHtcclxuICAgICAgICAgICAgLy8gICBjWFswXSA9IHgyICogTWF0aC5jb3ModG9SYWRpYW4pICsgKHkyICogTWF0aC5zaW4odG9SYWRpYW4pKTtcclxuICAgICAgICAgICAgLy8gICBjWVswXSA9IHgyICogKDIvNSAqIDMuMTQpICogTWF0aC5zaW4oLTEgKiB0b1JhZGlhbikgKyAoeTIgKiBNYXRoLnNpbih0b1JhZGlhbikpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIC8vU1RBUlRQT0lOVCBJRiBUTyBJUyBMRUZUXHJcbiAgICAgICAgICAgIC8vIGlmIChzcFsxXS5fdHlwZSA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgICAgIC8vICAgY1hbMV0gPSB4MiAqIE1hdGguY29zKGZyb21SYWRpYW4pO1xyXG4gICAgICAgICAgICAvLyAgIGNZWzFdID0geDIgKiAoMi81KjMuMTQpICogTWF0aC5zaW4oLTEgKiB0b1JhZGlhbikgKyB5MiAqIDIgICogTWF0aC5jb3MoZnJvbVJhZGlhbik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgY29uc3QgeTIgPSB5ICogMC41O1xyXG4gICAgICAgICAgICBjb25zdCB4MiA9IHggKiAwLjU7XHJcbiAgICAgICAgICAgIGlmIChzcFswXS5fdHlwZSA9PT0gJ3JpZ2h0JyB8fCBzcFswXS5fdHlwZSA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgICAgICAgICBjWFsxXSA9IHgyO1xyXG4gICAgICAgICAgICAgICAgY1lbMV0gPSB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzcFswXS5fdHlwZSA9PT0gJ3RvcCcgfHwgc3BbMF0uX3R5cGUgPT09ICdib3R0b20nKSB7XHJcbiAgICAgICAgICAgICAgICBjWFsxXSA9IHg7XHJcbiAgICAgICAgICAgICAgICBjWVsxXSA9IHkyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzcFsxXS5fdHlwZSA9PT0gJ3JpZ2h0JyB8fCBzcFsxXS5fdHlwZSA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgICAgICAgICBjWFswXSA9IHgyO1xyXG4gICAgICAgICAgICAgICAgY1lbMF0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzcFsxXS5fdHlwZSA9PT0gJ3RvcCcgfHwgc3BbMV0uX3R5cGUgPT09ICdib3R0b20nKSB7XHJcbiAgICAgICAgICAgICAgICBjWFswXSA9IDA7XHJcbiAgICAgICAgICAgICAgICBjWVswXSA9IHkyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZsb3cudmVjdG9yUGF0aHMgPSBbe1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRpbmdSdWxlOiAnRVZFTk9ERCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogYE0gMCAwIEMgJHtjWFswXX0gJHtjWVswXX0gJHtjWFsxXX0gJHtjWVsxXX0gJHt4fSAke3l9YCxcclxuICAgICAgICAgICAgICAgIH1dO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZmxvdy52ZWN0b3JQYXRocyA9IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZGluZ1J1bGU6ICdFVkVOT0REJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBgTSAwIDAgTCAke3h9ICR7eX1gLFxyXG4gICAgICAgICAgICAgICAgfV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFVwZGF0ZUZsb3dBcHBlYXJhbmNlKGZsb3cpO1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgRmxvd0Nvb3Jkc0RhdGEoKTtcclxuICAgICAgICBkYXRhLm5vZGVzQWJzb2x1dGVUcmFuc2Zvcm0gPSBbZnJvbUFic29sdXRlVHJhbnNmb3JtLCB0b0Fic29sdXRlVHJhbnNmb3JtXTtcclxuICAgICAgICBTZXRGbG93Q29vcmRzRGF0YShmbG93LCBkYXRhKTtcclxuICAgICAgICBmbG93Lm5hbWUgPSBgJHtmcm9tLm5hbWV9IC0+ICR7dG8ubmFtZX1gO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIFVwZGF0ZUZsb3coZmxvdywgZm9yY2UgPSBmYWxzZSkge1xyXG4gICAgY29uc3QgZGF0YSA9IEdldEZsb3dEYXRhKGZsb3cpO1xyXG4gICAgY29uc3QgZnJvbSA9IGZpZ21hLmdldE5vZGVCeUlkKGRhdGFbMF0pO1xyXG4gICAgY29uc3QgdG8gPSBmaWdtYS5nZXROb2RlQnlJZChkYXRhWzFdKTtcclxuICAgIGlmIChmcm9tID09PSBudWxsIHx8IHRvID09PSBudWxsKSB7XHJcbiAgICAgICAgZmxvdy5yZW1vdmUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChmcm9tLnJlbW92ZWQpIHtcclxuICAgICAgICAgICAgUmVtb3ZlRmxvd3MoZnJvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0by5yZW1vdmVkKSB7XHJcbiAgICAgICAgICAgIFJlbW92ZUZsb3dzKHRvKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0by5yZW1vdmVkICYmICFmcm9tLnJlbW92ZWQpIHtcclxuICAgICAgICAgICAgVXBkYXRlRmxvd19JbnRlcm5hbChmbG93LCBmcm9tLCB0bywgZm9yY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBDcmVhdGVGbG93KGZyb20sIHRvLCBzZXR0aW5ncykge1xyXG4gICAgbGV0IHN2ZyA9IG51bGw7XHJcbiAgICBzdmcgPSBHZXRGbG93KGZyb20sIHRvKTtcclxuICAgIGlmIChzdmcgPT09IG51bGwpIHtcclxuICAgICAgICBzdmcgPSBmaWdtYS5jcmVhdGVWZWN0b3IoKTtcclxuICAgICAgICBHZXRQbHVnaW5GcmFtZSgpLmFwcGVuZENoaWxkKHN2Zyk7XHJcbiAgICB9XHJcbiAgICAvLyBPcmRlciBpcyBtYXR0ZXIgOilcclxuICAgIFNldEZsb3dTZXR0aW5ncyhzdmcsIHNldHRpbmdzKTtcclxuICAgIFNldEZsb3dEYXRhKHN2ZywgW2Zyb20uaWQsIHRvLmlkXSk7XHJcbiAgICBVcGRhdGVGbG93KHN2ZywgdHJ1ZSk7XHJcbn1cclxuZXhwb3J0cy5DcmVhdGVGbG93ID0gQ3JlYXRlRmxvdztcclxubGV0IHVwZGF0ZUZsb3dJbnRlcnZhbElkID0gLTE7XHJcbmxldCB1cGRhdGVGcmFtZUludGVydmFsSWQgPSAtMTtcclxubGV0IHVwZGF0ZUludGVydmFsc0ludGVydmFsSWQgPSAtMTtcclxubGV0IGVuYWJsZWQgPSBmYWxzZTtcclxuZnVuY3Rpb24gVXBkYXRlRmxvd0ludGVydmFsKGludGVydmFsTVMgPSA1MCwgZm9yY2UgPSBmYWxzZSkge1xyXG4gICAgaWYgKGludGVydmFsTVMgPCA1MClcclxuICAgICAgICBpbnRlcnZhbE1TID0gNTA7XHJcbiAgICBpZiAoZm9yY2UgfHwgZW5hYmxlZCkge1xyXG4gICAgICAgIGlmICh1cGRhdGVGbG93SW50ZXJ2YWxJZCAhPT0gLTEpXHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodXBkYXRlRmxvd0ludGVydmFsSWQpO1xyXG4gICAgICAgIHVwZGF0ZUZsb3dJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc3Qgbm93MSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBfbm9kZXMgPSBHZXRBbGxGbG93cygpO1xyXG4gICAgICAgICAgICAgICAgX25vZGVzLmZvckVhY2goKHgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBVcGRhdGVGbG93KHgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBub3cyID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAkeyhub3cyIC0gbm93MSkudG9TdHJpbmcoKX1tcy4gZm9yICR7X25vZGVzLmxlbmd0aH0gbm9kZXNgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGludGVydmFsTVMpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIFVwZGF0ZUludGVydmFscygpIHtcclxuICAgIFVwZGF0ZUZsb3dJbnRlcnZhbChHZXRBbGxGbG93cygpLmxlbmd0aCwgdHJ1ZSk7IC8vIG5vd1xyXG4gICAgdXBkYXRlSW50ZXJ2YWxzSW50ZXJ2YWxJZCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBpZiAoZW5hYmxlZCkge1xyXG4gICAgICAgICAgICBVcGRhdGVGbG93SW50ZXJ2YWwoR2V0QWxsRmxvd3MoKS5sZW5ndGgpOyAvLyBlYWNoIDEwIHNlY29uZHNcclxuICAgICAgICB9XHJcbiAgICB9LCAxMDAwMCk7XHJcbiAgICB1cGRhdGVGcmFtZUludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcclxuICAgICAgICAgICAgVXBkYXRlUGx1Z2luRnJhbWUoKTtcclxuICAgICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxufVxyXG5mdW5jdGlvbiBFbmFibGUoKSB7XHJcbiAgICBlbmFibGVkID0gdHJ1ZTtcclxuICAgIFVwZGF0ZUludGVydmFscygpO1xyXG4gICAgKDAsIHNlbGVjdGlvbl8xLlNldE9uU2VsZWN0aW9uSXRlbUFkZGVkKSgoaXRlbSkgPT4ge1xyXG4gICAgICAgIC8vIFByZXZlbnQgbWFpbiBmcmFtZSBzZWxlY3RpbmdcclxuICAgICAgICBpZiAoaXRlbS5pZCA9PT0gR2V0UGx1Z2luRnJhbWUoKS5pZCkge1xyXG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgICgwLCBzZWxlY3Rpb25fMS5TZXRPblNlbGVjdGlvbkl0ZW1SZW1vdmVkKSgoaXRlbSkgPT4ge1xyXG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsICYmIGl0ZW0ucmVtb3ZlZCkge1xyXG4gICAgICAgICAgICBSZW1vdmVGbG93cyhpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLkVuYWJsZSA9IEVuYWJsZTtcclxuZnVuY3Rpb24gRGlzYWJsZSgpIHtcclxuICAgIGVuYWJsZWQgPSBmYWxzZTtcclxuICAgIGlmICh1cGRhdGVJbnRlcnZhbHNJbnRlcnZhbElkICE9PSAtMSkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodXBkYXRlSW50ZXJ2YWxzSW50ZXJ2YWxJZCk7XHJcbiAgICAgICAgdXBkYXRlSW50ZXJ2YWxzSW50ZXJ2YWxJZCA9IC0xO1xyXG4gICAgfVxyXG4gICAgaWYgKHVwZGF0ZUZsb3dJbnRlcnZhbElkICE9PSAtMSkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodXBkYXRlRmxvd0ludGVydmFsSWQpO1xyXG4gICAgICAgIHVwZGF0ZUZsb3dJbnRlcnZhbElkID0gLTE7XHJcbiAgICB9XHJcbiAgICBpZiAodXBkYXRlRnJhbWVJbnRlcnZhbElkICE9PSAtMSkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodXBkYXRlRnJhbWVJbnRlcnZhbElkKTtcclxuICAgICAgICB1cGRhdGVGcmFtZUludGVydmFsSWQgPSAtMTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkRpc2FibGUgPSBEaXNhYmxlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlVwZGF0ZVNlbGVjdGlvbiA9IGV4cG9ydHMuR2V0U2VsZWN0aW9uID0gZXhwb3J0cy5TZXRPblNlbGVjdGlvbkl0ZW1SZW1vdmVkID0gZXhwb3J0cy5TZXRPblNlbGVjdGlvbkl0ZW1BZGRlZCA9IGV4cG9ydHMuU2V0T25TZWxlY3Rpb25DaGFuZ2VkID0gdm9pZCAwO1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBicmFjZS1zdHlsZSAqL1xyXG5sZXQgbGFzdFNlbGVjdGlvbiA9IFtdO1xyXG5sZXQgT25TZWxlY3Rpb25DaGFuZ2VkO1xyXG5sZXQgT25TZWxlY3Rpb25JdGVtUmVtb3ZlZDtcclxubGV0IE9uU2VsZWN0aW9uSXRlbUFkZGVkO1xyXG5mdW5jdGlvbiBVcGRhdGVTZWxlY3Rpb24oKSB7XHJcbiAgICBjb25zdCB7IHNlbGVjdGlvbiB9ID0gZmlnbWEuY3VycmVudFBhZ2U7XHJcbiAgICBjb25zdCBsYXN0U2VsZWN0aW9uTGVuZ3RoID0gbGFzdFNlbGVjdGlvbi5sZW5ndGg7XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgIC8vIHJlbW92ZWRcclxuICAgIGlmIChsYXN0U2VsZWN0aW9uLmxlbmd0aCA+IHNlbGVjdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICBsYXN0U2VsZWN0aW9uLmZvckVhY2goKHgsIGkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZm91bmQgPSBzZWxlY3Rpb24uZmluZCgoeSwgaTIpID0+IHguaWQgPT09IHkuaWQpICE9PSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXN1bHQuZm9yRWFjaCgoeCkgPT4ge1xyXG4gICAgICAgICAgICBPblNlbGVjdGlvbkl0ZW1SZW1vdmVkKHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxhc3RTZWxlY3Rpb24gPSByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICAvLyBhZGRlZFxyXG4gICAgZWxzZSBpZiAobGFzdFNlbGVjdGlvbi5sZW5ndGggPCBzZWxlY3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgc2VsZWN0aW9uLmZvckVhY2goKHgsIGkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZm91bmQgPSBsYXN0U2VsZWN0aW9uLmZpbmQoKHksIGkyKSA9PiB4LmlkID09PSB5LmlkKSAhPT0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAoIWZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0U2VsZWN0aW9uLnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICBPblNlbGVjdGlvbkl0ZW1BZGRlZCh4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gY2hhbmdlZFxyXG4gICAgZWxzZSBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PT0gbGFzdFNlbGVjdGlvbi5sZW5ndGggJiYgc2VsZWN0aW9uLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIGlmIChzZWxlY3Rpb25bMF0uaWQgIT09IGxhc3RTZWxlY3Rpb25bMF0uaWQpIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goc2VsZWN0aW9uWzBdKTtcclxuICAgICAgICAgICAgT25TZWxlY3Rpb25JdGVtQWRkZWQoc2VsZWN0aW9uWzBdKTtcclxuICAgICAgICAgICAgT25TZWxlY3Rpb25JdGVtUmVtb3ZlZChsYXN0U2VsZWN0aW9uWzBdKTtcclxuICAgICAgICAgICAgbGFzdFNlbGVjdGlvbiA9IHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAobGFzdFNlbGVjdGlvbkxlbmd0aCA9PT0gMSAmJiBsYXN0U2VsZWN0aW9uLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgIE9uU2VsZWN0aW9uQ2hhbmdlZChsYXN0U2VsZWN0aW9uKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlVwZGF0ZVNlbGVjdGlvbiA9IFVwZGF0ZVNlbGVjdGlvbjtcclxuZnVuY3Rpb24gR2V0U2VsZWN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGxhc3RTZWxlY3Rpb247XHJcbn1cclxuZXhwb3J0cy5HZXRTZWxlY3Rpb24gPSBHZXRTZWxlY3Rpb247XHJcbmZ1bmN0aW9uIFNldE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQoY2FsbGJhY2spIHtcclxuICAgIE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQgPSBjYWxsYmFjaztcclxufVxyXG5leHBvcnRzLlNldE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQgPSBTZXRPblNlbGVjdGlvbkl0ZW1SZW1vdmVkO1xyXG5mdW5jdGlvbiBTZXRPblNlbGVjdGlvbkl0ZW1BZGRlZChjYWxsYmFjaykge1xyXG4gICAgT25TZWxlY3Rpb25JdGVtQWRkZWQgPSBjYWxsYmFjaztcclxufVxyXG5leHBvcnRzLlNldE9uU2VsZWN0aW9uSXRlbUFkZGVkID0gU2V0T25TZWxlY3Rpb25JdGVtQWRkZWQ7XHJcbmZ1bmN0aW9uIFNldE9uU2VsZWN0aW9uQ2hhbmdlZChjYWxsYmFjaykge1xyXG4gICAgT25TZWxlY3Rpb25DaGFuZ2VkID0gY2FsbGJhY2s7XHJcbiAgICBmaWdtYS5vbignc2VsZWN0aW9uY2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgIFVwZGF0ZVNlbGVjdGlvbigpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5TZXRPblNlbGVjdGlvbkNoYW5nZWQgPSBTZXRPblNlbGVjdGlvbkNoYW5nZWQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHZlY3Rvcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3ZlY3RvclwiKSk7XHJcbmNsYXNzIFNuYXBQb2ludCBleHRlbmRzIHZlY3Rvcl8xLmRlZmF1bHQge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgX3R5cGUpIHtcclxuICAgICAgICBzdXBlcih4LCB5KTtcclxuICAgICAgICB0aGlzLl90eXBlID0gX3R5cGU7XHJcbiAgICB9XHJcbn1cclxuLy8gVE9ETyBGcmFtZSBQYXJlbnRcclxuLy8gI3JlZ2lvbiBTbmFwUG9pbnRzXHJcbmZ1bmN0aW9uIEdldFNuYXBQb2ludCh4LCBfdHlwZSkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IFNuYXBQb2ludCgwLCAwLCBfdHlwZSk7XHJcbiAgICBjb25zdCBwaSA9IDMuMTQgLyAxODA7XHJcbiAgICBjb25zdCByYWRpYW4gPSB4LnJvdGF0aW9uICogcGk7XHJcbiAgICBjb25zdCBhYnNvbHV0ZVggPSB4LmFic29sdXRlVHJhbnNmb3JtWzBdWzJdO1xyXG4gICAgY29uc3QgYWJzb2x1dGVZID0geC5hYnNvbHV0ZVRyYW5zZm9ybVsxXVsyXTtcclxuICAgIGlmIChfdHlwZSA9PT0gJ3RvcCcpIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgeGAgPSB4ICsgKHcgLyAyICogY29zKHJvdGF0aW9uKSlcclxuICAgICAgICAgIHlgID0geSAtICh3IC8gMiAqIHNpbihyb3RhdGlvbikpXHJcbiAgICAgICAgKi9cclxuICAgICAgICByZXN1bHQueCA9IGFic29sdXRlWCArICh4LndpZHRoICogMC41ICogTWF0aC5jb3MocmFkaWFuKSk7XHJcbiAgICAgICAgcmVzdWx0LnkgPSBhYnNvbHV0ZVkgLSAoeC53aWR0aCAqIDAuNSAqIE1hdGguc2luKHJhZGlhbikpO1xyXG4gICAgfVxyXG4gICAgaWYgKF90eXBlID09PSAncmlnaHQnKSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgIHhgID0geCArICh3ICogY29zKHJvdGF0aW9uKSkgKyAoaC8yICogc2luKHJvdGF0aW9uKSlcclxuICAgICAgICAgIHlgID0geSArIChoLzIgKiBjb3Mocm90YXRpb24pKSAtICh3ICogc2luKHJvdGF0aW9uKSlcclxuICAgICAgICAqL1xyXG4gICAgICAgIHJlc3VsdC54ID0gYWJzb2x1dGVYICsgKHgud2lkdGggKiBNYXRoLmNvcyhyYWRpYW4pKSArICh4LmhlaWdodCAqIDAuNSAqIE1hdGguc2luKHJhZGlhbikpO1xyXG4gICAgICAgIHJlc3VsdC55ID0gYWJzb2x1dGVZICsgKHguaGVpZ2h0ICogMC41ICogTWF0aC5jb3MocmFkaWFuKSkgLSAoeC53aWR0aCAqIE1hdGguc2luKHJhZGlhbikpO1xyXG4gICAgfVxyXG4gICAgaWYgKF90eXBlID09PSAnYm90dG9tJykge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICB4YCA9IHggKyAody8yICogY29zKHJvdGF0aW9uKSkgKyAoaCAqIHNpbihyb3RhdGlvbikpXHJcbiAgICAgICAgICB5YCA9IHkgLSAody8yICogc2luKHJvdGF0aW9uKSkgKyAoaCAqIGNvcyhyb3RhdGlvbikpXHJcbiAgICAgICAgKi9cclxuICAgICAgICByZXN1bHQueCA9IGFic29sdXRlWCArICh4LndpZHRoICogMC41ICogTWF0aC5jb3MocmFkaWFuKSkgKyAoeC5oZWlnaHQgKiBNYXRoLnNpbihyYWRpYW4pKTtcclxuICAgICAgICByZXN1bHQueSA9IGFic29sdXRlWSArICh4LmhlaWdodCAqIE1hdGguY29zKHJhZGlhbikpIC0gKHgud2lkdGggKiAwLjUgKiBNYXRoLnNpbihyYWRpYW4pKTtcclxuICAgIH1cclxuICAgIGlmIChfdHlwZSA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgIHhgID0geCArIChoLzIgKiBzaW4ocm90YXRpb24pKVxyXG4gICAgICAgICAgeWAgPSB5ICsgKGgvMiAqIGNvcyhyb3RhdGlvbikpXHJcbiAgICAgICAgKi9cclxuICAgICAgICByZXN1bHQueCA9IGFic29sdXRlWCArICh4LmhlaWdodCAqIDAuNSAqIE1hdGguc2luKHJhZGlhbikpO1xyXG4gICAgICAgIHJlc3VsdC55ID0gYWJzb2x1dGVZICsgKHguaGVpZ2h0ICogMC41ICogTWF0aC5jb3MocmFkaWFuKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmZ1bmN0aW9uIEdldFNuYXBQb2ludHMoeCkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICBjb25zdCBwaSA9IDMuMTQgLyAxODA7XHJcbiAgICBjb25zdCByYWRpYW4gPSB4LnJvdGF0aW9uICogcGk7XHJcbiAgICBjb25zdCBhYnNvbHV0ZVggPSB4LmFic29sdXRlVHJhbnNmb3JtWzBdWzJdO1xyXG4gICAgY29uc3QgYWJzb2x1dGVZID0geC5hYnNvbHV0ZVRyYW5zZm9ybVsxXVsyXTtcclxuICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZGlhbik7XHJcbiAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihyYWRpYW4pO1xyXG4gICAgcmVzdWx0LnB1c2gobmV3IFNuYXBQb2ludChhYnNvbHV0ZVggKyAoeC53aWR0aCAqIDAuNSAqIGNvcyksIGFic29sdXRlWSAtICh4LndpZHRoICogMC41ICogc2luKSwgJ3RvcCcpKTtcclxuICAgIHJlc3VsdC5wdXNoKG5ldyBTbmFwUG9pbnQoYWJzb2x1dGVYICsgKHgud2lkdGggKiBjb3MpICsgKHguaGVpZ2h0ICogMC41ICogc2luKSwgYWJzb2x1dGVZICsgKHguaGVpZ2h0ICogMC41ICogY29zKSAtICh4LndpZHRoICogc2luKSwgJ3JpZ2h0JykpO1xyXG4gICAgcmVzdWx0LnB1c2gobmV3IFNuYXBQb2ludChhYnNvbHV0ZVggKyAoeC53aWR0aCAqIDAuNSAqIGNvcykgKyAoeC5oZWlnaHQgKiBzaW4pLCBhYnNvbHV0ZVkgKyAoeC5oZWlnaHQgKiBjb3MpIC0gKHgud2lkdGggKiAwLjUgKiBzaW4pLCAnYm90dG9tJykpO1xyXG4gICAgcmVzdWx0LnB1c2gobmV3IFNuYXBQb2ludChhYnNvbHV0ZVggKyAoeC5oZWlnaHQgKiAwLjUgKiBzaW4pLCBhYnNvbHV0ZVkgKyAoeC5oZWlnaHQgKiAwLjUgKiBjb3MpLCAnbGVmdCcpKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gR2V0U25hcFBvaW50QnlJZCh4LCBpZCkge1xyXG4gICAgcmV0dXJuIEdldFNuYXBQb2ludCh4LCBpZCA9PT0gMCA/ICd0b3AnXHJcbiAgICAgICAgOiBpZCA9PT0gMSA/ICdyaWdodCdcclxuICAgICAgICAgICAgOiBpZCA9PT0gMiA/ICdib3R0b20nIDogJ2xlZnQnKTtcclxufVxyXG5mdW5jdGlvbiBHZXRDbG9zZXN0U25hcFBvaW50cyhmcm9tLCB0bykge1xyXG4gICAgLypcclxuICAgICAgbyAtIGxvY2F0aW9uIC8gc25hcHBvaW50XHJcbiAgICAgIHggLSBzbmFwcG9pbnRcclxuICAgICAgKyAtIGFuZ2xlXHJcbiAgICAgIC1cclxuICAgICAgICBvLS0tLS14LS0tLS0rXHJcbiAgICAgICAgfCAgICAgICAgICAgfFxyXG4gICAgICAgIHggICAgICAgICAgIHhcclxuICAgICAgICB8ICAgICAgICAgICB8XHJcbiAgICAgICAgKy0tLS0teC0tLS0tK1xyXG4gICAgICAgICAgICAgICAgICAgICAgK1xyXG4gICAgKi9cclxuICAgIGNvbnN0IGZyb21TbmFwUG9pbnRzID0gR2V0U25hcFBvaW50cyhmcm9tKTtcclxuICAgIGNvbnN0IGZyb21YU25hcFBvaW50cyA9IFtmcm9tU25hcFBvaW50c1sxXSwgZnJvbVNuYXBQb2ludHNbM11dO1xyXG4gICAgY29uc3QgZnJvbVlTbmFwUG9pbnRzID0gW2Zyb21TbmFwUG9pbnRzWzBdLCBmcm9tU25hcFBvaW50c1syXV07XHJcbiAgICBjb25zdCB0b1NuYXBQb2ludHMgPSBHZXRTbmFwUG9pbnRzKHRvKTtcclxuICAgIGNvbnN0IHRvWFNuYXBQb2ludHMgPSBbdG9TbmFwUG9pbnRzWzFdLCB0b1NuYXBQb2ludHNbM11dO1xyXG4gICAgY29uc3QgdG9ZU25hcFBvaW50cyA9IFt0b1NuYXBQb2ludHNbMF0sIHRvU25hcFBvaW50c1syXV07XHJcbiAgICBjb25zdCBnZXRDbG9zZXN0RnJvbSA9IGZ1bmN0aW9uIGdldENsb3Nlc3RGcm9tKF9mcm9tU25hcFBvaW50cywgX3RvU25hcFBvaW50cykge1xyXG4gICAgICAgIGNvbnN0IF9yZXN1bHQgPSBbXHJcbiAgICAgICAgICAgIG51bGwsIG51bGwsXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgbGFzdERpc3RhbmNlID0gOTk5OTk5OTk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaTIgPSAwOyBpMiA8IDI7IGkyKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gX2Zyb21TbmFwUG9pbnRzW2ldLmRpc3QoX3RvU25hcFBvaW50c1tpMl0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgbGFzdERpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3Jlc3VsdFswXSA9IF9mcm9tU25hcFBvaW50c1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBfcmVzdWx0WzFdID0gX3RvU25hcFBvaW50c1tpMl07XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdERpc3RhbmNlID0gZGlzdGFuY2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtsYXN0RGlzdGFuY2UsIF9yZXN1bHRdO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IGNsb3Nlc3RYID0gZ2V0Q2xvc2VzdEZyb20oZnJvbVhTbmFwUG9pbnRzLCB0b1hTbmFwUG9pbnRzKTtcclxuICAgIC8vIENoZWNrIGNsb3Nlc3QgWFxyXG4gICAgY29uc3Qgd1ggPSBNYXRoLmFicyhjbG9zZXN0WFsxXVswXS54IC0gY2xvc2VzdFhbMV1bMV0ueCk7XHJcbiAgICBjb25zdCBoWCA9IE1hdGguYWJzKGNsb3Nlc3RYWzFdWzBdLnkgLSBjbG9zZXN0WFsxXVsxXS55KTtcclxuICAgIGNvbnN0IGRpc3RYID0gY2xvc2VzdFhbMV1bMF0uZGlzdChjbG9zZXN0WFsxXVsxXSk7XHJcbiAgICAvKlxyXG4gICAgICBQUkVWRU5UIFRIQVRcclxuICAgICAgICAgICAgICAgICAgICAgICAgby0tLS0teC0tLS0tK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgICB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAteCAgICAgICAgICAgeFxyXG4gICAgICAgICAgICAgICAgICAgICAgLyB8ICAgICAgICAgICB8XHJcbiAgICAgICAgICAgICAgICAgICAgICB8ICstLS0tLXgtLS0tLStcclxuICAgICAgICAgICAgICAgICAgICAgIHxcclxuICAgICAgICAgICAgICAgICAgICAgIHxcclxuICAgICAgICBvLS0tLS14LS0tLS0rIHxcclxuICAgICAgICB8ICAgICAgICAgICB8IC9cclxuICAgICAgICB4ICAgICAgICAgICB4IC1cclxuICAgICAgICB8ICAgICAgICAgICB8XHJcbiAgICAgICAgKy0tLS0teC0tLS0tK1xyXG4gIFxyXG4gICAgICAgIERPIElOU1RFQUQgVEhBVFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvLS0tLS14LS0tLS0rXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgIHxcclxuICAgICAgICAgICAgICAgIC8tLS0tLS0teCAgICAgICAgICAgeFxyXG4gICAgICAgICAgICAgIC8gICAgICAgIHwgICAgICAgICAgIHxcclxuICAgICAgICAgICAgICAvICAgICAgICAgKy0tLS0teC0tLS0tK1xyXG4gICAgICAgICAgICAgIHxcclxuICAgICAgICAgICAgICB8XHJcbiAgICAgICAgby0tLS0teC0tLS0tK1xyXG4gICAgICAgIHwgICAgICAgICAgIHxcclxuICAgICAgICB4ICAgICAgICAgICB4XHJcbiAgICAgICAgfCAgICAgICAgICAgfFxyXG4gICAgICAgICstLS0tLXgtLS0tLStcclxuICAgICovXHJcbiAgICBjb25zdCBjbG9zZXN0WSA9IGdldENsb3Nlc3RGcm9tKGZyb21ZU25hcFBvaW50cywgdG9ZU25hcFBvaW50cyk7XHJcbiAgICBjb25zdCB3WSA9IE1hdGguYWJzKGNsb3Nlc3RZWzFdWzBdLnggLSBjbG9zZXN0WVsxXVsxXS54KTtcclxuICAgIGNvbnN0IGhZID0gTWF0aC5hYnMoY2xvc2VzdFlbMV1bMF0ueSAtIGNsb3Nlc3RZWzFdWzFdLnkpO1xyXG4gICAgY29uc3QgZGlzdFkgPSBjbG9zZXN0WVsxXVswXS5kaXN0KGNsb3Nlc3RZWzFdWzFdKTtcclxuICAgIGNvbnN0IHdYWSA9IE1hdGguYWJzKGNsb3Nlc3RZWzFdWzBdLnggLSBjbG9zZXN0WFsxXVsxXS54KTtcclxuICAgIGNvbnN0IGhYWSA9IE1hdGguYWJzKGNsb3Nlc3RZWzFdWzBdLnkgLSBjbG9zZXN0WFsxXVsxXS55KTtcclxuICAgIGNvbnN0IGRpc3RYWSA9IGNsb3Nlc3RZWzFdWzBdLmRpc3QoY2xvc2VzdFhbMV1bMV0pO1xyXG4gICAgLy8gcHJlZmVyIFkgb3ZlciBYIGlmIFggZ290IGJhZCB3aWR0aC9oZWlnaHQgcHJvcG9ydGlvbnNcclxuICAgIC8vIGlmIGdvb2QgWCBwcm9wb3J0aW9uc1xyXG4gICAgbGV0IGNsb3Nlc3REaXN0YW5jZSA9IDk5OTk5OTk7XHJcbiAgICBpZiAoZGlzdFggPCBjbG9zZXN0RGlzdGFuY2UpXHJcbiAgICAgICAgY2xvc2VzdERpc3RhbmNlID0gZGlzdFg7XHJcbiAgICBpZiAoZGlzdFkgPCBjbG9zZXN0RGlzdGFuY2UpXHJcbiAgICAgICAgY2xvc2VzdERpc3RhbmNlID0gZGlzdFk7XHJcbiAgICBpZiAoZGlzdFhZIDwgY2xvc2VzdERpc3RhbmNlKVxyXG4gICAgICAgIGNsb3Nlc3REaXN0YW5jZSA9IGRpc3RYWTtcclxuICAgIGlmICh3WCAqIDEuNSA+IGhYKSB7XHJcbiAgICAgICAgY29uc3QgX2Zyb20gPSBjbG9zZXN0WFsxXVswXTtcclxuICAgICAgICBjb25zdCBfdG8gPSBjbG9zZXN0WFsxXVsxXTtcclxuICAgICAgICBpZiAoKF9mcm9tLl90eXBlID09PSAncmlnaHQnKSA/IF9mcm9tLnggPCBfdG8ueCA6IF9mcm9tLnggPiBfdG8ueCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW2Nsb3Nlc3RYWzFdWzBdLCBjbG9zZXN0WFsxXVsxXV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGhZICogMiA+IHdZKSB7XHJcbiAgICAgICAgcmV0dXJuIFtjbG9zZXN0WVsxXVswXSwgY2xvc2VzdFlbMV1bMV1dO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtjbG9zZXN0WFsxXVswXSwgY2xvc2VzdFlbMV1bMV1dO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IHsgR2V0U25hcFBvaW50LCBHZXRTbmFwUG9pbnRCeUlkLCBHZXRDbG9zZXN0U25hcFBvaW50cyB9O1xyXG4vLyAjZW5kcmVnaW9uXHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8vICNyZWdpb24gVmVjdG9yXHJcbmNsYXNzIFZlY3RvcjJEIHtcclxuICAgIGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcbiAgICBkaXN0KHRvKSB7XHJcbiAgICAgICAgY29uc3QgeGQgPSB0aGlzLnggLSB0by54O1xyXG4gICAgICAgIGNvbnN0IHlkID0gdGhpcy55IC0gdG8ueTtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHhkICogeGQgKyB5ZCAqIHlkKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBWZWN0b3IyRDtcclxuLy8gI2VuZHJlZ2lvblxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY29kZS50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==