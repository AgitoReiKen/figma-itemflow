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
flow.SetEvents();
selection.SetOnSelectionChanged((selection) => {
    if (selection.length === 2) {
        flow.CreateFlow(selection[0], selection[1], flowSettings);
    }
});
figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case 'set-stroke-weight': {
            flowSettings.weight = msg.value;
            console.log(`SetStrokeWeight: ${msg.value}`);
            break;
        }
        case 'set-stroke-cap': {
            flowSettings.strokeCap[0] = msg.value[0];
            flowSettings.strokeCap[1] = msg.value[1];
            break;
        }
        case 'set-dash-pattern': {
            flowSettings.dashPattern = msg.value;
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
exports.CreateFlow = exports.SetEvents = exports.FlowSettings = void 0;
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
    figma.currentPage.insertChild(0, GetPluginFrame());
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
        UpdateFlowPosition(flow, from, to);
    }
}
function UpdateFlowPosition(flow, from, to) {
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
        let data = new FlowCoordsData();
        data.snapPoints = [new vector_1.default(sp[0].x, sp[0].y), new vector_1.default(sp[1].x, sp[1].y)];
        SetFlowCoordsData(flow, data);
    }
}
function CreateFlow(from, to, settings) {
    let svg = null;
    svg = GetFlow(from, to);
    if (svg === null) {
        svg = figma.createVector();
        GetPluginFrame().appendChild(svg);
    }
    UpdateFlowPosition(svg, from, to);
    svg.strokeWeight = settings.weight;
    svg.dashPattern = settings.dashPattern;
    SetStrokeCap(svg, settings.strokeCap[0], settings.strokeCap[1]);
    SetFlowData(svg, [from.id, to.id]);
    svg.name = `${from.name} -> ${to.name}`;
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
let lastSelection;
function SetEvents() {
    setInterval(() => {
        GetAllFlows().forEach(x => {
            UpdateFlow(x);
        });
    }, 200);
    setInterval(() => {
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
exports.SetEvents = SetEvents;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlLEtBQUs7QUFDcEI7Ozs7Ozs7Ozs7O0FDaEZhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlO0FBQ2Y7Ozs7Ozs7VUNmQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vSXRlbUZsb3cvLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9JdGVtRmxvdy8uL3NyYy9mbG93LnRzIiwid2VicGFjazovL0l0ZW1GbG93Ly4vc3JjL3NlbGVjdGlvbi50cyIsIndlYnBhY2s6Ly9JdGVtRmxvdy8uL3NyYy9zbmFwcG9pbnRzLnRzIiwid2VicGFjazovL0l0ZW1GbG93Ly4vc3JjL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly9JdGVtRmxvdy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9JdGVtRmxvdy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0l0ZW1GbG93L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9JdGVtRmxvdy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qIGVzbGludC1kaXNhYmxlIGRlZmF1bHQtY2FzZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wbHVzcGx1cyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1uZXN0ZWQtdGVybmFyeSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtY2xhc3Nlcy1wZXItZmlsZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufSk7XHJcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHNlbGVjdGlvbiA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9zZWxlY3Rpb25cIikpO1xyXG5jb25zdCBmbG93ID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2Zsb3dcIikpO1xyXG5maWdtYS5zaG93VUkoX19odG1sX18pO1xyXG4vLyBUT0RPIGNoZWNrIGZvciByZW1vdmVkIFxyXG5jb25zdCBmbG93U2V0dGluZ3MgPSBuZXcgZmxvdy5GbG93U2V0dGluZ3MoKTtcclxuLyogdG9kbyB1cGRhdGUgeiBpbmRleCAqL1xyXG5mbG93LlNldEV2ZW50cygpO1xyXG5zZWxlY3Rpb24uU2V0T25TZWxlY3Rpb25DaGFuZ2VkKChzZWxlY3Rpb24pID0+IHtcclxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgZmxvdy5DcmVhdGVGbG93KHNlbGVjdGlvblswXSwgc2VsZWN0aW9uWzFdLCBmbG93U2V0dGluZ3MpO1xyXG4gICAgfVxyXG59KTtcclxuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4ge1xyXG4gICAgc3dpdGNoIChtc2cudHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ3NldC1zdHJva2Utd2VpZ2h0Jzoge1xyXG4gICAgICAgICAgICBmbG93U2V0dGluZ3Mud2VpZ2h0ID0gbXNnLnZhbHVlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgU2V0U3Ryb2tlV2VpZ2h0OiAke21zZy52YWx1ZX1gKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgJ3NldC1zdHJva2UtY2FwJzoge1xyXG4gICAgICAgICAgICBmbG93U2V0dGluZ3Muc3Ryb2tlQ2FwWzBdID0gbXNnLnZhbHVlWzBdO1xyXG4gICAgICAgICAgICBmbG93U2V0dGluZ3Muc3Ryb2tlQ2FwWzFdID0gbXNnLnZhbHVlWzFdO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnc2V0LWRhc2gtcGF0dGVybic6IHtcclxuICAgICAgICAgICAgZmxvd1NldHRpbmdzLmRhc2hQYXR0ZXJuID0gbXNnLnZhbHVlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnY2FuY2VsJzoge1xyXG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuQ3JlYXRlRmxvdyA9IGV4cG9ydHMuU2V0RXZlbnRzID0gZXhwb3J0cy5GbG93U2V0dGluZ3MgPSB2b2lkIDA7XHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXBsdXNwbHVzICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLW5lc3RlZC10ZXJuYXJ5ICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG1heC1jbGFzc2VzLXBlci1maWxlICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cclxuY29uc3Qgc2VsZWN0aW9uXzEgPSByZXF1aXJlKFwiLi9zZWxlY3Rpb25cIik7XHJcbmNvbnN0IHNuYXBwb2ludHNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9zbmFwcG9pbnRzXCIpKTtcclxuY29uc3QgdmVjdG9yXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vdmVjdG9yXCIpKTtcclxuY29uc3QgUExVR0lOX05BTUUgPSAnSXRlbUZyYW1lJztcclxuY29uc3QgRkxPV19EQVRBID0gJ0lGJztcclxuY29uc3QgRkxPV19DT09SRFNfREFUQSA9ICdJRkMnO1xyXG5jb25zdCBGUkFNRV9EQVRBID0gUExVR0lOX05BTUU7XHJcbmNvbnN0IFVOREVGSU5FRF9JRCA9ICd1bmRlZmluZWQnO1xyXG5jb25zdCBGUkFNRV9PRkZTRVQgPSBuZXcgdmVjdG9yXzEuZGVmYXVsdCgtOTk5OTksIC05OTk5OSk7XHJcbmxldCBEQVRBX05PREVfSUQgPSBVTkRFRklORURfSUQ7XHJcbi8vICNyZWdpb24gRnJhbWVcclxuZnVuY3Rpb24gR2V0UGx1Z2luRnJhbWUoKSB7XHJcbiAgICBsZXQgZm91bmQ7XHJcbiAgICBpZiAoREFUQV9OT0RFX0lEICE9PSBVTkRFRklORURfSUQpIHtcclxuICAgICAgICBmb3VuZCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUoKHgpID0+IHguaWQgPT09IERBVEFfTk9ERV9JRCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmb3VuZCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUoKHgpID0+IHguZ2V0UGx1Z2luRGF0YShGUkFNRV9EQVRBKSA9PT0gJzEnKTtcclxuICAgIH1cclxuICAgIGlmIChmb3VuZCA9PT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IHBsdWdpbkZyYW1lID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcclxuICAgICAgICBwbHVnaW5GcmFtZS5yZXNpemUoMSwgMSk7XHJcbiAgICAgICAgcGx1Z2luRnJhbWUueCA9IEZSQU1FX09GRlNFVC54O1xyXG4gICAgICAgIHBsdWdpbkZyYW1lLnkgPSBGUkFNRV9PRkZTRVQueTtcclxuICAgICAgICBwbHVnaW5GcmFtZS5sb2NrZWQgPSBmYWxzZTtcclxuICAgICAgICBwbHVnaW5GcmFtZS5uYW1lID0gUExVR0lOX05BTUU7XHJcbiAgICAgICAgcGx1Z2luRnJhbWUuY2xpcHNDb250ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgcGx1Z2luRnJhbWUuc2V0UGx1Z2luRGF0YShGUkFNRV9EQVRBLCAnMScpO1xyXG4gICAgICAgIGZvdW5kID0gZmlnbWEuY3VycmVudFBhZ2UuZmluZE9uZSgoeCkgPT4geC5nZXRQbHVnaW5EYXRhKEZSQU1FX0RBVEEpID09PSAnMScpO1xyXG4gICAgICAgIERBVEFfTk9ERV9JRCA9IGZvdW5kLmlkO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgREFUQV9OT0RFX0lEID0gZm91bmQuaWQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZm91bmQ7XHJcbn1cclxuZnVuY3Rpb24gVXBkYXRlUGx1Z2luRnJhbWUoKSB7XHJcbiAgICBmaWdtYS5jdXJyZW50UGFnZS5pbnNlcnRDaGlsZCgwLCBHZXRQbHVnaW5GcmFtZSgpKTtcclxufVxyXG4vLyAjZW5kcmVnaW9uXHJcbmNsYXNzIEZsb3dTZXR0aW5ncyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnN0cm9rZUNhcCA9IFsnTk9ORScsICdBUlJPV19FUVVJTEFURVJBTCddO1xyXG4gICAgICAgIHRoaXMuZGFzaFBhdHRlcm4gPSBbXTtcclxuICAgICAgICB0aGlzLndlaWdodCA9IDE7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5GbG93U2V0dGluZ3MgPSBGbG93U2V0dGluZ3M7XHJcbmNsYXNzIEZsb3dDb29yZHNEYXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuc25hcFBvaW50cyA9IFtdO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIFNldEZsb3dDb29yZHNEYXRhKG5vZGUsIGRhdGEpIHtcclxuICAgIG5vZGUuc2V0UGx1Z2luRGF0YShGTE9XX0NPT1JEU19EQVRBLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbn1cclxuZnVuY3Rpb24gR2V0Rmxvd0Nvb3Jkc0RhdGEobm9kZSkge1xyXG4gICAgY29uc3QgZGF0YSA9IG5vZGUuZ2V0UGx1Z2luRGF0YShGTE9XX0NPT1JEU19EQVRBKTtcclxuICAgIGlmIChkYXRhLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlZDtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcbmZ1bmN0aW9uIFNldEZsb3dEYXRhKG5vZGUsIGRhdGEpIHtcclxuICAgIG5vZGUuc2V0UGx1Z2luRGF0YShGTE9XX0RBVEEsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxufVxyXG5mdW5jdGlvbiBHZXRGbG93RGF0YShub2RlKSB7XHJcbiAgICBjb25zdCBkYXRhID0gbm9kZS5nZXRQbHVnaW5EYXRhKEZMT1dfREFUQSk7XHJcbiAgICBpZiAoZGF0YS5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlZDtcclxuICAgIH1cclxuICAgIHJldHVybiBbXTtcclxufVxyXG5mdW5jdGlvbiBSZW1vdmVGbG93cyhvZikge1xyXG4gICAgbGV0IGZsb3dzID0gR2V0UGx1Z2luRnJhbWUoKS5maW5kQ2hpbGRyZW4oeCA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IEdldEZsb3dEYXRhKHgpO1xyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YS5maW5kKHggPT4geCA9PT0gb2YuaWQpICE9PSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9KTtcclxuICAgIGZsb3dzLmZvckVhY2goeCA9PiB4LnJlbW92ZSgpKTtcclxufVxyXG5mdW5jdGlvbiBHZXRBbGxGbG93cygpIHtcclxuICAgIHJldHVybiBHZXRQbHVnaW5GcmFtZSgpLmZpbmRDaGlsZHJlbih4ID0+IHsgcmV0dXJuIEdldEZsb3dEYXRhKHgpLmxlbmd0aCA9PT0gMjsgfSk7XHJcbn1cclxuZnVuY3Rpb24gR2V0Rmxvdyhmcm9tLCB0bykge1xyXG4gICAgcmV0dXJuIGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUoeCA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IEdldEZsb3dEYXRhKHgpO1xyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YVswXSA9PT0gZnJvbS5pZCAmJiBkYXRhWzFdID09PSB0by5pZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbn1cclxuLy8gI3JlZ2lvbiBGbG93XHJcbmZ1bmN0aW9uIFVwZGF0ZUZsb3coZmxvdykge1xyXG4gICAgY29uc3QgZGF0YSA9IEdldEZsb3dEYXRhKGZsb3cpO1xyXG4gICAgY29uc3QgZnJvbSA9IGZpZ21hLmdldE5vZGVCeUlkKGRhdGFbMF0pO1xyXG4gICAgY29uc3QgdG8gPSBmaWdtYS5nZXROb2RlQnlJZChkYXRhWzFdKTtcclxuICAgIGlmIChmcm9tLnJlbW92ZWQpIHtcclxuICAgICAgICBSZW1vdmVGbG93cyhmcm9tKTtcclxuICAgIH1cclxuICAgIGlmICh0by5yZW1vdmVkKSB7XHJcbiAgICAgICAgUmVtb3ZlRmxvd3ModG8pO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0by5yZW1vdmVkICYmICFmcm9tLnJlbW92ZWQpIHtcclxuICAgICAgICBVcGRhdGVGbG93UG9zaXRpb24oZmxvdywgZnJvbSwgdG8pO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIFVwZGF0ZUZsb3dQb3NpdGlvbihmbG93LCBmcm9tLCB0bykge1xyXG4gICAgY29uc3Qgc3AgPSBzbmFwcG9pbnRzXzEuZGVmYXVsdC5HZXRDbG9zZXN0U25hcFBvaW50cyhmcm9tLCB0byk7XHJcbiAgICBjb25zdCB4ID0gc3BbMF0ueCAtIHNwWzFdLng7XHJcbiAgICBjb25zdCB5ID0gc3BbMF0ueSAtIHNwWzFdLnk7XHJcbiAgICBjb25zdCBjb29yZHNEYXRhID0gR2V0Rmxvd0Nvb3Jkc0RhdGEoZmxvdyk7XHJcbiAgICBsZXQgc25hcFBvaW50c0NoYW5nZWQgPSB0cnVlO1xyXG4gICAgaWYgKGNvb3Jkc0RhdGEgIT09IG51bGwpIHtcclxuICAgICAgICBzbmFwUG9pbnRzQ2hhbmdlZCA9XHJcbiAgICAgICAgICAgIGNvb3Jkc0RhdGEuc25hcFBvaW50c1swXS54ICE9PSBzcFswXS54IHx8XHJcbiAgICAgICAgICAgICAgICBjb29yZHNEYXRhLnNuYXBQb2ludHNbMF0ueSAhPT0gc3BbMF0ueSB8fFxyXG4gICAgICAgICAgICAgICAgY29vcmRzRGF0YS5zbmFwUG9pbnRzWzFdLnggIT09IHNwWzFdLnggfHxcclxuICAgICAgICAgICAgICAgIGNvb3Jkc0RhdGEuc25hcFBvaW50c1sxXS55ICE9PSBzcFsxXS55O1xyXG4gICAgfVxyXG4gICAgaWYgKHNuYXBQb2ludHNDaGFuZ2VkKSB7XHJcbiAgICAgICAgY29uc3QgZmxvd1ggPSBzcFswXS54IC0geCAtIEZSQU1FX09GRlNFVC54O1xyXG4gICAgICAgIGNvbnN0IGZsb3dZID0gc3BbMF0ueSAtIHkgLSBGUkFNRV9PRkZTRVQueTtcclxuICAgICAgICBmbG93LnggPSBmbG93WDtcclxuICAgICAgICBmbG93LnkgPSBmbG93WTtcclxuICAgICAgICBmbG93LnZlY3RvclBhdGhzID0gW3tcclxuICAgICAgICAgICAgICAgIHdpbmRpbmdSdWxlOiAnRVZFTk9ERCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBgTSAwIDAgTCAke3h9ICR7eX0gWmAsXHJcbiAgICAgICAgICAgIH1dO1xyXG4gICAgICAgIGxldCBkYXRhID0gbmV3IEZsb3dDb29yZHNEYXRhKCk7XHJcbiAgICAgICAgZGF0YS5zbmFwUG9pbnRzID0gW25ldyB2ZWN0b3JfMS5kZWZhdWx0KHNwWzBdLngsIHNwWzBdLnkpLCBuZXcgdmVjdG9yXzEuZGVmYXVsdChzcFsxXS54LCBzcFsxXS55KV07XHJcbiAgICAgICAgU2V0Rmxvd0Nvb3Jkc0RhdGEoZmxvdywgZGF0YSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gQ3JlYXRlRmxvdyhmcm9tLCB0bywgc2V0dGluZ3MpIHtcclxuICAgIGxldCBzdmcgPSBudWxsO1xyXG4gICAgc3ZnID0gR2V0Rmxvdyhmcm9tLCB0byk7XHJcbiAgICBpZiAoc3ZnID09PSBudWxsKSB7XHJcbiAgICAgICAgc3ZnID0gZmlnbWEuY3JlYXRlVmVjdG9yKCk7XHJcbiAgICAgICAgR2V0UGx1Z2luRnJhbWUoKS5hcHBlbmRDaGlsZChzdmcpO1xyXG4gICAgfVxyXG4gICAgVXBkYXRlRmxvd1Bvc2l0aW9uKHN2ZywgZnJvbSwgdG8pO1xyXG4gICAgc3ZnLnN0cm9rZVdlaWdodCA9IHNldHRpbmdzLndlaWdodDtcclxuICAgIHN2Zy5kYXNoUGF0dGVybiA9IHNldHRpbmdzLmRhc2hQYXR0ZXJuO1xyXG4gICAgU2V0U3Ryb2tlQ2FwKHN2Zywgc2V0dGluZ3Muc3Ryb2tlQ2FwWzBdLCBzZXR0aW5ncy5zdHJva2VDYXBbMV0pO1xyXG4gICAgU2V0Rmxvd0RhdGEoc3ZnLCBbZnJvbS5pZCwgdG8uaWRdKTtcclxuICAgIHN2Zy5uYW1lID0gYCR7ZnJvbS5uYW1lfSAtPiAke3RvLm5hbWV9YDtcclxufVxyXG5leHBvcnRzLkNyZWF0ZUZsb3cgPSBDcmVhdGVGbG93O1xyXG5mdW5jdGlvbiBTZXRTdHJva2VDYXAobm9kZSwgc3RhcnQsIGVuZCkge1xyXG4gICAgY29uc3QgY29weSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobm9kZS52ZWN0b3JOZXR3b3JrKSk7XHJcbiAgICBpZiAoXCJzdHJva2VDYXBcIiBpbiBjb3B5LnZlcnRpY2VzW2NvcHkudmVydGljZXMubGVuZ3RoIC0gMV0pIHtcclxuICAgICAgICBjb3B5LnZlcnRpY2VzW2NvcHkudmVydGljZXMubGVuZ3RoIC0gMV0uc3Ryb2tlQ2FwID0gc3RhcnQ7XHJcbiAgICAgICAgY29weS52ZXJ0aWNlc1swXS5zdHJva2VDYXAgPSBlbmQ7XHJcbiAgICB9XHJcbiAgICBub2RlLnZlY3Rvck5ldHdvcmsgPSBjb3B5O1xyXG59XHJcbmxldCBsYXN0U2VsZWN0aW9uO1xyXG5mdW5jdGlvbiBTZXRFdmVudHMoKSB7XHJcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgR2V0QWxsRmxvd3MoKS5mb3JFYWNoKHggPT4ge1xyXG4gICAgICAgICAgICBVcGRhdGVGbG93KHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSwgMjAwKTtcclxuICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBVcGRhdGVQbHVnaW5GcmFtZSgpO1xyXG4gICAgfSwgMTAwMCk7XHJcbiAgICAoMCwgc2VsZWN0aW9uXzEuU2V0T25TZWxlY3Rpb25JdGVtQWRkZWQpKChpdGVtKSA9PiB7XHJcbiAgICB9KTtcclxuICAgICgwLCBzZWxlY3Rpb25fMS5TZXRPblNlbGVjdGlvbkl0ZW1SZW1vdmVkKSgoaXRlbSkgPT4ge1xyXG4gICAgICAgIGlmIChpdGVtLnJlbW92ZWQpIHtcclxuICAgICAgICAgICAgUmVtb3ZlRmxvd3MoaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5TZXRFdmVudHMgPSBTZXRFdmVudHM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuVXBkYXRlU2VsZWN0aW9uID0gZXhwb3J0cy5HZXRTZWxlY3Rpb24gPSBleHBvcnRzLlNldE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQgPSBleHBvcnRzLlNldE9uU2VsZWN0aW9uSXRlbUFkZGVkID0gZXhwb3J0cy5TZXRPblNlbGVjdGlvbkNoYW5nZWQgPSB2b2lkIDA7XHJcbmxldCBsYXN0U2VsZWN0aW9uID0gW107XHJcbmxldCBPblNlbGVjdGlvbkNoYW5nZWQ7XHJcbmxldCBPblNlbGVjdGlvbkl0ZW1SZW1vdmVkO1xyXG5sZXQgT25TZWxlY3Rpb25JdGVtQWRkZWQ7XHJcbmZ1bmN0aW9uIFVwZGF0ZVNlbGVjdGlvbigpIHtcclxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcclxuICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgIC8vcmVtb3ZlZFxyXG4gICAgaWYgKGxhc3RTZWxlY3Rpb24ubGVuZ3RoID4gc2VsZWN0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgIGxhc3RTZWxlY3Rpb24uZm9yRWFjaCgoeCwgaSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IHNlbGVjdGlvbi5maW5kKCh5LCBpMikgPT4geyByZXR1cm4geC5pZCA9PT0geS5pZDsgfSk7XHJcbiAgICAgICAgICAgIGlmIChmb3VuZCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJlc3VsdC5mb3JFYWNoKHggPT4ge1xyXG4gICAgICAgICAgICBPblNlbGVjdGlvbkl0ZW1SZW1vdmVkKHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxhc3RTZWxlY3Rpb24gPSByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICAvL2FkZGVkXHJcbiAgICBlbHNlIGlmIChsYXN0U2VsZWN0aW9uLmxlbmd0aCA8IHNlbGVjdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICBzZWxlY3Rpb24uZm9yRWFjaCgoeCwgaSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IGxhc3RTZWxlY3Rpb24uZmluZCgoeSwgaTIpID0+IHsgcmV0dXJuIHguaWQgPT09IHkuaWQ7IH0pO1xyXG4gICAgICAgICAgICBpZiAoZm91bmQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbGFzdFNlbGVjdGlvbi5wdXNoKHgpO1xyXG4gICAgICAgICAgICAgICAgT25TZWxlY3Rpb25JdGVtQWRkZWQoeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vYnVnXHJcbiAgICBlbHNlIHtcclxuICAgIH1cclxuICAgIGlmIChsYXN0U2VsZWN0aW9uLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgIE9uU2VsZWN0aW9uQ2hhbmdlZChsYXN0U2VsZWN0aW9uKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlVwZGF0ZVNlbGVjdGlvbiA9IFVwZGF0ZVNlbGVjdGlvbjtcclxuZnVuY3Rpb24gR2V0U2VsZWN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGxhc3RTZWxlY3Rpb247XHJcbn1cclxuZXhwb3J0cy5HZXRTZWxlY3Rpb24gPSBHZXRTZWxlY3Rpb247XHJcbmZ1bmN0aW9uIFNldE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQoY2FsbGJhY2spIHtcclxuICAgIE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQgPSBjYWxsYmFjaztcclxufVxyXG5leHBvcnRzLlNldE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQgPSBTZXRPblNlbGVjdGlvbkl0ZW1SZW1vdmVkO1xyXG5mdW5jdGlvbiBTZXRPblNlbGVjdGlvbkl0ZW1BZGRlZChjYWxsYmFjaykge1xyXG4gICAgT25TZWxlY3Rpb25JdGVtQWRkZWQgPSBjYWxsYmFjaztcclxufVxyXG5leHBvcnRzLlNldE9uU2VsZWN0aW9uSXRlbUFkZGVkID0gU2V0T25TZWxlY3Rpb25JdGVtQWRkZWQ7XHJcbmZ1bmN0aW9uIFNldE9uU2VsZWN0aW9uQ2hhbmdlZChjYWxsYmFjaykge1xyXG4gICAgT25TZWxlY3Rpb25DaGFuZ2VkID0gY2FsbGJhY2s7XHJcbiAgICBmaWdtYS5vbignc2VsZWN0aW9uY2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgIFVwZGF0ZVNlbGVjdGlvbigpO1xyXG4gICAgICAgIC8vIHNldEludGVydmFsKFVwZGF0ZUZsb3csIDIwMCk7XHJcbiAgICAgICAgaWYgKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGl0IGRvZXNudCBoYXZlIGFycm93IGF0dGFjaGVkXHJcbiAgICAgICAgICAgIC8vIGxvZ2ljIGlzIHRvIGF0dGFjaC9yZW1vdmUgZnJvbSAtMiB0byAtMVxyXG4gICAgICAgICAgICAvLyAwXHJcbiAgICAgICAgICAgIC8vIDFcclxuICAgICAgICAgICAgLy8gMlxyXG4gICAgICAgICAgICAvLyAzXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5TZXRPblNlbGVjdGlvbkNoYW5nZWQgPSBTZXRPblNlbGVjdGlvbkNoYW5nZWQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLW5lc3RlZC10ZXJuYXJ5ICovXHJcbmNvbnN0IHZlY3Rvcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3ZlY3RvclwiKSk7XHJcbmNsYXNzIFNuYXBQb2ludCBleHRlbmRzIHZlY3Rvcl8xLmRlZmF1bHQge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgX3R5cGUpIHtcclxuICAgICAgICBzdXBlcih4LCB5KTtcclxuICAgICAgICB0aGlzLl90eXBlID0gX3R5cGU7XHJcbiAgICB9XHJcbn1cclxuLy8gI3JlZ2lvbiBTbmFwUG9pbnRzIFxyXG4vLyBUT0RPIFJvdGF0aW9uIHN1cHBvcnRcclxuZnVuY3Rpb24gR2V0U25hcFBvaW50KHgsIF90eXBlKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gbmV3IFNuYXBQb2ludCgwLCAwLCBfdHlwZSk7XHJcbiAgICBpZiAoX3R5cGUgPT09ICd0b3AnKSB7XHJcbiAgICAgICAgcmVzdWx0LnggPSB4LnggKyAoeC53aWR0aCAqIDAuNSk7XHJcbiAgICAgICAgcmVzdWx0LnkgPSB4Lnk7XHJcbiAgICB9XHJcbiAgICBpZiAoX3R5cGUgPT09ICdyaWdodCcpIHtcclxuICAgICAgICByZXN1bHQueCA9IHgueCArIHgud2lkdGg7XHJcbiAgICAgICAgcmVzdWx0LnkgPSB4LnkgKyAoeC5oZWlnaHQgKiAwLjUpO1xyXG4gICAgfVxyXG4gICAgaWYgKF90eXBlID09PSAnYm90dG9tJykge1xyXG4gICAgICAgIHJlc3VsdC54ID0geC54ICsgKHgud2lkdGggKiAwLjUpO1xyXG4gICAgICAgIHJlc3VsdC55ID0geC55ICsgeC5oZWlnaHQ7XHJcbiAgICB9XHJcbiAgICBpZiAoX3R5cGUgPT09ICdsZWZ0Jykge1xyXG4gICAgICAgIHJlc3VsdC54ID0geC54O1xyXG4gICAgICAgIHJlc3VsdC55ID0geC55ICsgKHguaGVpZ2h0ICogMC41KTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gR2V0U25hcFBvaW50QnlJZCh4LCBpZCkge1xyXG4gICAgcmV0dXJuIEdldFNuYXBQb2ludCh4LCBpZCA9PT0gMCA/ICd0b3AnXHJcbiAgICAgICAgOiBpZCA9PT0gMSA/ICdyaWdodCdcclxuICAgICAgICAgICAgOiBpZCA9PT0gMiA/ICdib3R0b20nIDogJ2xlZnQnKTtcclxufVxyXG5mdW5jdGlvbiBHZXRDbG9zZXN0U25hcFBvaW50cyhmcm9tLCB0bykge1xyXG4gICAgLypcclxuICAgICAgbyAtIGxvY2F0aW9uIC8gc25hcHBvaW50XHJcbiAgICAgIHggLSBzbmFwcG9pbnRcclxuICAgICAgKyAtIGFuZ2xlXHJcbiAgICAgIC1cclxuICAgICAgICBvLS0tLS14LS0tLS0rXHJcbiAgICAgICAgfCAgICAgICAgICAgfFxyXG4gICAgICAgIHggICAgICAgICAgIHhcclxuICAgICAgICB8ICAgICAgICAgICB8XHJcbiAgICAgICAgKy0tLS0teC0tLS0tK1xyXG4gICAgICAgICAgICAgICAgICAgICAgK1xyXG4gICAgKi9cclxuICAgIGNvbnN0IE1hcCA9IFtcclxuICAgICAgICBbJ3RvcCcsICdib3R0b20nXSxcclxuICAgICAgICBbJ3JpZ2h0JywgJ2xlZnQnXSxcclxuICAgICAgICBbJ2JvdHRvbScsICd0b3AnXSxcclxuICAgICAgICBbJ2xlZnQnLCAncmlnaHQnXSxcclxuICAgIF07XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXHJcbiAgICAgICAgR2V0U25hcFBvaW50QnlJZChmcm9tLCAwKSxcclxuICAgICAgICBHZXRTbmFwUG9pbnRCeUlkKHRvLCAwKSxcclxuICAgIF07XHJcbiAgICAvLyBvbiB0b3AgXHJcbiAgICAvLyBvbiBib3R0b21cclxuICAgIC8vIG9uIHRoZSBzYW1lIFxyXG4gICAgbGV0IGxhc3REaXN0YW5jZSA9IDk5OTk5OTk5O1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBzMSA9IEdldFNuYXBQb2ludChmcm9tLCBNYXBbaV1bMF0pO1xyXG4gICAgICAgIGNvbnN0IHMyID0gR2V0U25hcFBvaW50KHRvLCBNYXBbaV1bMV0pO1xyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gczEuZGlzdChzMik7XHJcbiAgICAgICAgaWYgKGRpc3RhbmNlIDwgbGFzdERpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFswXSA9IHMxO1xyXG4gICAgICAgICAgICByZXN1bHRbMV0gPSBzMjtcclxuICAgICAgICAgICAgbGFzdERpc3RhbmNlID0gZGlzdGFuY2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSB7IEdldFNuYXBQb2ludCwgR2V0U25hcFBvaW50QnlJZCwgR2V0Q2xvc2VzdFNuYXBQb2ludHMgfTtcclxuLy8gI2VuZHJlZ2lvblxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vLyAjcmVnaW9uIFZlY3RvclxyXG5jbGFzcyBWZWN0b3IyRCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG4gICAgZGlzdCh0bykge1xyXG4gICAgICAgIGNvbnN0IHhkID0gdGhpcy54IC0gdG8ueDtcclxuICAgICAgICBjb25zdCB5ZCA9IHRoaXMueSAtIHRvLnk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ZCAqIHhkICsgeWQgKiB5ZCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gVmVjdG9yMkQ7XHJcbi8vICNlbmRyZWdpb25cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvZGUudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=