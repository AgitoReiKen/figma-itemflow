/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/* eslint-disable default-case */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
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
const selection = __importStar(__webpack_require__(/*! ./selection */ "./src/selection.ts"));
const flow = __importStar(__webpack_require__(/*! ./flow */ "./src/flow.ts"));
figma.showUI(__html__);
// TODO check for removed 
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
    console.log(msg);
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
        case 'set-dash-pattern': {
            flowSettings.dashPattern = [parseInt(msg.value)];
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
exports.CreateFlow = exports.Disable = exports.Enable = exports.FlowSettings = void 0;
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */
const selection_1 = __webpack_require__(/*! ./selection */ "./src/selection.ts");
const snappoints_1 = __importDefault(__webpack_require__(/*! ./snappoints */ "./src/snappoints.ts"));
const vector_1 = __importDefault(__webpack_require__(/*! ./vector */ "./src/vector.ts"));
const console_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'console'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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
function UpdatePluginFrame() {
    figma.currentPage.insertChild(figma.currentPage.children.length, GetPluginFrame());
}
class Color {
    constructor(r, g, b, a) {
        (0, console_1.assert)(r <= 1.0 && g <= 1.0 && b <= 1.0 && a <= 1.0);
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
    console.log(copy[0]);
    copy[0].color.r = 0;
    copy[0].color.g = 1;
    copy[0].color.b = 1;
    flow.strokes = copy;
}
function UpdateFlow_Internal(flow, from, to) {
    const sp = snappoints_1.default.GetClosestSnapPoints(from, to);
    const x = sp[0].x - sp[1].x;
    const y = sp[0].y - sp[1].y;
    const coordsData = GetFlowCoordsData(flow);
    let snapPointsChanged = true;
    if (coordsData !== null) {
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
        flow.vectorPaths = [{
                windingRule: 'EVENODD',
                data: `M 0 0 L ${x} ${y} Z`,
            }];
        UpdateFlowAppearance(flow);
        let data = new FlowCoordsData();
        data.snapPoints = [new vector_1.default(sp[0].x, sp[0].y), new vector_1.default(sp[1].x, sp[1].y)];
        SetFlowCoordsData(flow, data);
        flow.name = `${from.name} -> ${to.name}`;
    }
}
// #region Flow
function UpdateFlow(flow) {
    const data = GetFlowData(flow);
    const from = figma.getNodeById(data[0]);
    const to = figma.getNodeById(data[1]);
    if (from.removed) {
        RemoveFlows(from);
    }
    if (to.removed) {
        RemoveFlows(to);
    }
    if (!to.removed && !from.removed) {
        UpdateFlow_Internal(flow, from, to);
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
    UpdateFlow(svg);
    UpdateFlowAppearance(svg); // Also called in updateflow, but as updateflow is optimized for changes it doesn't change the appearance until snappoint is moved
}
exports.CreateFlow = CreateFlow;
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
    updateFlowIntervalId = setInterval(() => {
        GetAllFlows().forEach(x => {
            UpdateFlow(x);
        });
    }, 50);
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
    let result = [];
    //removed
    if (lastSelection.length > selection.length) {
        lastSelection.forEach((x, i) => {
            const found = selection.find((y, i2) => { return x.id === y.id; });
            if (found != null) {
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
            const found = lastSelection.find((y, i2) => { return x.id === y.id; });
            if (found == null) {
                lastSelection.push(x);
                OnSelectionItemAdded(x);
            }
        });
    }
    //bug
    else {
    }
    if (lastSelection.length === 2) {
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
        // setInterval(UpdateFlow, 200);
        if (figma.currentPage.selection.length > 1) {
            // check if it doesnt have arrow attached
            // logic is to attach/remove from -2 to -1
            // 0
            // 1
            // 2
            // 3
        }
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
/* eslint-disable no-nested-ternary */
const vector_1 = __importDefault(__webpack_require__(/*! ./vector */ "./src/vector.ts"));
class SnapPoint extends vector_1.default {
    constructor(x, y, _type) {
        super(x, y);
        this._type = _type;
    }
}
// #region SnapPoints 
// TODO Rotation support
function GetSnapPoint(x, _type) {
    let result = new SnapPoint(0, 0, _type);
    if (_type === 'top') {
        result.x = x.x + (x.width * 0.5);
        result.y = x.y;
    }
    if (_type === 'right') {
        result.x = x.x + x.width;
        result.y = x.y + (x.height * 0.5);
    }
    if (_type === 'bottom') {
        result.x = x.x + (x.width * 0.5);
        result.y = x.y + x.height;
    }
    if (_type === 'left') {
        result.x = x.x;
        result.y = x.y + (x.height * 0.5);
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
    const Map = [
        ['top', 'bottom'],
        ['right', 'left'],
        ['bottom', 'top'],
        ['left', 'right'],
    ];
    const result = [
        GetSnapPointById(from, 0),
        GetSnapPointById(to, 0),
    ];
    // on top 
    // on bottom
    // on the same 
    let lastDistance = 99999999;
    for (let i = 0; i < Map.length; i++) {
        const s1 = GetSnapPoint(from, Map[i][0]);
        const s2 = GetSnapPoint(to, Map[i][1]);
        const distance = s1.dist(s2);
        if (distance < lastDistance) {
            result[0] = s1;
            result[1] = s2;
            lastDistance = distance;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlLEtBQUs7QUFDcEI7Ozs7Ozs7Ozs7O0FDaEZhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlO0FBQ2Y7Ozs7Ozs7VUNmQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vSXRlbUZsb3cvLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9JdGVtRmxvdy8uL3NyYy9mbG93LnRzIiwid2VicGFjazovL0l0ZW1GbG93Ly4vc3JjL3NlbGVjdGlvbi50cyIsIndlYnBhY2s6Ly9JdGVtRmxvdy8uL3NyYy9zbmFwcG9pbnRzLnRzIiwid2VicGFjazovL0l0ZW1GbG93Ly4vc3JjL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly9JdGVtRmxvdy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9JdGVtRmxvdy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0l0ZW1GbG93L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9JdGVtRmxvdy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qIGVzbGludC1kaXNhYmxlIGRlZmF1bHQtY2FzZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wbHVzcGx1cyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1uZXN0ZWQtdGVybmFyeSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtY2xhc3Nlcy1wZXItZmlsZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufSk7XHJcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHNlbGVjdGlvbiA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9zZWxlY3Rpb25cIikpO1xyXG5jb25zdCBmbG93ID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2Zsb3dcIikpO1xyXG5maWdtYS5zaG93VUkoX19odG1sX18pO1xyXG4vLyBUT0RPIGNoZWNrIGZvciByZW1vdmVkIFxyXG5jb25zdCBmbG93U2V0dGluZ3MgPSBuZXcgZmxvdy5GbG93U2V0dGluZ3MoKTtcclxuLyogdG9kbyB1cGRhdGUgeiBpbmRleCAqL1xyXG5mbG93LkVuYWJsZSgpO1xyXG5zZWxlY3Rpb24uU2V0T25TZWxlY3Rpb25DaGFuZ2VkKChzZWxlY3Rpb24pID0+IHtcclxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgZmxvdy5DcmVhdGVGbG93KHNlbGVjdGlvblswXSwgc2VsZWN0aW9uWzFdLCBmbG93U2V0dGluZ3MpO1xyXG4gICAgfVxyXG59KTtcclxuZmlnbWEub24oJ2Nsb3NlJywgKCkgPT4geyBmbG93LkRpc2FibGUoKTsgfSk7XHJcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IChtc2cpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKG1zZyk7XHJcbiAgICBzd2l0Y2ggKG1zZy50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnc2V0LXN0cm9rZS13ZWlnaHQnOiB7XHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy53ZWlnaHQgPSBwYXJzZUludChtc2cudmFsdWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnc2V0LXN0cm9rZS1jYXAnOiB7XHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy5zdHJva2VDYXBbMF0gPSBtc2cudmFsdWVbMF07XHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy5zdHJva2VDYXBbMV0gPSBtc2cudmFsdWVbMV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlICdzZXQtZGFzaC1wYXR0ZXJuJzoge1xyXG4gICAgICAgICAgICBmbG93U2V0dGluZ3MuZGFzaFBhdHRlcm4gPSBbcGFyc2VJbnQobXNnLnZhbHVlKV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlICdjYW5jZWwnOiB7XHJcbiAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5DcmVhdGVGbG93ID0gZXhwb3J0cy5EaXNhYmxlID0gZXhwb3J0cy5FbmFibGUgPSBleHBvcnRzLkZsb3dTZXR0aW5ncyA9IHZvaWQgMDtcclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tcGx1c3BsdXMgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tbmVzdGVkLXRlcm5hcnkgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbWF4LWNsYXNzZXMtcGVyLWZpbGUgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xyXG5jb25zdCBzZWxlY3Rpb25fMSA9IHJlcXVpcmUoXCIuL3NlbGVjdGlvblwiKTtcclxuY29uc3Qgc25hcHBvaW50c18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3NuYXBwb2ludHNcIikpO1xyXG5jb25zdCB2ZWN0b3JfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi92ZWN0b3JcIikpO1xyXG5jb25zdCBjb25zb2xlXzEgPSByZXF1aXJlKFwiY29uc29sZVwiKTtcclxuY29uc3QgUExVR0lOX05BTUUgPSAnSXRlbUZyYW1lJztcclxuY29uc3QgRkxPV19EQVRBID0gJ0lGJztcclxuY29uc3QgRkxPV19DT09SRFNfREFUQSA9ICdJRkMnO1xyXG5jb25zdCBGTE9XX1NFVFRJTkdTX0RBVEEgPSAnSUZTJztcclxuY29uc3QgRlJBTUVfREFUQSA9IFBMVUdJTl9OQU1FO1xyXG5jb25zdCBVTkRFRklORURfSUQgPSAndW5kZWZpbmVkJztcclxuY29uc3QgRlJBTUVfT0ZGU0VUID0gbmV3IHZlY3Rvcl8xLmRlZmF1bHQoLTk5OTk5LCAtOTk5OTkpO1xyXG5sZXQgREFUQV9OT0RFX0lEID0gVU5ERUZJTkVEX0lEO1xyXG4vLyAjcmVnaW9uIEZyYW1lXHJcbmZ1bmN0aW9uIEdldFBsdWdpbkZyYW1lKCkge1xyXG4gICAgbGV0IGZvdW5kO1xyXG4gICAgaWYgKERBVEFfTk9ERV9JRCAhPT0gVU5ERUZJTkVEX0lEKSB7XHJcbiAgICAgICAgZm91bmQgPSBmaWdtYS5jdXJyZW50UGFnZS5maW5kT25lKCh4KSA9PiB4LmlkID09PSBEQVRBX05PREVfSUQpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZm91bmQgPSBmaWdtYS5jdXJyZW50UGFnZS5maW5kT25lKCh4KSA9PiB4LmdldFBsdWdpbkRhdGEoRlJBTUVfREFUQSkgPT09ICcxJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoZm91bmQgPT09IG51bGwpIHtcclxuICAgICAgICBjb25zdCBwbHVnaW5GcmFtZSA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XHJcbiAgICAgICAgcGx1Z2luRnJhbWUucmVzaXplKDEsIDEpO1xyXG4gICAgICAgIHBsdWdpbkZyYW1lLnggPSBGUkFNRV9PRkZTRVQueDtcclxuICAgICAgICBwbHVnaW5GcmFtZS55ID0gRlJBTUVfT0ZGU0VULnk7XHJcbiAgICAgICAgcGx1Z2luRnJhbWUubG9ja2VkID0gZmFsc2U7XHJcbiAgICAgICAgcGx1Z2luRnJhbWUubmFtZSA9IFBMVUdJTl9OQU1FO1xyXG4gICAgICAgIHBsdWdpbkZyYW1lLmNsaXBzQ29udGVudCA9IGZhbHNlO1xyXG4gICAgICAgIHBsdWdpbkZyYW1lLnNldFBsdWdpbkRhdGEoRlJBTUVfREFUQSwgJzEnKTtcclxuICAgICAgICBmb3VuZCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUoKHgpID0+IHguZ2V0UGx1Z2luRGF0YShGUkFNRV9EQVRBKSA9PT0gJzEnKTtcclxuICAgICAgICBEQVRBX05PREVfSUQgPSBmb3VuZC5pZDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIERBVEFfTk9ERV9JRCA9IGZvdW5kLmlkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZvdW5kO1xyXG59XHJcbmZ1bmN0aW9uIFVwZGF0ZVBsdWdpbkZyYW1lKCkge1xyXG4gICAgZmlnbWEuY3VycmVudFBhZ2UuaW5zZXJ0Q2hpbGQoZmlnbWEuY3VycmVudFBhZ2UuY2hpbGRyZW4ubGVuZ3RoLCBHZXRQbHVnaW5GcmFtZSgpKTtcclxufVxyXG5jbGFzcyBDb2xvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihyLCBnLCBiLCBhKSB7XHJcbiAgICAgICAgKDAsIGNvbnNvbGVfMS5hc3NlcnQpKHIgPD0gMS4wICYmIGcgPD0gMS4wICYmIGIgPD0gMS4wICYmIGEgPD0gMS4wKTtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgfVxyXG59XHJcbi8vICNlbmRyZWdpb25cclxuY2xhc3MgRmxvd1NldHRpbmdzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuc3Ryb2tlQ2FwID0gWydOT05FJywgJ0FSUk9XX0VRVUlMQVRFUkFMJ107XHJcbiAgICAgICAgdGhpcy5kYXNoUGF0dGVybiA9IFtdO1xyXG4gICAgICAgIHRoaXMud2VpZ2h0ID0gMTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkZsb3dTZXR0aW5ncyA9IEZsb3dTZXR0aW5ncztcclxuY2xhc3MgRmxvd0Nvb3Jkc0RhdGEge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5zbmFwUG9pbnRzID0gW107XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gU2V0Rmxvd0Nvb3Jkc0RhdGEobm9kZSwgZGF0YSkge1xyXG4gICAgbm9kZS5zZXRQbHVnaW5EYXRhKEZMT1dfQ09PUkRTX0RBVEEsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxufVxyXG5mdW5jdGlvbiBHZXRGbG93Q29vcmRzRGF0YShub2RlKSB7XHJcbiAgICBjb25zdCBkYXRhID0gbm9kZS5nZXRQbHVnaW5EYXRhKEZMT1dfQ09PUkRTX0RBVEEpO1xyXG4gICAgaWYgKGRhdGEubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuZnVuY3Rpb24gU2V0Rmxvd1NldHRpbmdzKG5vZGUsIHNldHRpbmdzKSB7XHJcbiAgICBub2RlLnNldFBsdWdpbkRhdGEoRkxPV19TRVRUSU5HU19EQVRBLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xyXG59XHJcbmZ1bmN0aW9uIEdldEZsb3dTZXR0aW5ncyhub2RlKSB7XHJcbiAgICBjb25zdCBkYXRhID0gbm9kZS5nZXRQbHVnaW5EYXRhKEZMT1dfU0VUVElOR1NfREFUQSk7XHJcbiAgICBpZiAoZGF0YS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZWQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5mdW5jdGlvbiBTZXRGbG93RGF0YShub2RlLCBkYXRhKSB7XHJcbiAgICBub2RlLnNldFBsdWdpbkRhdGEoRkxPV19EQVRBLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbn1cclxuZnVuY3Rpb24gR2V0Rmxvd0RhdGEobm9kZSkge1xyXG4gICAgY29uc3QgZGF0YSA9IG5vZGUuZ2V0UGx1Z2luRGF0YShGTE9XX0RBVEEpO1xyXG4gICAgaWYgKGRhdGEubGVuZ3RoICE9IDApIHtcclxuICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZWQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW107XHJcbn1cclxuZnVuY3Rpb24gUmVtb3ZlRmxvd3Mob2YpIHtcclxuICAgIGxldCBmbG93cyA9IEdldFBsdWdpbkZyYW1lKCkuZmluZENoaWxkcmVuKHggPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBHZXRGbG93RGF0YSh4KTtcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGEuZmluZCh4ID0+IHggPT09IG9mLmlkKSAhPT0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICBmbG93cy5mb3JFYWNoKHggPT4geC5yZW1vdmUoKSk7XHJcbn1cclxuZnVuY3Rpb24gR2V0QWxsRmxvd3MoKSB7XHJcbiAgICByZXR1cm4gR2V0UGx1Z2luRnJhbWUoKS5maW5kQ2hpbGRyZW4oeCA9PiB7IHJldHVybiBHZXRGbG93RGF0YSh4KS5sZW5ndGggPT09IDI7IH0pO1xyXG59XHJcbmZ1bmN0aW9uIEdldEZsb3coZnJvbSwgdG8pIHtcclxuICAgIHJldHVybiBmaWdtYS5jdXJyZW50UGFnZS5maW5kT25lKHggPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBHZXRGbG93RGF0YSh4KTtcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGFbMF0gPT09IGZyb20uaWQgJiYgZGF0YVsxXSA9PT0gdG8uaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIFVwZGF0ZUZsb3dBcHBlYXJhbmNlKGZsb3cpIHtcclxuICAgIGNvbnN0IGZsb3dTZXR0aW5ncyA9IEdldEZsb3dTZXR0aW5ncyhmbG93KTtcclxuICAgIFNldFN0cm9rZUNhcChmbG93LCBmbG93U2V0dGluZ3Muc3Ryb2tlQ2FwWzBdLCBmbG93U2V0dGluZ3Muc3Ryb2tlQ2FwWzFdKTtcclxuICAgIGZsb3cuZGFzaFBhdHRlcm4gPSBmbG93U2V0dGluZ3MuZGFzaFBhdHRlcm47XHJcbiAgICBmbG93LnN0cm9rZVdlaWdodCA9IGZsb3dTZXR0aW5ncy53ZWlnaHQ7XHJcbiAgICBjb25zdCBjb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShmbG93LnN0cm9rZXMpKTtcclxuICAgIGNvbnNvbGUubG9nKGNvcHlbMF0pO1xyXG4gICAgY29weVswXS5jb2xvci5yID0gMDtcclxuICAgIGNvcHlbMF0uY29sb3IuZyA9IDE7XHJcbiAgICBjb3B5WzBdLmNvbG9yLmIgPSAxO1xyXG4gICAgZmxvdy5zdHJva2VzID0gY29weTtcclxufVxyXG5mdW5jdGlvbiBVcGRhdGVGbG93X0ludGVybmFsKGZsb3csIGZyb20sIHRvKSB7XHJcbiAgICBjb25zdCBzcCA9IHNuYXBwb2ludHNfMS5kZWZhdWx0LkdldENsb3Nlc3RTbmFwUG9pbnRzKGZyb20sIHRvKTtcclxuICAgIGNvbnN0IHggPSBzcFswXS54IC0gc3BbMV0ueDtcclxuICAgIGNvbnN0IHkgPSBzcFswXS55IC0gc3BbMV0ueTtcclxuICAgIGNvbnN0IGNvb3Jkc0RhdGEgPSBHZXRGbG93Q29vcmRzRGF0YShmbG93KTtcclxuICAgIGxldCBzbmFwUG9pbnRzQ2hhbmdlZCA9IHRydWU7XHJcbiAgICBpZiAoY29vcmRzRGF0YSAhPT0gbnVsbCkge1xyXG4gICAgICAgIHNuYXBQb2ludHNDaGFuZ2VkID1cclxuICAgICAgICAgICAgY29vcmRzRGF0YS5zbmFwUG9pbnRzWzBdLnggIT09IHNwWzBdLnggfHxcclxuICAgICAgICAgICAgICAgIGNvb3Jkc0RhdGEuc25hcFBvaW50c1swXS55ICE9PSBzcFswXS55IHx8XHJcbiAgICAgICAgICAgICAgICBjb29yZHNEYXRhLnNuYXBQb2ludHNbMV0ueCAhPT0gc3BbMV0ueCB8fFxyXG4gICAgICAgICAgICAgICAgY29vcmRzRGF0YS5zbmFwUG9pbnRzWzFdLnkgIT09IHNwWzFdLnk7XHJcbiAgICB9XHJcbiAgICBpZiAoc25hcFBvaW50c0NoYW5nZWQpIHtcclxuICAgICAgICBjb25zdCBmbG93WCA9IHNwWzBdLnggLSB4IC0gRlJBTUVfT0ZGU0VULng7XHJcbiAgICAgICAgY29uc3QgZmxvd1kgPSBzcFswXS55IC0geSAtIEZSQU1FX09GRlNFVC55O1xyXG4gICAgICAgIGZsb3cueCA9IGZsb3dYO1xyXG4gICAgICAgIGZsb3cueSA9IGZsb3dZO1xyXG4gICAgICAgIGZsb3cudmVjdG9yUGF0aHMgPSBbe1xyXG4gICAgICAgICAgICAgICAgd2luZGluZ1J1bGU6ICdFVkVOT0REJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGBNIDAgMCBMICR7eH0gJHt5fSBaYCxcclxuICAgICAgICAgICAgfV07XHJcbiAgICAgICAgVXBkYXRlRmxvd0FwcGVhcmFuY2UoZmxvdyk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBuZXcgRmxvd0Nvb3Jkc0RhdGEoKTtcclxuICAgICAgICBkYXRhLnNuYXBQb2ludHMgPSBbbmV3IHZlY3Rvcl8xLmRlZmF1bHQoc3BbMF0ueCwgc3BbMF0ueSksIG5ldyB2ZWN0b3JfMS5kZWZhdWx0KHNwWzFdLngsIHNwWzFdLnkpXTtcclxuICAgICAgICBTZXRGbG93Q29vcmRzRGF0YShmbG93LCBkYXRhKTtcclxuICAgICAgICBmbG93Lm5hbWUgPSBgJHtmcm9tLm5hbWV9IC0+ICR7dG8ubmFtZX1gO1xyXG4gICAgfVxyXG59XHJcbi8vICNyZWdpb24gRmxvd1xyXG5mdW5jdGlvbiBVcGRhdGVGbG93KGZsb3cpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBHZXRGbG93RGF0YShmbG93KTtcclxuICAgIGNvbnN0IGZyb20gPSBmaWdtYS5nZXROb2RlQnlJZChkYXRhWzBdKTtcclxuICAgIGNvbnN0IHRvID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoZGF0YVsxXSk7XHJcbiAgICBpZiAoZnJvbS5yZW1vdmVkKSB7XHJcbiAgICAgICAgUmVtb3ZlRmxvd3MoZnJvbSk7XHJcbiAgICB9XHJcbiAgICBpZiAodG8ucmVtb3ZlZCkge1xyXG4gICAgICAgIFJlbW92ZUZsb3dzKHRvKTtcclxuICAgIH1cclxuICAgIGlmICghdG8ucmVtb3ZlZCAmJiAhZnJvbS5yZW1vdmVkKSB7XHJcbiAgICAgICAgVXBkYXRlRmxvd19JbnRlcm5hbChmbG93LCBmcm9tLCB0byk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gQ3JlYXRlRmxvdyhmcm9tLCB0bywgc2V0dGluZ3MpIHtcclxuICAgIGxldCBzdmcgPSBudWxsO1xyXG4gICAgc3ZnID0gR2V0Rmxvdyhmcm9tLCB0byk7XHJcbiAgICBpZiAoc3ZnID09PSBudWxsKSB7XHJcbiAgICAgICAgc3ZnID0gZmlnbWEuY3JlYXRlVmVjdG9yKCk7XHJcbiAgICAgICAgR2V0UGx1Z2luRnJhbWUoKS5hcHBlbmRDaGlsZChzdmcpO1xyXG4gICAgfVxyXG4gICAgLy8gT3JkZXIgaXMgbWF0dGVyIDopXHJcbiAgICBTZXRGbG93U2V0dGluZ3Moc3ZnLCBzZXR0aW5ncyk7XHJcbiAgICBTZXRGbG93RGF0YShzdmcsIFtmcm9tLmlkLCB0by5pZF0pO1xyXG4gICAgVXBkYXRlRmxvdyhzdmcpO1xyXG4gICAgVXBkYXRlRmxvd0FwcGVhcmFuY2Uoc3ZnKTsgLy8gQWxzbyBjYWxsZWQgaW4gdXBkYXRlZmxvdywgYnV0IGFzIHVwZGF0ZWZsb3cgaXMgb3B0aW1pemVkIGZvciBjaGFuZ2VzIGl0IGRvZXNuJ3QgY2hhbmdlIHRoZSBhcHBlYXJhbmNlIHVudGlsIHNuYXBwb2ludCBpcyBtb3ZlZFxyXG59XHJcbmV4cG9ydHMuQ3JlYXRlRmxvdyA9IENyZWF0ZUZsb3c7XHJcbmZ1bmN0aW9uIFNldFN0cm9rZUNhcChub2RlLCBzdGFydCwgZW5kKSB7XHJcbiAgICBjb25zdCBjb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShub2RlLnZlY3Rvck5ldHdvcmspKTtcclxuICAgIGlmIChcInN0cm9rZUNhcFwiIGluIGNvcHkudmVydGljZXNbY29weS52ZXJ0aWNlcy5sZW5ndGggLSAxXSkge1xyXG4gICAgICAgIGNvcHkudmVydGljZXNbY29weS52ZXJ0aWNlcy5sZW5ndGggLSAxXS5zdHJva2VDYXAgPSBzdGFydDtcclxuICAgICAgICBjb3B5LnZlcnRpY2VzWzBdLnN0cm9rZUNhcCA9IGVuZDtcclxuICAgIH1cclxuICAgIG5vZGUudmVjdG9yTmV0d29yayA9IGNvcHk7XHJcbn1cclxubGV0IHVwZGF0ZUZsb3dJbnRlcnZhbElkID0gLTE7XHJcbmxldCB1cGRhdGVGcmFtZUludGVydmFsSWQgPSAtMTtcclxuZnVuY3Rpb24gRW5hYmxlKCkge1xyXG4gICAgdXBkYXRlRmxvd0ludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgR2V0QWxsRmxvd3MoKS5mb3JFYWNoKHggPT4ge1xyXG4gICAgICAgICAgICBVcGRhdGVGbG93KHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSwgNTApO1xyXG4gICAgdXBkYXRlRnJhbWVJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIFVwZGF0ZVBsdWdpbkZyYW1lKCk7XHJcbiAgICB9LCAxMDAwKTtcclxuICAgICgwLCBzZWxlY3Rpb25fMS5TZXRPblNlbGVjdGlvbkl0ZW1BZGRlZCkoKGl0ZW0pID0+IHtcclxuICAgIH0pO1xyXG4gICAgKDAsIHNlbGVjdGlvbl8xLlNldE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQpKChpdGVtKSA9PiB7XHJcbiAgICAgICAgaWYgKGl0ZW0ucmVtb3ZlZCkge1xyXG4gICAgICAgICAgICBSZW1vdmVGbG93cyhpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLkVuYWJsZSA9IEVuYWJsZTtcclxuZnVuY3Rpb24gRGlzYWJsZSgpIHtcclxuICAgIGlmICh1cGRhdGVGbG93SW50ZXJ2YWxJZCAhPT0gLTEpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHVwZGF0ZUZsb3dJbnRlcnZhbElkKTtcclxuICAgIH1cclxuICAgIGlmICh1cGRhdGVGcmFtZUludGVydmFsSWQgIT09IC0xKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh1cGRhdGVGcmFtZUludGVydmFsSWQpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRGlzYWJsZSA9IERpc2FibGU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuVXBkYXRlU2VsZWN0aW9uID0gZXhwb3J0cy5HZXRTZWxlY3Rpb24gPSBleHBvcnRzLlNldE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQgPSBleHBvcnRzLlNldE9uU2VsZWN0aW9uSXRlbUFkZGVkID0gZXhwb3J0cy5TZXRPblNlbGVjdGlvbkNoYW5nZWQgPSB2b2lkIDA7XHJcbmxldCBsYXN0U2VsZWN0aW9uID0gW107XHJcbmxldCBPblNlbGVjdGlvbkNoYW5nZWQ7XHJcbmxldCBPblNlbGVjdGlvbkl0ZW1SZW1vdmVkO1xyXG5sZXQgT25TZWxlY3Rpb25JdGVtQWRkZWQ7XHJcbmZ1bmN0aW9uIFVwZGF0ZVNlbGVjdGlvbigpIHtcclxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcclxuICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgIC8vcmVtb3ZlZFxyXG4gICAgaWYgKGxhc3RTZWxlY3Rpb24ubGVuZ3RoID4gc2VsZWN0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgIGxhc3RTZWxlY3Rpb24uZm9yRWFjaCgoeCwgaSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IHNlbGVjdGlvbi5maW5kKCh5LCBpMikgPT4geyByZXR1cm4geC5pZCA9PT0geS5pZDsgfSk7XHJcbiAgICAgICAgICAgIGlmIChmb3VuZCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJlc3VsdC5mb3JFYWNoKHggPT4ge1xyXG4gICAgICAgICAgICBPblNlbGVjdGlvbkl0ZW1SZW1vdmVkKHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxhc3RTZWxlY3Rpb24gPSByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICAvL2FkZGVkXHJcbiAgICBlbHNlIGlmIChsYXN0U2VsZWN0aW9uLmxlbmd0aCA8IHNlbGVjdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICBzZWxlY3Rpb24uZm9yRWFjaCgoeCwgaSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IGxhc3RTZWxlY3Rpb24uZmluZCgoeSwgaTIpID0+IHsgcmV0dXJuIHguaWQgPT09IHkuaWQ7IH0pO1xyXG4gICAgICAgICAgICBpZiAoZm91bmQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbGFzdFNlbGVjdGlvbi5wdXNoKHgpO1xyXG4gICAgICAgICAgICAgICAgT25TZWxlY3Rpb25JdGVtQWRkZWQoeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vYnVnXHJcbiAgICBlbHNlIHtcclxuICAgIH1cclxuICAgIGlmIChsYXN0U2VsZWN0aW9uLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgIE9uU2VsZWN0aW9uQ2hhbmdlZChsYXN0U2VsZWN0aW9uKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlVwZGF0ZVNlbGVjdGlvbiA9IFVwZGF0ZVNlbGVjdGlvbjtcclxuZnVuY3Rpb24gR2V0U2VsZWN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGxhc3RTZWxlY3Rpb247XHJcbn1cclxuZXhwb3J0cy5HZXRTZWxlY3Rpb24gPSBHZXRTZWxlY3Rpb247XHJcbmZ1bmN0aW9uIFNldE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQoY2FsbGJhY2spIHtcclxuICAgIE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQgPSBjYWxsYmFjaztcclxufVxyXG5leHBvcnRzLlNldE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQgPSBTZXRPblNlbGVjdGlvbkl0ZW1SZW1vdmVkO1xyXG5mdW5jdGlvbiBTZXRPblNlbGVjdGlvbkl0ZW1BZGRlZChjYWxsYmFjaykge1xyXG4gICAgT25TZWxlY3Rpb25JdGVtQWRkZWQgPSBjYWxsYmFjaztcclxufVxyXG5leHBvcnRzLlNldE9uU2VsZWN0aW9uSXRlbUFkZGVkID0gU2V0T25TZWxlY3Rpb25JdGVtQWRkZWQ7XHJcbmZ1bmN0aW9uIFNldE9uU2VsZWN0aW9uQ2hhbmdlZChjYWxsYmFjaykge1xyXG4gICAgT25TZWxlY3Rpb25DaGFuZ2VkID0gY2FsbGJhY2s7XHJcbiAgICBmaWdtYS5vbignc2VsZWN0aW9uY2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgIFVwZGF0ZVNlbGVjdGlvbigpO1xyXG4gICAgICAgIC8vIHNldEludGVydmFsKFVwZGF0ZUZsb3csIDIwMCk7XHJcbiAgICAgICAgaWYgKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGl0IGRvZXNudCBoYXZlIGFycm93IGF0dGFjaGVkXHJcbiAgICAgICAgICAgIC8vIGxvZ2ljIGlzIHRvIGF0dGFjaC9yZW1vdmUgZnJvbSAtMiB0byAtMVxyXG4gICAgICAgICAgICAvLyAwXHJcbiAgICAgICAgICAgIC8vIDFcclxuICAgICAgICAgICAgLy8gMlxyXG4gICAgICAgICAgICAvLyAzXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5TZXRPblNlbGVjdGlvbkNoYW5nZWQgPSBTZXRPblNlbGVjdGlvbkNoYW5nZWQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLW5lc3RlZC10ZXJuYXJ5ICovXHJcbmNvbnN0IHZlY3Rvcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3ZlY3RvclwiKSk7XHJcbmNsYXNzIFNuYXBQb2ludCBleHRlbmRzIHZlY3Rvcl8xLmRlZmF1bHQge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgX3R5cGUpIHtcclxuICAgICAgICBzdXBlcih4LCB5KTtcclxuICAgICAgICB0aGlzLl90eXBlID0gX3R5cGU7XHJcbiAgICB9XHJcbn1cclxuLy8gI3JlZ2lvbiBTbmFwUG9pbnRzIFxyXG4vLyBUT0RPIFJvdGF0aW9uIHN1cHBvcnRcclxuZnVuY3Rpb24gR2V0U25hcFBvaW50KHgsIF90eXBlKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gbmV3IFNuYXBQb2ludCgwLCAwLCBfdHlwZSk7XHJcbiAgICBpZiAoX3R5cGUgPT09ICd0b3AnKSB7XHJcbiAgICAgICAgcmVzdWx0LnggPSB4LnggKyAoeC53aWR0aCAqIDAuNSk7XHJcbiAgICAgICAgcmVzdWx0LnkgPSB4Lnk7XHJcbiAgICB9XHJcbiAgICBpZiAoX3R5cGUgPT09ICdyaWdodCcpIHtcclxuICAgICAgICByZXN1bHQueCA9IHgueCArIHgud2lkdGg7XHJcbiAgICAgICAgcmVzdWx0LnkgPSB4LnkgKyAoeC5oZWlnaHQgKiAwLjUpO1xyXG4gICAgfVxyXG4gICAgaWYgKF90eXBlID09PSAnYm90dG9tJykge1xyXG4gICAgICAgIHJlc3VsdC54ID0geC54ICsgKHgud2lkdGggKiAwLjUpO1xyXG4gICAgICAgIHJlc3VsdC55ID0geC55ICsgeC5oZWlnaHQ7XHJcbiAgICB9XHJcbiAgICBpZiAoX3R5cGUgPT09ICdsZWZ0Jykge1xyXG4gICAgICAgIHJlc3VsdC54ID0geC54O1xyXG4gICAgICAgIHJlc3VsdC55ID0geC55ICsgKHguaGVpZ2h0ICogMC41KTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gR2V0U25hcFBvaW50QnlJZCh4LCBpZCkge1xyXG4gICAgcmV0dXJuIEdldFNuYXBQb2ludCh4LCBpZCA9PT0gMCA/ICd0b3AnXHJcbiAgICAgICAgOiBpZCA9PT0gMSA/ICdyaWdodCdcclxuICAgICAgICAgICAgOiBpZCA9PT0gMiA/ICdib3R0b20nIDogJ2xlZnQnKTtcclxufVxyXG5mdW5jdGlvbiBHZXRDbG9zZXN0U25hcFBvaW50cyhmcm9tLCB0bykge1xyXG4gICAgLypcclxuICAgICAgbyAtIGxvY2F0aW9uIC8gc25hcHBvaW50XHJcbiAgICAgIHggLSBzbmFwcG9pbnRcclxuICAgICAgKyAtIGFuZ2xlXHJcbiAgICAgIC1cclxuICAgICAgICBvLS0tLS14LS0tLS0rXHJcbiAgICAgICAgfCAgICAgICAgICAgfFxyXG4gICAgICAgIHggICAgICAgICAgIHhcclxuICAgICAgICB8ICAgICAgICAgICB8XHJcbiAgICAgICAgKy0tLS0teC0tLS0tK1xyXG4gICAgICAgICAgICAgICAgICAgICAgK1xyXG4gICAgKi9cclxuICAgIGNvbnN0IE1hcCA9IFtcclxuICAgICAgICBbJ3RvcCcsICdib3R0b20nXSxcclxuICAgICAgICBbJ3JpZ2h0JywgJ2xlZnQnXSxcclxuICAgICAgICBbJ2JvdHRvbScsICd0b3AnXSxcclxuICAgICAgICBbJ2xlZnQnLCAncmlnaHQnXSxcclxuICAgIF07XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXHJcbiAgICAgICAgR2V0U25hcFBvaW50QnlJZChmcm9tLCAwKSxcclxuICAgICAgICBHZXRTbmFwUG9pbnRCeUlkKHRvLCAwKSxcclxuICAgIF07XHJcbiAgICAvLyBvbiB0b3AgXHJcbiAgICAvLyBvbiBib3R0b21cclxuICAgIC8vIG9uIHRoZSBzYW1lIFxyXG4gICAgbGV0IGxhc3REaXN0YW5jZSA9IDk5OTk5OTk5O1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBzMSA9IEdldFNuYXBQb2ludChmcm9tLCBNYXBbaV1bMF0pO1xyXG4gICAgICAgIGNvbnN0IHMyID0gR2V0U25hcFBvaW50KHRvLCBNYXBbaV1bMV0pO1xyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gczEuZGlzdChzMik7XHJcbiAgICAgICAgaWYgKGRpc3RhbmNlIDwgbGFzdERpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFswXSA9IHMxO1xyXG4gICAgICAgICAgICByZXN1bHRbMV0gPSBzMjtcclxuICAgICAgICAgICAgbGFzdERpc3RhbmNlID0gZGlzdGFuY2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSB7IEdldFNuYXBQb2ludCwgR2V0U25hcFBvaW50QnlJZCwgR2V0Q2xvc2VzdFNuYXBQb2ludHMgfTtcclxuLy8gI2VuZHJlZ2lvblxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vLyAjcmVnaW9uIFZlY3RvclxyXG5jbGFzcyBWZWN0b3IyRCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG4gICAgZGlzdCh0bykge1xyXG4gICAgICAgIGNvbnN0IHhkID0gdGhpcy54IC0gdG8ueDtcclxuICAgICAgICBjb25zdCB5ZCA9IHRoaXMueSAtIHRvLnk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ZCAqIHhkICsgeWQgKiB5ZCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gVmVjdG9yMkQ7XHJcbi8vICNlbmRyZWdpb25cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvZGUudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=