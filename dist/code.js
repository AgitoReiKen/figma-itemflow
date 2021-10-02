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
/* eslint-disable default-case */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const selection = __importStar(__webpack_require__(/*! ./selection */ "./src/selection.ts"));
const flow = __importStar(__webpack_require__(/*! ./flow */ "./src/flow.ts"));
figma.showUI(__html__);
figma.ui.resize(300, 330);
const flowSettings = new flow.FlowSettings();
/* todo update z index */
flow.Enable();
selection.SetOnSelectionChanged((selection) => {
    if (selection.length === 2) {
        flow.CreateFlow(selection[0], selection[1], flowSettings);
    }
});
figma.on('close', () => { flow.Disable(); });
figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case 'set-stroke-weight': {
            flowSettings.weight = parseInt(msg.value);
            break;
        }
        case 'set-stroke-cap': {
            flowSettings.strokeCap[0] = msg.value[0];
            flowSettings.strokeCap[1] = msg.value[1];
            break;
        }
        case 'set-color': {
            const getColor = function (pos, value) {
                return parseFloat((parseInt(msg.value.substr(pos, 2), 16) / 0xFF).toPrecision(3));
            };
            //#ABACAD
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
            flowSettings.dashPattern = [parseInt(msg.value)];
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
        case 'cancel': {
            figma.closePlugin();
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
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */
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
        pluginFrame.resize(1, 1);
        pluginFrame.x = FRAME_OFFSET.x;
        pluginFrame.y = FRAME_OFFSET.y;
        pluginFrame.locked = false;
        pluginFrame.name = PLUGIN_NAME;
        pluginFrame.clipsContent = false;
        pluginFrame.setPluginData(FRAME_DATA, '1');
        found = figma.currentPage.findOne((x) => x.getPluginData(FRAME_DATA) === '1');
        DATA_NODE_ID = found.id;
    }
    else {
        DATA_NODE_ID = found.id;
    }
    return found;
}
exports.GetPluginFrame = GetPluginFrame;
function UpdatePluginFrame() {
    figma.currentPage.insertChild(figma.currentPage.children.length, GetPluginFrame());
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
        this.snapPoints = [];
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
    if (data.length != 0) {
        const parsed = JSON.parse(data);
        return parsed;
    }
    return [];
}
function RemoveFlows(of) {
    let flows = GetPluginFrame().findChildren(x => {
        const data = GetFlowData(x);
        if (data.length === 2) {
            return data.find(x => x === of.id) !== null;
        }
        return false;
    });
    flows.forEach(x => x.remove());
}
function GetAllFlows() {
    return GetPluginFrame().findChildren(x => { return GetFlowData(x).length === 2; });
}
function GetFlow(from, to) {
    return figma.currentPage.findOne(x => {
        const data = GetFlowData(x);
        if (data.length === 2) {
            return data[0] === from.id && data[1] === to.id;
        }
        return false;
    });
}
function UpdateFlowAppearance(flow) {
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
function UpdateFlow_Internal(flow, from, to, force) {
    const sp = snappoints_1.default.GetClosestSnapPoints(from, to);
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
        let data = new FlowCoordsData();
        data.snapPoints = [new vector_1.default(sp[0].x, sp[0].y), new vector_1.default(sp[1].x, sp[1].y)];
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
// TODO Circle 
function SetStrokeCap(node, start, end) {
    const copy = JSON.parse(JSON.stringify(node.vectorNetwork));
    if ("strokeCap" in copy.vertices[copy.vertices.length - 1]) {
        copy.vertices[copy.vertices.length - 1].strokeCap = start;
        copy.vertices[0].strokeCap = end;
    }
    node.vectorNetwork = copy;
}
let updateFlowIntervalId = -1;
let updateFrameIntervalId = -1;
function Enable() {
    GetPluginFrame().locked = true;
    updateFlowIntervalId = setInterval(() => {
        GetAllFlows().forEach(x => {
            UpdateFlow(x);
        });
    }, 100);
    updateFrameIntervalId = setInterval(() => {
        UpdatePluginFrame();
    }, 1000);
    (0, selection_1.SetOnSelectionItemAdded)((item) => {
    });
    (0, selection_1.SetOnSelectionItemRemoved)((item) => {
        if (item.removed) {
            RemoveFlows(item);
        }
    });
}
exports.Enable = Enable;
function Disable() {
    if (updateFlowIntervalId !== -1) {
        clearInterval(updateFlowIntervalId);
    }
    if (updateFrameIntervalId !== -1) {
        clearInterval(updateFrameIntervalId);
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
let lastSelection = [];
let OnSelectionChanged;
let OnSelectionItemRemoved;
let OnSelectionItemAdded;
function UpdateSelection() {
    const selection = figma.currentPage.selection;
    const lastSelectionLength = lastSelection.length;
    let result = [];
    //removed
    if (lastSelection.length > selection.length) {
        lastSelection.forEach((x, i) => {
            const found = selection.find((y, i2) => { return x.id === y.id; }) !== undefined;
            if (found) {
                result.push(x);
            }
        });
        result.forEach(x => {
            OnSelectionItemRemoved(x);
        });
        lastSelection = result;
    }
    //added
    else if (lastSelection.length < selection.length) {
        selection.forEach((x, i) => {
            const found = lastSelection.find((y, i2) => { return x.id === y.id; }) !== undefined;
            if (!found) {
                lastSelection.push(x);
                OnSelectionItemAdded(x);
            }
        });
    }
    //changed
    else if (selection.length === lastSelection.length && selection.length === 1) {
        if (selection[0].id != lastSelection[0].id) {
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
// #region SnapPoints  
function GetSnapPoint(x, _type) {
    let result = new SnapPoint(0, 0, _type);
    const pi = 3.14 / 180;
    const radian = x.rotation * pi;
    if (_type === 'top') {
        /*
          x` = x + (w / 2 * cos(rotation))
          y` = y - (w / 2 * sin(rotation))
        */
        result.x = x.x + (x.width * 0.5 * Math.cos(radian));
        result.y = x.y - (x.width * 0.5 * Math.sin(radian));
    }
    if (_type === 'right') {
        /*
          x` = x + (w * cos(rotation)) + (h/2 * sin(rotation))
          y` = y + (h/2 * cos(rotation)) - (w * sin(rotation))
        */
        result.x = x.x + (x.width * Math.cos(radian)) + (x.height * 0.5 * Math.sin(radian));
        result.y = x.y + (x.height * 0.5 * Math.cos(radian)) - (x.width * Math.sin(radian));
    }
    if (_type === 'bottom') {
        /*
          x` = x + (w/2 * cos(rotation)) + (h * sin(rotation))
          y` = y - (w/2 * sin(rotation)) + (h * cos(rotation))
        */
        result.x = x.x + (x.width * 0.5 * Math.cos(radian)) + (x.height * Math.sin(radian));
        result.y = x.y + (x.height * Math.cos(radian)) - (x.width * 0.5 * Math.sin(radian));
    }
    if (_type === 'left') {
        /*
          x` = x + (h/2 * sin(rotation))
          y` = y + (h/2 * cos(rotation))
        */
        result.x = x.x + (x.height * 0.5 * Math.sin(radian));
        result.y = x.y + (x.height * 0.5 * Math.cos(radian));
    }
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
    const result = [
        GetSnapPointById(from, 0),
        GetSnapPointById(to, 0),
    ];
    let lastDistance = 99999999;
    for (let i = 0; i < 4; i++) {
        const s1 = GetSnapPointById(from, i);
        for (let i2 = 0; i2 < 4; i2++) {
            const s2 = GetSnapPointById(to, i2);
            const distance = s1.dist(s2);
            if (distance < lastDistance) {
                result[0] = s1;
                result[1] = s2;
                lastDistance = distance;
            }
        }
    }
    return result;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Qjs7Ozs7Ozs7Ozs7QUN6RmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWU7QUFDZjs7Ozs7OztVQ2ZBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9JdGVtRmxvdy8uL3NyYy9jb2RlLnRzIiwid2VicGFjazovL0l0ZW1GbG93Ly4vc3JjL2Zsb3cudHMiLCJ3ZWJwYWNrOi8vSXRlbUZsb3cvLi9zcmMvc2VsZWN0aW9uLnRzIiwid2VicGFjazovL0l0ZW1GbG93Ly4vc3JjL3NuYXBwb2ludHMudHMiLCJ3ZWJwYWNrOi8vSXRlbUZsb3cvLi9zcmMvdmVjdG9yLnRzIiwid2VicGFjazovL0l0ZW1GbG93L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0l0ZW1GbG93L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vSXRlbUZsb3cvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0l0ZW1GbG93L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59KTtcclxudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZmxvd18xID0gcmVxdWlyZShcIi4vZmxvd1wiKTtcclxuLyogZXNsaW50LWRpc2FibGUgZGVmYXVsdC1jYXNlICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXBsdXNwbHVzICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLW5lc3RlZC10ZXJuYXJ5ICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG1heC1jbGFzc2VzLXBlci1maWxlICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuY29uc3Qgc2VsZWN0aW9uID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL3NlbGVjdGlvblwiKSk7XHJcbmNvbnN0IGZsb3cgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vZmxvd1wiKSk7XHJcbmZpZ21hLnNob3dVSShfX2h0bWxfXyk7XHJcbmZpZ21hLnVpLnJlc2l6ZSgzMDAsIDMzMCk7XHJcbmNvbnN0IGZsb3dTZXR0aW5ncyA9IG5ldyBmbG93LkZsb3dTZXR0aW5ncygpO1xyXG4vKiB0b2RvIHVwZGF0ZSB6IGluZGV4ICovXHJcbmZsb3cuRW5hYmxlKCk7XHJcbnNlbGVjdGlvbi5TZXRPblNlbGVjdGlvbkNoYW5nZWQoKHNlbGVjdGlvbikgPT4ge1xyXG4gICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICBmbG93LkNyZWF0ZUZsb3coc2VsZWN0aW9uWzBdLCBzZWxlY3Rpb25bMV0sIGZsb3dTZXR0aW5ncyk7XHJcbiAgICB9XHJcbn0pO1xyXG5maWdtYS5vbignY2xvc2UnLCAoKSA9PiB7IGZsb3cuRGlzYWJsZSgpOyB9KTtcclxuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4ge1xyXG4gICAgc3dpdGNoIChtc2cudHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ3NldC1zdHJva2Utd2VpZ2h0Jzoge1xyXG4gICAgICAgICAgICBmbG93U2V0dGluZ3Mud2VpZ2h0ID0gcGFyc2VJbnQobXNnLnZhbHVlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgJ3NldC1zdHJva2UtY2FwJzoge1xyXG4gICAgICAgICAgICBmbG93U2V0dGluZ3Muc3Ryb2tlQ2FwWzBdID0gbXNnLnZhbHVlWzBdO1xyXG4gICAgICAgICAgICBmbG93U2V0dGluZ3Muc3Ryb2tlQ2FwWzFdID0gbXNnLnZhbHVlWzFdO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnc2V0LWNvbG9yJzoge1xyXG4gICAgICAgICAgICBjb25zdCBnZXRDb2xvciA9IGZ1bmN0aW9uIChwb3MsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCgocGFyc2VJbnQobXNnLnZhbHVlLnN1YnN0cihwb3MsIDIpLCAxNikgLyAweEZGKS50b1ByZWNpc2lvbigzKSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vI0FCQUNBRFxyXG4gICAgICAgICAgICBmbG93U2V0dGluZ3MuY29sb3IuciA9IGdldENvbG9yKDEsIG1zZy52YWx1ZSk7IC8vIEFCIFxyXG4gICAgICAgICAgICBmbG93U2V0dGluZ3MuY29sb3IuZyA9IGdldENvbG9yKDMsIG1zZy52YWx1ZSk7IC8vIEFDXHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy5jb2xvci5iID0gZ2V0Q29sb3IoNSwgbXNnLnZhbHVlKTsgLy8gQUQgXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlICdzZXQtY29sb3Itb3BhY2l0eSc6IHtcclxuICAgICAgICAgICAgZmxvd1NldHRpbmdzLmNvbG9yLmEgPSBtc2cudmFsdWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlICdzZXQtZGFzaC1wYXR0ZXJuJzoge1xyXG4gICAgICAgICAgICBmbG93U2V0dGluZ3MuZGFzaFBhdHRlcm4gPSBbcGFyc2VJbnQobXNnLnZhbHVlKV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlICdzZXQtYmV6aWVyJzoge1xyXG4gICAgICAgICAgICBmbG93U2V0dGluZ3MuYmV6aWVyID0gbXNnLnZhbHVlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnc2V0LWVuYWJsZWQnOiB7XHJcbiAgICAgICAgICAgIGlmIChtc2cudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGZsb3cuRW5hYmxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmbG93LkRpc2FibGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnc2V0LWZyYW1lbG9ja2VkJzoge1xyXG4gICAgICAgICAgICAoMCwgZmxvd18xLkdldFBsdWdpbkZyYW1lKSgpLmxvY2tlZCA9IG1zZy52YWx1ZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgJ2NhbmNlbCc6IHtcclxuICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkNyZWF0ZUZsb3cgPSBleHBvcnRzLkRpc2FibGUgPSBleHBvcnRzLkVuYWJsZSA9IGV4cG9ydHMuR2V0UGx1Z2luRnJhbWUgPSBleHBvcnRzLkZsb3dTZXR0aW5ncyA9IHZvaWQgMDtcclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tcGx1c3BsdXMgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tbmVzdGVkLXRlcm5hcnkgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbWF4LWNsYXNzZXMtcGVyLWZpbGUgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xyXG5jb25zdCBzZWxlY3Rpb25fMSA9IHJlcXVpcmUoXCIuL3NlbGVjdGlvblwiKTtcclxuY29uc3Qgc25hcHBvaW50c18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3NuYXBwb2ludHNcIikpO1xyXG5jb25zdCB2ZWN0b3JfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi92ZWN0b3JcIikpO1xyXG5jb25zdCBQTFVHSU5fTkFNRSA9ICdJdGVtRnJhbWUnO1xyXG5jb25zdCBGTE9XX0RBVEEgPSAnSUYnO1xyXG5jb25zdCBGTE9XX0NPT1JEU19EQVRBID0gJ0lGQyc7XHJcbmNvbnN0IEZMT1dfU0VUVElOR1NfREFUQSA9ICdJRlMnO1xyXG5jb25zdCBGUkFNRV9EQVRBID0gUExVR0lOX05BTUU7XHJcbmNvbnN0IFVOREVGSU5FRF9JRCA9ICd1bmRlZmluZWQnO1xyXG5jb25zdCBGUkFNRV9PRkZTRVQgPSBuZXcgdmVjdG9yXzEuZGVmYXVsdCgtOTk5OTksIC05OTk5OSk7XHJcbmxldCBEQVRBX05PREVfSUQgPSBVTkRFRklORURfSUQ7XHJcbi8vICNyZWdpb24gRnJhbWVcclxuZnVuY3Rpb24gR2V0UGx1Z2luRnJhbWUoKSB7XHJcbiAgICBsZXQgZm91bmQ7XHJcbiAgICBpZiAoREFUQV9OT0RFX0lEICE9PSBVTkRFRklORURfSUQpIHtcclxuICAgICAgICBmb3VuZCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUoKHgpID0+IHguaWQgPT09IERBVEFfTk9ERV9JRCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmb3VuZCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUoKHgpID0+IHguZ2V0UGx1Z2luRGF0YShGUkFNRV9EQVRBKSA9PT0gJzEnKTtcclxuICAgIH1cclxuICAgIGlmIChmb3VuZCA9PT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IHBsdWdpbkZyYW1lID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcclxuICAgICAgICBwbHVnaW5GcmFtZS5yZXNpemUoMSwgMSk7XHJcbiAgICAgICAgcGx1Z2luRnJhbWUueCA9IEZSQU1FX09GRlNFVC54O1xyXG4gICAgICAgIHBsdWdpbkZyYW1lLnkgPSBGUkFNRV9PRkZTRVQueTtcclxuICAgICAgICBwbHVnaW5GcmFtZS5sb2NrZWQgPSBmYWxzZTtcclxuICAgICAgICBwbHVnaW5GcmFtZS5uYW1lID0gUExVR0lOX05BTUU7XHJcbiAgICAgICAgcGx1Z2luRnJhbWUuY2xpcHNDb250ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgcGx1Z2luRnJhbWUuc2V0UGx1Z2luRGF0YShGUkFNRV9EQVRBLCAnMScpO1xyXG4gICAgICAgIGZvdW5kID0gZmlnbWEuY3VycmVudFBhZ2UuZmluZE9uZSgoeCkgPT4geC5nZXRQbHVnaW5EYXRhKEZSQU1FX0RBVEEpID09PSAnMScpO1xyXG4gICAgICAgIERBVEFfTk9ERV9JRCA9IGZvdW5kLmlkO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgREFUQV9OT0RFX0lEID0gZm91bmQuaWQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZm91bmQ7XHJcbn1cclxuZXhwb3J0cy5HZXRQbHVnaW5GcmFtZSA9IEdldFBsdWdpbkZyYW1lO1xyXG5mdW5jdGlvbiBVcGRhdGVQbHVnaW5GcmFtZSgpIHtcclxuICAgIGZpZ21hLmN1cnJlbnRQYWdlLmluc2VydENoaWxkKGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmxlbmd0aCwgR2V0UGx1Z2luRnJhbWUoKSk7XHJcbn1cclxuY2xhc3MgQ29sb3Ige1xyXG4gICAgY29uc3RydWN0b3IociwgZywgYiwgYSkge1xyXG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KHIgPD0gMS4wICYmIGcgPD0gMS4wICYmIGIgPD0gMS4wICYmIGEgPD0gMS4wKTtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgfVxyXG59XHJcbi8vICNlbmRyZWdpb25cclxuY2xhc3MgRmxvd1NldHRpbmdzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuc3Ryb2tlQ2FwID0gWydOT05FJywgJ0FSUk9XX0VRVUlMQVRFUkFMJ107XHJcbiAgICAgICAgdGhpcy5kYXNoUGF0dGVybiA9IFtdO1xyXG4gICAgICAgIHRoaXMud2VpZ2h0ID0gMTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gbmV3IENvbG9yKDAsIDAsIDAsIDEpO1xyXG4gICAgICAgIHRoaXMuYmV6aWVyID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkZsb3dTZXR0aW5ncyA9IEZsb3dTZXR0aW5ncztcclxuY2xhc3MgRmxvd0Nvb3Jkc0RhdGEge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5zbmFwUG9pbnRzID0gW107XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gU2V0Rmxvd0Nvb3Jkc0RhdGEobm9kZSwgZGF0YSkge1xyXG4gICAgbm9kZS5zZXRQbHVnaW5EYXRhKEZMT1dfQ09PUkRTX0RBVEEsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxufVxyXG5mdW5jdGlvbiBHZXRGbG93Q29vcmRzRGF0YShub2RlKSB7XHJcbiAgICBjb25zdCBkYXRhID0gbm9kZS5nZXRQbHVnaW5EYXRhKEZMT1dfQ09PUkRTX0RBVEEpO1xyXG4gICAgaWYgKGRhdGEubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuZnVuY3Rpb24gU2V0Rmxvd1NldHRpbmdzKG5vZGUsIHNldHRpbmdzKSB7XHJcbiAgICBub2RlLnNldFBsdWdpbkRhdGEoRkxPV19TRVRUSU5HU19EQVRBLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xyXG59XHJcbmZ1bmN0aW9uIEdldEZsb3dTZXR0aW5ncyhub2RlKSB7XHJcbiAgICBjb25zdCBkYXRhID0gbm9kZS5nZXRQbHVnaW5EYXRhKEZMT1dfU0VUVElOR1NfREFUQSk7XHJcbiAgICBpZiAoZGF0YS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZWQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5mdW5jdGlvbiBTZXRGbG93RGF0YShub2RlLCBkYXRhKSB7XHJcbiAgICBub2RlLnNldFBsdWdpbkRhdGEoRkxPV19EQVRBLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbn1cclxuZnVuY3Rpb24gR2V0Rmxvd0RhdGEobm9kZSkge1xyXG4gICAgY29uc3QgZGF0YSA9IG5vZGUuZ2V0UGx1Z2luRGF0YShGTE9XX0RBVEEpO1xyXG4gICAgaWYgKGRhdGEubGVuZ3RoICE9IDApIHtcclxuICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZWQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW107XHJcbn1cclxuZnVuY3Rpb24gUmVtb3ZlRmxvd3Mob2YpIHtcclxuICAgIGxldCBmbG93cyA9IEdldFBsdWdpbkZyYW1lKCkuZmluZENoaWxkcmVuKHggPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBHZXRGbG93RGF0YSh4KTtcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGEuZmluZCh4ID0+IHggPT09IG9mLmlkKSAhPT0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICBmbG93cy5mb3JFYWNoKHggPT4geC5yZW1vdmUoKSk7XHJcbn1cclxuZnVuY3Rpb24gR2V0QWxsRmxvd3MoKSB7XHJcbiAgICByZXR1cm4gR2V0UGx1Z2luRnJhbWUoKS5maW5kQ2hpbGRyZW4oeCA9PiB7IHJldHVybiBHZXRGbG93RGF0YSh4KS5sZW5ndGggPT09IDI7IH0pO1xyXG59XHJcbmZ1bmN0aW9uIEdldEZsb3coZnJvbSwgdG8pIHtcclxuICAgIHJldHVybiBmaWdtYS5jdXJyZW50UGFnZS5maW5kT25lKHggPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBHZXRGbG93RGF0YSh4KTtcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGFbMF0gPT09IGZyb20uaWQgJiYgZGF0YVsxXSA9PT0gdG8uaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIFVwZGF0ZUZsb3dBcHBlYXJhbmNlKGZsb3cpIHtcclxuICAgIGNvbnN0IGZsb3dTZXR0aW5ncyA9IEdldEZsb3dTZXR0aW5ncyhmbG93KTtcclxuICAgIFNldFN0cm9rZUNhcChmbG93LCBmbG93U2V0dGluZ3Muc3Ryb2tlQ2FwWzBdLCBmbG93U2V0dGluZ3Muc3Ryb2tlQ2FwWzFdKTtcclxuICAgIGZsb3cuZGFzaFBhdHRlcm4gPSBmbG93U2V0dGluZ3MuZGFzaFBhdHRlcm47XHJcbiAgICBmbG93LnN0cm9rZVdlaWdodCA9IGZsb3dTZXR0aW5ncy53ZWlnaHQ7XHJcbiAgICBjb25zdCBjb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShmbG93LnN0cm9rZXMpKTtcclxuICAgIGNvcHlbMF0uY29sb3IuciA9IGZsb3dTZXR0aW5ncy5jb2xvci5yO1xyXG4gICAgY29weVswXS5jb2xvci5nID0gZmxvd1NldHRpbmdzLmNvbG9yLmc7XHJcbiAgICBjb3B5WzBdLmNvbG9yLmIgPSBmbG93U2V0dGluZ3MuY29sb3IuYjtcclxuICAgIGNvcHlbMF0ub3BhY2l0eSA9IGZsb3dTZXR0aW5ncy5jb2xvci5hO1xyXG4gICAgZmxvdy5zdHJva2VzID0gY29weTtcclxufVxyXG5mdW5jdGlvbiBVcGRhdGVGbG93X0ludGVybmFsKGZsb3csIGZyb20sIHRvLCBmb3JjZSkge1xyXG4gICAgY29uc3Qgc3AgPSBzbmFwcG9pbnRzXzEuZGVmYXVsdC5HZXRDbG9zZXN0U25hcFBvaW50cyhmcm9tLCB0byk7XHJcbiAgICBjb25zdCB4ID0gc3BbMF0ueCAtIHNwWzFdLng7XHJcbiAgICBjb25zdCB5ID0gc3BbMF0ueSAtIHNwWzFdLnk7XHJcbiAgICBjb25zdCBjb29yZHNEYXRhID0gR2V0Rmxvd0Nvb3Jkc0RhdGEoZmxvdyk7XHJcbiAgICBsZXQgc25hcFBvaW50c0NoYW5nZWQgPSB0cnVlO1xyXG4gICAgLy8gZG9lc250IG1hdHRlciB0byBjYWxjIGNoYW5nZXMgaWYgZm9yY2UgdXBkYXRlXHJcbiAgICBpZiAoIWZvcmNlICYmIGNvb3Jkc0RhdGEgIT09IG51bGwpIHtcclxuICAgICAgICBzbmFwUG9pbnRzQ2hhbmdlZCA9XHJcbiAgICAgICAgICAgIGNvb3Jkc0RhdGEuc25hcFBvaW50c1swXS54ICE9PSBzcFswXS54IHx8XHJcbiAgICAgICAgICAgICAgICBjb29yZHNEYXRhLnNuYXBQb2ludHNbMF0ueSAhPT0gc3BbMF0ueSB8fFxyXG4gICAgICAgICAgICAgICAgY29vcmRzRGF0YS5zbmFwUG9pbnRzWzFdLnggIT09IHNwWzFdLnggfHxcclxuICAgICAgICAgICAgICAgIGNvb3Jkc0RhdGEuc25hcFBvaW50c1sxXS55ICE9PSBzcFsxXS55O1xyXG4gICAgfVxyXG4gICAgaWYgKHNuYXBQb2ludHNDaGFuZ2VkKSB7XHJcbiAgICAgICAgY29uc3QgZmxvd1ggPSBzcFswXS54IC0geCAtIEZSQU1FX09GRlNFVC54O1xyXG4gICAgICAgIGNvbnN0IGZsb3dZID0gc3BbMF0ueSAtIHkgLSBGUkFNRV9PRkZTRVQueTtcclxuICAgICAgICBmbG93LnggPSBmbG93WDtcclxuICAgICAgICBmbG93LnkgPSBmbG93WTtcclxuICAgICAgICBpZiAoR2V0Rmxvd1NldHRpbmdzKGZsb3cpLmJlemllcikge1xyXG4gICAgICAgICAgICBjb25zdCBjWCA9IFswLCAwXTtcclxuICAgICAgICAgICAgY29uc3QgY1kgPSBbMCwgMF07XHJcbiAgICAgICAgICAgIC8vIFRPRE8gUm90YXRpb24gc3VwcG9ydFxyXG4gICAgICAgICAgICAvLyAvLyBFTkRQT0lOVCBJRiBGUk9NIElTIFJJR0hUXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGZyb21SYWRpYW4gPSAoZnJvbSBhcyBMYXlvdXRNaXhpbikucm90YXRpb24gKiAoMy4xNCAvIDE4MCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHRvUmFkaWFuID0gKHRvIGFzIExheW91dE1peGluKS5yb3RhdGlvbiAqICgzLjE0IC8gMTgwKTtcclxuICAgICAgICAgICAgLy8gaWYgKHNwWzBdLl90eXBlID09PSAncmlnaHQnKSB7XHJcbiAgICAgICAgICAgIC8vICAgY1hbMF0gPSB4MiAqIE1hdGguY29zKHRvUmFkaWFuKSArICh5MiAqIE1hdGguc2luKHRvUmFkaWFuKSk7ICBcclxuICAgICAgICAgICAgLy8gICBjWVswXSA9IHgyICogKDIvNSAqIDMuMTQpICogTWF0aC5zaW4oLTEgKiB0b1JhZGlhbikgKyAoeTIgKiBNYXRoLnNpbih0b1JhZGlhbikpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIC8vU1RBUlRQT0lOVCBJRiBUTyBJUyBMRUZUXHJcbiAgICAgICAgICAgIC8vIGlmIChzcFsxXS5fdHlwZSA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgICAgIC8vICAgY1hbMV0gPSB4MiAqIE1hdGguY29zKGZyb21SYWRpYW4pOyAgXHJcbiAgICAgICAgICAgIC8vICAgY1lbMV0gPSB4MiAqICgyLzUqMy4xNCkgKiBNYXRoLnNpbigtMSAqIHRvUmFkaWFuKSArIHkyICogMiAgKiBNYXRoLmNvcyhmcm9tUmFkaWFuKTtcclxuICAgICAgICAgICAgLy8gfSBcclxuICAgICAgICAgICAgY29uc3QgeTIgPSB5ICogMC41O1xyXG4gICAgICAgICAgICBjb25zdCB4MiA9IHggKiAwLjU7XHJcbiAgICAgICAgICAgIGlmIChzcFswXS5fdHlwZSA9PT0gJ3JpZ2h0JyB8fCBzcFswXS5fdHlwZSA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgICAgICAgICBjWFsxXSA9IHgyO1xyXG4gICAgICAgICAgICAgICAgY1lbMV0gPSB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzcFswXS5fdHlwZSA9PT0gJ3RvcCcgfHwgc3BbMF0uX3R5cGUgPT09ICdib3R0b20nKSB7XHJcbiAgICAgICAgICAgICAgICBjWFsxXSA9IHg7XHJcbiAgICAgICAgICAgICAgICBjWVsxXSA9IHkyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzcFsxXS5fdHlwZSA9PT0gJ3JpZ2h0JyB8fCBzcFsxXS5fdHlwZSA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgICAgICAgICBjWFswXSA9IHgyO1xyXG4gICAgICAgICAgICAgICAgY1lbMF0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzcFsxXS5fdHlwZSA9PT0gJ3RvcCcgfHwgc3BbMV0uX3R5cGUgPT09ICdib3R0b20nKSB7XHJcbiAgICAgICAgICAgICAgICBjWFswXSA9IDA7XHJcbiAgICAgICAgICAgICAgICBjWVswXSA9IHkyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZsb3cudmVjdG9yUGF0aHMgPSBbe1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRpbmdSdWxlOiAnRVZFTk9ERCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogYE0gMCAwIEMgJHtjWFswXX0gJHtjWVswXX0gJHtjWFsxXX0gJHtjWVsxXX0gJHt4fSAke3l9YCxcclxuICAgICAgICAgICAgICAgIH1dO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZmxvdy52ZWN0b3JQYXRocyA9IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZGluZ1J1bGU6ICdFVkVOT0REJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBgTSAwIDAgTCAke3h9ICR7eX1gLFxyXG4gICAgICAgICAgICAgICAgfV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFVwZGF0ZUZsb3dBcHBlYXJhbmNlKGZsb3cpO1xyXG4gICAgICAgIGxldCBkYXRhID0gbmV3IEZsb3dDb29yZHNEYXRhKCk7XHJcbiAgICAgICAgZGF0YS5zbmFwUG9pbnRzID0gW25ldyB2ZWN0b3JfMS5kZWZhdWx0KHNwWzBdLngsIHNwWzBdLnkpLCBuZXcgdmVjdG9yXzEuZGVmYXVsdChzcFsxXS54LCBzcFsxXS55KV07XHJcbiAgICAgICAgU2V0Rmxvd0Nvb3Jkc0RhdGEoZmxvdywgZGF0YSk7XHJcbiAgICAgICAgZmxvdy5uYW1lID0gYCR7ZnJvbS5uYW1lfSAtPiAke3RvLm5hbWV9YDtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBVcGRhdGVGbG93KGZsb3csIGZvcmNlID0gZmFsc2UpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBHZXRGbG93RGF0YShmbG93KTtcclxuICAgIGNvbnN0IGZyb20gPSBmaWdtYS5nZXROb2RlQnlJZChkYXRhWzBdKTtcclxuICAgIGNvbnN0IHRvID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoZGF0YVsxXSk7XHJcbiAgICBpZiAoZnJvbSA9PT0gbnVsbCB8fCB0byA9PT0gbnVsbCkge1xyXG4gICAgICAgIGZsb3cucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoZnJvbS5yZW1vdmVkKSB7XHJcbiAgICAgICAgICAgIFJlbW92ZUZsb3dzKGZyb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodG8ucmVtb3ZlZCkge1xyXG4gICAgICAgICAgICBSZW1vdmVGbG93cyh0byk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdG8ucmVtb3ZlZCAmJiAhZnJvbS5yZW1vdmVkKSB7XHJcbiAgICAgICAgICAgIFVwZGF0ZUZsb3dfSW50ZXJuYWwoZmxvdywgZnJvbSwgdG8sIGZvcmNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gQ3JlYXRlRmxvdyhmcm9tLCB0bywgc2V0dGluZ3MpIHtcclxuICAgIGxldCBzdmcgPSBudWxsO1xyXG4gICAgc3ZnID0gR2V0Rmxvdyhmcm9tLCB0byk7XHJcbiAgICBpZiAoc3ZnID09PSBudWxsKSB7XHJcbiAgICAgICAgc3ZnID0gZmlnbWEuY3JlYXRlVmVjdG9yKCk7XHJcbiAgICAgICAgR2V0UGx1Z2luRnJhbWUoKS5hcHBlbmRDaGlsZChzdmcpO1xyXG4gICAgfVxyXG4gICAgLy8gT3JkZXIgaXMgbWF0dGVyIDopXHJcbiAgICBTZXRGbG93U2V0dGluZ3Moc3ZnLCBzZXR0aW5ncyk7XHJcbiAgICBTZXRGbG93RGF0YShzdmcsIFtmcm9tLmlkLCB0by5pZF0pO1xyXG4gICAgVXBkYXRlRmxvdyhzdmcsIHRydWUpO1xyXG59XHJcbmV4cG9ydHMuQ3JlYXRlRmxvdyA9IENyZWF0ZUZsb3c7XHJcbi8vIFRPRE8gQ2lyY2xlIFxyXG5mdW5jdGlvbiBTZXRTdHJva2VDYXAobm9kZSwgc3RhcnQsIGVuZCkge1xyXG4gICAgY29uc3QgY29weSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobm9kZS52ZWN0b3JOZXR3b3JrKSk7XHJcbiAgICBpZiAoXCJzdHJva2VDYXBcIiBpbiBjb3B5LnZlcnRpY2VzW2NvcHkudmVydGljZXMubGVuZ3RoIC0gMV0pIHtcclxuICAgICAgICBjb3B5LnZlcnRpY2VzW2NvcHkudmVydGljZXMubGVuZ3RoIC0gMV0uc3Ryb2tlQ2FwID0gc3RhcnQ7XHJcbiAgICAgICAgY29weS52ZXJ0aWNlc1swXS5zdHJva2VDYXAgPSBlbmQ7XHJcbiAgICB9XHJcbiAgICBub2RlLnZlY3Rvck5ldHdvcmsgPSBjb3B5O1xyXG59XHJcbmxldCB1cGRhdGVGbG93SW50ZXJ2YWxJZCA9IC0xO1xyXG5sZXQgdXBkYXRlRnJhbWVJbnRlcnZhbElkID0gLTE7XHJcbmZ1bmN0aW9uIEVuYWJsZSgpIHtcclxuICAgIEdldFBsdWdpbkZyYW1lKCkubG9ja2VkID0gdHJ1ZTtcclxuICAgIHVwZGF0ZUZsb3dJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIEdldEFsbEZsb3dzKCkuZm9yRWFjaCh4ID0+IHtcclxuICAgICAgICAgICAgVXBkYXRlRmxvdyh4KTtcclxuICAgICAgICB9KTtcclxuICAgIH0sIDEwMCk7XHJcbiAgICB1cGRhdGVGcmFtZUludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgVXBkYXRlUGx1Z2luRnJhbWUoKTtcclxuICAgIH0sIDEwMDApO1xyXG4gICAgKDAsIHNlbGVjdGlvbl8xLlNldE9uU2VsZWN0aW9uSXRlbUFkZGVkKSgoaXRlbSkgPT4ge1xyXG4gICAgfSk7XHJcbiAgICAoMCwgc2VsZWN0aW9uXzEuU2V0T25TZWxlY3Rpb25JdGVtUmVtb3ZlZCkoKGl0ZW0pID0+IHtcclxuICAgICAgICBpZiAoaXRlbS5yZW1vdmVkKSB7XHJcbiAgICAgICAgICAgIFJlbW92ZUZsb3dzKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuRW5hYmxlID0gRW5hYmxlO1xyXG5mdW5jdGlvbiBEaXNhYmxlKCkge1xyXG4gICAgaWYgKHVwZGF0ZUZsb3dJbnRlcnZhbElkICE9PSAtMSkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodXBkYXRlRmxvd0ludGVydmFsSWQpO1xyXG4gICAgfVxyXG4gICAgaWYgKHVwZGF0ZUZyYW1lSW50ZXJ2YWxJZCAhPT0gLTEpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHVwZGF0ZUZyYW1lSW50ZXJ2YWxJZCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5EaXNhYmxlID0gRGlzYWJsZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5VcGRhdGVTZWxlY3Rpb24gPSBleHBvcnRzLkdldFNlbGVjdGlvbiA9IGV4cG9ydHMuU2V0T25TZWxlY3Rpb25JdGVtUmVtb3ZlZCA9IGV4cG9ydHMuU2V0T25TZWxlY3Rpb25JdGVtQWRkZWQgPSBleHBvcnRzLlNldE9uU2VsZWN0aW9uQ2hhbmdlZCA9IHZvaWQgMDtcclxubGV0IGxhc3RTZWxlY3Rpb24gPSBbXTtcclxubGV0IE9uU2VsZWN0aW9uQ2hhbmdlZDtcclxubGV0IE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQ7XHJcbmxldCBPblNlbGVjdGlvbkl0ZW1BZGRlZDtcclxuZnVuY3Rpb24gVXBkYXRlU2VsZWN0aW9uKCkge1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xyXG4gICAgY29uc3QgbGFzdFNlbGVjdGlvbkxlbmd0aCA9IGxhc3RTZWxlY3Rpb24ubGVuZ3RoO1xyXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgLy9yZW1vdmVkXHJcbiAgICBpZiAobGFzdFNlbGVjdGlvbi5sZW5ndGggPiBzZWxlY3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgbGFzdFNlbGVjdGlvbi5mb3JFYWNoKCh4LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gc2VsZWN0aW9uLmZpbmQoKHksIGkyKSA9PiB7IHJldHVybiB4LmlkID09PSB5LmlkOyB9KSAhPT0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAoZm91bmQpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVzdWx0LmZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgICAgIE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQoeCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGFzdFNlbGVjdGlvbiA9IHJlc3VsdDtcclxuICAgIH1cclxuICAgIC8vYWRkZWRcclxuICAgIGVsc2UgaWYgKGxhc3RTZWxlY3Rpb24ubGVuZ3RoIDwgc2VsZWN0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgIHNlbGVjdGlvbi5mb3JFYWNoKCh4LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gbGFzdFNlbGVjdGlvbi5maW5kKCh5LCBpMikgPT4geyByZXR1cm4geC5pZCA9PT0geS5pZDsgfSkgIT09IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgbGFzdFNlbGVjdGlvbi5wdXNoKHgpO1xyXG4gICAgICAgICAgICAgICAgT25TZWxlY3Rpb25JdGVtQWRkZWQoeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vY2hhbmdlZFxyXG4gICAgZWxzZSBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PT0gbGFzdFNlbGVjdGlvbi5sZW5ndGggJiYgc2VsZWN0aW9uLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIGlmIChzZWxlY3Rpb25bMF0uaWQgIT0gbGFzdFNlbGVjdGlvblswXS5pZCkge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChzZWxlY3Rpb25bMF0pO1xyXG4gICAgICAgICAgICBPblNlbGVjdGlvbkl0ZW1BZGRlZChzZWxlY3Rpb25bMF0pO1xyXG4gICAgICAgICAgICBPblNlbGVjdGlvbkl0ZW1SZW1vdmVkKGxhc3RTZWxlY3Rpb25bMF0pO1xyXG4gICAgICAgICAgICBsYXN0U2VsZWN0aW9uID0gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChsYXN0U2VsZWN0aW9uTGVuZ3RoID09PSAxICYmIGxhc3RTZWxlY3Rpb24ubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgT25TZWxlY3Rpb25DaGFuZ2VkKGxhc3RTZWxlY3Rpb24pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuVXBkYXRlU2VsZWN0aW9uID0gVXBkYXRlU2VsZWN0aW9uO1xyXG5mdW5jdGlvbiBHZXRTZWxlY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbGFzdFNlbGVjdGlvbjtcclxufVxyXG5leHBvcnRzLkdldFNlbGVjdGlvbiA9IEdldFNlbGVjdGlvbjtcclxuZnVuY3Rpb24gU2V0T25TZWxlY3Rpb25JdGVtUmVtb3ZlZChjYWxsYmFjaykge1xyXG4gICAgT25TZWxlY3Rpb25JdGVtUmVtb3ZlZCA9IGNhbGxiYWNrO1xyXG59XHJcbmV4cG9ydHMuU2V0T25TZWxlY3Rpb25JdGVtUmVtb3ZlZCA9IFNldE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQ7XHJcbmZ1bmN0aW9uIFNldE9uU2VsZWN0aW9uSXRlbUFkZGVkKGNhbGxiYWNrKSB7XHJcbiAgICBPblNlbGVjdGlvbkl0ZW1BZGRlZCA9IGNhbGxiYWNrO1xyXG59XHJcbmV4cG9ydHMuU2V0T25TZWxlY3Rpb25JdGVtQWRkZWQgPSBTZXRPblNlbGVjdGlvbkl0ZW1BZGRlZDtcclxuZnVuY3Rpb24gU2V0T25TZWxlY3Rpb25DaGFuZ2VkKGNhbGxiYWNrKSB7XHJcbiAgICBPblNlbGVjdGlvbkNoYW5nZWQgPSBjYWxsYmFjaztcclxuICAgIGZpZ21hLm9uKCdzZWxlY3Rpb25jaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgVXBkYXRlU2VsZWN0aW9uKCk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLlNldE9uU2VsZWN0aW9uQ2hhbmdlZCA9IFNldE9uU2VsZWN0aW9uQ2hhbmdlZDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgdmVjdG9yXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vdmVjdG9yXCIpKTtcclxuY2xhc3MgU25hcFBvaW50IGV4dGVuZHMgdmVjdG9yXzEuZGVmYXVsdCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCBfdHlwZSkge1xyXG4gICAgICAgIHN1cGVyKHgsIHkpO1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSBfdHlwZTtcclxuICAgIH1cclxufVxyXG4vLyAjcmVnaW9uIFNuYXBQb2ludHMgIFxyXG5mdW5jdGlvbiBHZXRTbmFwUG9pbnQoeCwgX3R5cGUpIHtcclxuICAgIGxldCByZXN1bHQgPSBuZXcgU25hcFBvaW50KDAsIDAsIF90eXBlKTtcclxuICAgIGNvbnN0IHBpID0gMy4xNCAvIDE4MDtcclxuICAgIGNvbnN0IHJhZGlhbiA9IHgucm90YXRpb24gKiBwaTtcclxuICAgIGlmIChfdHlwZSA9PT0gJ3RvcCcpIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgeGAgPSB4ICsgKHcgLyAyICogY29zKHJvdGF0aW9uKSlcclxuICAgICAgICAgIHlgID0geSAtICh3IC8gMiAqIHNpbihyb3RhdGlvbikpXHJcbiAgICAgICAgKi9cclxuICAgICAgICByZXN1bHQueCA9IHgueCArICh4LndpZHRoICogMC41ICogTWF0aC5jb3MocmFkaWFuKSk7XHJcbiAgICAgICAgcmVzdWx0LnkgPSB4LnkgLSAoeC53aWR0aCAqIDAuNSAqIE1hdGguc2luKHJhZGlhbikpO1xyXG4gICAgfVxyXG4gICAgaWYgKF90eXBlID09PSAncmlnaHQnKSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgIHhgID0geCArICh3ICogY29zKHJvdGF0aW9uKSkgKyAoaC8yICogc2luKHJvdGF0aW9uKSlcclxuICAgICAgICAgIHlgID0geSArIChoLzIgKiBjb3Mocm90YXRpb24pKSAtICh3ICogc2luKHJvdGF0aW9uKSlcclxuICAgICAgICAqL1xyXG4gICAgICAgIHJlc3VsdC54ID0geC54ICsgKHgud2lkdGggKiBNYXRoLmNvcyhyYWRpYW4pKSArICh4LmhlaWdodCAqIDAuNSAqIE1hdGguc2luKHJhZGlhbikpO1xyXG4gICAgICAgIHJlc3VsdC55ID0geC55ICsgKHguaGVpZ2h0ICogMC41ICogTWF0aC5jb3MocmFkaWFuKSkgLSAoeC53aWR0aCAqIE1hdGguc2luKHJhZGlhbikpO1xyXG4gICAgfVxyXG4gICAgaWYgKF90eXBlID09PSAnYm90dG9tJykge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICB4YCA9IHggKyAody8yICogY29zKHJvdGF0aW9uKSkgKyAoaCAqIHNpbihyb3RhdGlvbikpXHJcbiAgICAgICAgICB5YCA9IHkgLSAody8yICogc2luKHJvdGF0aW9uKSkgKyAoaCAqIGNvcyhyb3RhdGlvbikpXHJcbiAgICAgICAgKi9cclxuICAgICAgICByZXN1bHQueCA9IHgueCArICh4LndpZHRoICogMC41ICogTWF0aC5jb3MocmFkaWFuKSkgKyAoeC5oZWlnaHQgKiBNYXRoLnNpbihyYWRpYW4pKTtcclxuICAgICAgICByZXN1bHQueSA9IHgueSArICh4LmhlaWdodCAqIE1hdGguY29zKHJhZGlhbikpIC0gKHgud2lkdGggKiAwLjUgKiBNYXRoLnNpbihyYWRpYW4pKTtcclxuICAgIH1cclxuICAgIGlmIChfdHlwZSA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgIHhgID0geCArIChoLzIgKiBzaW4ocm90YXRpb24pKVxyXG4gICAgICAgICAgeWAgPSB5ICsgKGgvMiAqIGNvcyhyb3RhdGlvbikpXHJcbiAgICAgICAgKi9cclxuICAgICAgICByZXN1bHQueCA9IHgueCArICh4LmhlaWdodCAqIDAuNSAqIE1hdGguc2luKHJhZGlhbikpO1xyXG4gICAgICAgIHJlc3VsdC55ID0geC55ICsgKHguaGVpZ2h0ICogMC41ICogTWF0aC5jb3MocmFkaWFuKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmZ1bmN0aW9uIEdldFNuYXBQb2ludEJ5SWQoeCwgaWQpIHtcclxuICAgIHJldHVybiBHZXRTbmFwUG9pbnQoeCwgaWQgPT09IDAgPyAndG9wJ1xyXG4gICAgICAgIDogaWQgPT09IDEgPyAncmlnaHQnXHJcbiAgICAgICAgICAgIDogaWQgPT09IDIgPyAnYm90dG9tJyA6ICdsZWZ0Jyk7XHJcbn1cclxuZnVuY3Rpb24gR2V0Q2xvc2VzdFNuYXBQb2ludHMoZnJvbSwgdG8pIHtcclxuICAgIC8qXHJcbiAgICAgIG8gLSBsb2NhdGlvbiAvIHNuYXBwb2ludFxyXG4gICAgICB4IC0gc25hcHBvaW50XHJcbiAgICAgICsgLSBhbmdsZVxyXG4gICAgICAtXHJcbiAgICAgICAgby0tLS0teC0tLS0tK1xyXG4gICAgICAgIHwgICAgICAgICAgIHxcclxuICAgICAgICB4ICAgICAgICAgICB4XHJcbiAgICAgICAgfCAgICAgICAgICAgfFxyXG4gICAgICAgICstLS0tLXgtLS0tLStcclxuICAgICAgICAgICAgICAgICAgICAgICtcclxuICAgICovXHJcbiAgICBjb25zdCByZXN1bHQgPSBbXHJcbiAgICAgICAgR2V0U25hcFBvaW50QnlJZChmcm9tLCAwKSxcclxuICAgICAgICBHZXRTbmFwUG9pbnRCeUlkKHRvLCAwKSxcclxuICAgIF07XHJcbiAgICBsZXQgbGFzdERpc3RhbmNlID0gOTk5OTk5OTk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHMxID0gR2V0U25hcFBvaW50QnlJZChmcm9tLCBpKTtcclxuICAgICAgICBmb3IgKGxldCBpMiA9IDA7IGkyIDwgNDsgaTIrKykge1xyXG4gICAgICAgICAgICBjb25zdCBzMiA9IEdldFNuYXBQb2ludEJ5SWQodG8sIGkyKTtcclxuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBzMS5kaXN0KHMyKTtcclxuICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgbGFzdERpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbMF0gPSBzMTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFsxXSA9IHMyO1xyXG4gICAgICAgICAgICAgICAgbGFzdERpc3RhbmNlID0gZGlzdGFuY2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IHsgR2V0U25hcFBvaW50LCBHZXRTbmFwUG9pbnRCeUlkLCBHZXRDbG9zZXN0U25hcFBvaW50cyB9O1xyXG4vLyAjZW5kcmVnaW9uXHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8vICNyZWdpb24gVmVjdG9yXHJcbmNsYXNzIFZlY3RvcjJEIHtcclxuICAgIGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcbiAgICBkaXN0KHRvKSB7XHJcbiAgICAgICAgY29uc3QgeGQgPSB0aGlzLnggLSB0by54O1xyXG4gICAgICAgIGNvbnN0IHlkID0gdGhpcy55IC0gdG8ueTtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHhkICogeGQgKyB5ZCAqIHlkKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBWZWN0b3IyRDtcclxuLy8gI2VuZHJlZ2lvblxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY29kZS50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==