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
let stroke = 24;
/* todo update z index */
flow.SetEvents();
selection.SetOnSelectionChanged((selection) => {
    if (selection.length === 2) {
        flow.CreateFlow(selection[0], selection[1], new flow.FlowSettings());
    }
});
figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case 'set-stroke': {
            stroke = msg.value;
            break;
        }
        case 'cancel': {
            figma.closePlugin();
            break;
        }
        case 'test': {
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
        found = figma.currentPage.findOne((x) => x.getPluginData(FRAME_DATA) === '1');
        console.log(`Found2: ${found}`);
        DATA_NODE_ID = found.id;
    }
    else {
        console.log(`Found# : ${found}`);
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
function SetPluginData(node, data) {
    node.setPluginData(FLOW_DATA, JSON.stringify(data));
}
function GetPluginData(node) {
    const data = node.getPluginData(FLOW_DATA);
    if (typeof (data) !== undefined) {
        const parsed = JSON.parse(data);
        return parsed;
    }
    return [];
}
function RemoveFlows(of) {
    let flows = GetPluginFrame().findChildren(x => {
        const data = GetPluginData(x);
        if (data.length === 2) {
            return data.find(x => x === of.id) !== null;
        }
        return false;
    });
    flows.forEach(x => x.remove());
}
function GetAllFlows() {
    return GetPluginFrame().findChildren(x => { return GetPluginData(x).length === 2; });
}
function GetFlow(from, to) {
    return figma.currentPage.findOne(x => {
        const data = x.getPluginData(FRAME_DATA);
        if (typeof (data) !== undefined) {
            const parsed = JSON.parse(data);
            if (parsed.length === 2) {
                return parsed[0] === from.id && parsed[1] === to.id;
            }
        }
    });
}
// #region Flow
function UpdateFlow(flow) {
    const data = GetPluginData(flow);
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
    flow.x = sp[0].x - x - FRAME_OFFSET.x;
    flow.y = sp[0].y - y - FRAME_OFFSET.y;
    flow.vectorPaths = [{
            windingRule: 'EVENODD',
            data: `M 0 0 L ${x} ${y} Z`,
        }];
}
function CreateFlow(from, to, settings) {
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
    setTimeout(() => {
        const selection = (0, selection_1.GetSelection)();
        GetAllFlows().forEach(x => {
            UpdateFlow(x);
        });
    }, 100);
    setTimeout(() => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlO0FBQ2Y7Ozs7Ozs7VUNmQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vSXRlbUZsb3cvLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9JdGVtRmxvdy8uL3NyYy9mbG93LnRzIiwid2VicGFjazovL0l0ZW1GbG93Ly4vc3JjL3NlbGVjdGlvbi50cyIsIndlYnBhY2s6Ly9JdGVtRmxvdy8uL3NyYy9zbmFwcG9pbnRzLnRzIiwid2VicGFjazovL0l0ZW1GbG93Ly4vc3JjL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly9JdGVtRmxvdy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9JdGVtRmxvdy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0l0ZW1GbG93L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9JdGVtRmxvdy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qIGVzbGludC1kaXNhYmxlIGRlZmF1bHQtY2FzZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wbHVzcGx1cyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1uZXN0ZWQtdGVybmFyeSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtY2xhc3Nlcy1wZXItZmlsZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufSk7XHJcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHNlbGVjdGlvbiA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9zZWxlY3Rpb25cIikpO1xyXG5jb25zdCBmbG93ID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2Zsb3dcIikpO1xyXG5maWdtYS5zaG93VUkoX19odG1sX18pO1xyXG4vLyBUT0RPIGNoZWNrIGZvciByZW1vdmVkXHJcbmxldCBzdHJva2UgPSAyNDtcclxuLyogdG9kbyB1cGRhdGUgeiBpbmRleCAqL1xyXG5mbG93LlNldEV2ZW50cygpO1xyXG5zZWxlY3Rpb24uU2V0T25TZWxlY3Rpb25DaGFuZ2VkKChzZWxlY3Rpb24pID0+IHtcclxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgZmxvdy5DcmVhdGVGbG93KHNlbGVjdGlvblswXSwgc2VsZWN0aW9uWzFdLCBuZXcgZmxvdy5GbG93U2V0dGluZ3MoKSk7XHJcbiAgICB9XHJcbn0pO1xyXG5maWdtYS51aS5vbm1lc3NhZ2UgPSAobXNnKSA9PiB7XHJcbiAgICBzd2l0Y2ggKG1zZy50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnc2V0LXN0cm9rZSc6IHtcclxuICAgICAgICAgICAgc3Ryb2tlID0gbXNnLnZhbHVlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnY2FuY2VsJzoge1xyXG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAndGVzdCc6IHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkNyZWF0ZUZsb3cgPSBleHBvcnRzLlNldEV2ZW50cyA9IGV4cG9ydHMuRmxvd1NldHRpbmdzID0gdm9pZCAwO1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wbHVzcGx1cyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1uZXN0ZWQtdGVybmFyeSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtY2xhc3Nlcy1wZXItZmlsZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXHJcbmNvbnN0IHNlbGVjdGlvbl8xID0gcmVxdWlyZShcIi4vc2VsZWN0aW9uXCIpO1xyXG5jb25zdCBzbmFwcG9pbnRzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vc25hcHBvaW50c1wiKSk7XHJcbmNvbnN0IHZlY3Rvcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3ZlY3RvclwiKSk7XHJcbmNvbnN0IFBMVUdJTl9OQU1FID0gJ0l0ZW1GcmFtZSc7XHJcbmNvbnN0IEZMT1dfREFUQSA9ICdJRic7XHJcbmNvbnN0IEZSQU1FX0RBVEEgPSBQTFVHSU5fTkFNRTtcclxuY29uc3QgVU5ERUZJTkVEX0lEID0gJ3VuZGVmaW5lZCc7XHJcbmNvbnN0IEZSQU1FX09GRlNFVCA9IG5ldyB2ZWN0b3JfMS5kZWZhdWx0KC05OTk5OSwgLTk5OTk5KTtcclxubGV0IERBVEFfTk9ERV9JRCA9IFVOREVGSU5FRF9JRDtcclxuLy8gI3JlZ2lvbiBGcmFtZVxyXG5mdW5jdGlvbiBHZXRQbHVnaW5GcmFtZSgpIHtcclxuICAgIGxldCBmb3VuZDtcclxuICAgIGlmIChEQVRBX05PREVfSUQgIT09IFVOREVGSU5FRF9JRCkge1xyXG4gICAgICAgIGZvdW5kID0gZmlnbWEuY3VycmVudFBhZ2UuZmluZE9uZSgoeCkgPT4geC5pZCA9PT0gREFUQV9OT0RFX0lEKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZvdW5kID0gZmlnbWEuY3VycmVudFBhZ2UuZmluZE9uZSgoeCkgPT4geC5nZXRQbHVnaW5EYXRhKEZSQU1FX0RBVEEpID09PSAnMScpO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2coYEZvdW5kOiAke2ZvdW5kfWApO1xyXG4gICAgaWYgKGZvdW5kID09PSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgcGx1Z2luRnJhbWUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xyXG4gICAgICAgIHBsdWdpbkZyYW1lLnJlc2l6ZSgxLCAxKTtcclxuICAgICAgICBwbHVnaW5GcmFtZS54ID0gRlJBTUVfT0ZGU0VULng7XHJcbiAgICAgICAgcGx1Z2luRnJhbWUueSA9IEZSQU1FX09GRlNFVC55O1xyXG4gICAgICAgIHBsdWdpbkZyYW1lLmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgcGx1Z2luRnJhbWUubmFtZSA9IFBMVUdJTl9OQU1FO1xyXG4gICAgICAgIHBsdWdpbkZyYW1lLmNsaXBzQ29udGVudCA9IGZhbHNlO1xyXG4gICAgICAgIHBsdWdpbkZyYW1lLnNldFBsdWdpbkRhdGEoRlJBTUVfREFUQSwgJzEnKTtcclxuICAgICAgICBmb3VuZCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUoKHgpID0+IHguZ2V0UGx1Z2luRGF0YShGUkFNRV9EQVRBKSA9PT0gJzEnKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgRm91bmQyOiAke2ZvdW5kfWApO1xyXG4gICAgICAgIERBVEFfTk9ERV9JRCA9IGZvdW5kLmlkO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYEZvdW5kIyA6ICR7Zm91bmR9YCk7XHJcbiAgICAgICAgREFUQV9OT0RFX0lEID0gZm91bmQuaWQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZm91bmQ7XHJcbn1cclxuZnVuY3Rpb24gVXBkYXRlUGx1Z2luRnJhbWUoKSB7XHJcbiAgICBmaWdtYS5jdXJyZW50UGFnZS5pbnNlcnRDaGlsZCgwLCBHZXRQbHVnaW5GcmFtZSgpKTtcclxufVxyXG4vLyAjZW5kcmVnaW9uXHJcbmNsYXNzIEZsb3dTZXR0aW5ncyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnN0cm9rZUNhcCA9IFsnTk9ORScsICdBUlJPV19FUVVJTEFURVJBTCddO1xyXG4gICAgICAgIHRoaXMuZGFzaFBhdHRlcm4gPSBbXTtcclxuICAgICAgICB0aGlzLndlaWdodCA9IDE7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5GbG93U2V0dGluZ3MgPSBGbG93U2V0dGluZ3M7XHJcbmZ1bmN0aW9uIFNldFBsdWdpbkRhdGEobm9kZSwgZGF0YSkge1xyXG4gICAgbm9kZS5zZXRQbHVnaW5EYXRhKEZMT1dfREFUQSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG59XHJcbmZ1bmN0aW9uIEdldFBsdWdpbkRhdGEobm9kZSkge1xyXG4gICAgY29uc3QgZGF0YSA9IG5vZGUuZ2V0UGx1Z2luRGF0YShGTE9XX0RBVEEpO1xyXG4gICAgaWYgKHR5cGVvZiAoZGF0YSkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlZDtcclxuICAgIH1cclxuICAgIHJldHVybiBbXTtcclxufVxyXG5mdW5jdGlvbiBSZW1vdmVGbG93cyhvZikge1xyXG4gICAgbGV0IGZsb3dzID0gR2V0UGx1Z2luRnJhbWUoKS5maW5kQ2hpbGRyZW4oeCA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IEdldFBsdWdpbkRhdGEoeCk7XHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhLmZpbmQoeCA9PiB4ID09PSBvZi5pZCkgIT09IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG4gICAgZmxvd3MuZm9yRWFjaCh4ID0+IHgucmVtb3ZlKCkpO1xyXG59XHJcbmZ1bmN0aW9uIEdldEFsbEZsb3dzKCkge1xyXG4gICAgcmV0dXJuIEdldFBsdWdpbkZyYW1lKCkuZmluZENoaWxkcmVuKHggPT4geyByZXR1cm4gR2V0UGx1Z2luRGF0YSh4KS5sZW5ndGggPT09IDI7IH0pO1xyXG59XHJcbmZ1bmN0aW9uIEdldEZsb3coZnJvbSwgdG8pIHtcclxuICAgIHJldHVybiBmaWdtYS5jdXJyZW50UGFnZS5maW5kT25lKHggPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB4LmdldFBsdWdpbkRhdGEoRlJBTUVfREFUQSk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiAoZGF0YSkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAocGFyc2VkLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZFswXSA9PT0gZnJvbS5pZCAmJiBwYXJzZWRbMV0gPT09IHRvLmlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuLy8gI3JlZ2lvbiBGbG93XHJcbmZ1bmN0aW9uIFVwZGF0ZUZsb3coZmxvdykge1xyXG4gICAgY29uc3QgZGF0YSA9IEdldFBsdWdpbkRhdGEoZmxvdyk7XHJcbiAgICBjb25zdCBmcm9tID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoZGF0YVswXSk7XHJcbiAgICBjb25zdCB0byA9IGZpZ21hLmdldE5vZGVCeUlkKGRhdGFbMV0pO1xyXG4gICAgaWYgKGZyb20ucmVtb3ZlZCkge1xyXG4gICAgICAgIFJlbW92ZUZsb3dzKGZyb20pO1xyXG4gICAgfVxyXG4gICAgaWYgKHRvLnJlbW92ZWQpIHtcclxuICAgICAgICBSZW1vdmVGbG93cyh0byk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXRvLnJlbW92ZWQgJiYgIWZyb20ucmVtb3ZlZCkge1xyXG4gICAgICAgIFVwZGF0ZUZsb3dQb3NpdGlvbihmbG93LCBmcm9tLCB0byk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gVXBkYXRlRmxvd1Bvc2l0aW9uKGZsb3csIGZyb20sIHRvKSB7XHJcbiAgICBjb25zdCBzcCA9IHNuYXBwb2ludHNfMS5kZWZhdWx0LkdldENsb3Nlc3RTbmFwUG9pbnRzKGZyb20sIHRvKTtcclxuICAgIGNvbnN0IHggPSBzcFswXS54IC0gc3BbMV0ueDtcclxuICAgIGNvbnN0IHkgPSBzcFswXS55IC0gc3BbMV0ueTtcclxuICAgIGZsb3cueCA9IHNwWzBdLnggLSB4IC0gRlJBTUVfT0ZGU0VULng7XHJcbiAgICBmbG93LnkgPSBzcFswXS55IC0geSAtIEZSQU1FX09GRlNFVC55O1xyXG4gICAgZmxvdy52ZWN0b3JQYXRocyA9IFt7XHJcbiAgICAgICAgICAgIHdpbmRpbmdSdWxlOiAnRVZFTk9ERCcsXHJcbiAgICAgICAgICAgIGRhdGE6IGBNIDAgMCBMICR7eH0gJHt5fSBaYCxcclxuICAgICAgICB9XTtcclxufVxyXG5mdW5jdGlvbiBDcmVhdGVGbG93KGZyb20sIHRvLCBzZXR0aW5ncykge1xyXG4gICAgbGV0IHN2ZyA9IG51bGw7XHJcbiAgICBzdmcgPSBHZXRGbG93KGZyb20sIHRvKTtcclxuICAgIGlmIChzdmcgPT09IG51bGwpIHtcclxuICAgICAgICBzdmcgPSBmaWdtYS5jcmVhdGVWZWN0b3IoKTtcclxuICAgICAgICBHZXRQbHVnaW5GcmFtZSgpLmFwcGVuZENoaWxkKHN2Zyk7XHJcbiAgICAgICAgc3ZnLnN0cm9rZVdlaWdodCA9IHNldHRpbmdzLndlaWdodDtcclxuICAgICAgICBzdmcuZGFzaFBhdHRlcm4gPSBzZXR0aW5ncy5kYXNoUGF0dGVybjtcclxuICAgICAgICBTZXRTdHJva2VDYXAoc3ZnLCBzZXR0aW5ncy5zdHJva2VDYXBbMF0sIHNldHRpbmdzLnN0cm9rZUNhcFsxXSk7XHJcbiAgICAgICAgU2V0UGx1Z2luRGF0YShzdmcsIFtmcm9tLmlkLCB0by5pZF0pO1xyXG4gICAgfVxyXG4gICAgc3ZnLm5hbWUgPSBgJHtmcm9tLm5hbWV9IC0+ICR7dG8ubmFtZX1gO1xyXG4gICAgVXBkYXRlRmxvd1Bvc2l0aW9uKHN2ZywgZnJvbSwgdG8pO1xyXG59XHJcbmV4cG9ydHMuQ3JlYXRlRmxvdyA9IENyZWF0ZUZsb3c7XHJcbmZ1bmN0aW9uIFNldFN0cm9rZUNhcChub2RlLCBzdGFydCwgZW5kKSB7XHJcbiAgICBjb25zdCBjb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShub2RlLnZlY3Rvck5ldHdvcmspKTtcclxuICAgIGlmIChcInN0cm9rZUNhcFwiIGluIGNvcHkudmVydGljZXNbY29weS52ZXJ0aWNlcy5sZW5ndGggLSAxXSkge1xyXG4gICAgICAgIGNvcHkudmVydGljZXNbY29weS52ZXJ0aWNlcy5sZW5ndGggLSAxXS5zdHJva2VDYXAgPSBzdGFydDtcclxuICAgICAgICBjb3B5LnZlcnRpY2VzWzBdLnN0cm9rZUNhcCA9IGVuZDtcclxuICAgIH1cclxuICAgIG5vZGUudmVjdG9yTmV0d29yayA9IGNvcHk7XHJcbn1cclxubGV0IGxhc3RTZWxlY3Rpb247XHJcbmZ1bmN0aW9uIFNldEV2ZW50cygpIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9ICgwLCBzZWxlY3Rpb25fMS5HZXRTZWxlY3Rpb24pKCk7XHJcbiAgICAgICAgR2V0QWxsRmxvd3MoKS5mb3JFYWNoKHggPT4ge1xyXG4gICAgICAgICAgICBVcGRhdGVGbG93KHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSwgMTAwKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIFVwZGF0ZVBsdWdpbkZyYW1lKCk7XHJcbiAgICB9LCAxMDAwKTtcclxuICAgICgwLCBzZWxlY3Rpb25fMS5TZXRPblNlbGVjdGlvbkl0ZW1BZGRlZCkoKGl0ZW0pID0+IHtcclxuICAgIH0pO1xyXG4gICAgKDAsIHNlbGVjdGlvbl8xLlNldE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQpKChpdGVtKSA9PiB7XHJcbiAgICAgICAgaWYgKGl0ZW0ucmVtb3ZlZCkge1xyXG4gICAgICAgICAgICBSZW1vdmVGbG93cyhpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLlNldEV2ZW50cyA9IFNldEV2ZW50cztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5VcGRhdGVTZWxlY3Rpb24gPSBleHBvcnRzLkdldFNlbGVjdGlvbiA9IGV4cG9ydHMuU2V0T25TZWxlY3Rpb25JdGVtUmVtb3ZlZCA9IGV4cG9ydHMuU2V0T25TZWxlY3Rpb25JdGVtQWRkZWQgPSBleHBvcnRzLlNldE9uU2VsZWN0aW9uQ2hhbmdlZCA9IHZvaWQgMDtcclxubGV0IGxhc3RTZWxlY3Rpb24gPSBbXTtcclxubGV0IE9uU2VsZWN0aW9uQ2hhbmdlZDtcclxubGV0IE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQ7XHJcbmxldCBPblNlbGVjdGlvbkl0ZW1BZGRlZDtcclxuZnVuY3Rpb24gVXBkYXRlU2VsZWN0aW9uKCkge1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xyXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgLy9yZW1vdmVkXHJcbiAgICBpZiAobGFzdFNlbGVjdGlvbi5sZW5ndGggPiBzZWxlY3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgbGFzdFNlbGVjdGlvbi5mb3JFYWNoKCh4LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gc2VsZWN0aW9uLmZpbmQoKHksIGkyKSA9PiB7IHJldHVybiB4LmlkID09PSB5LmlkOyB9KTtcclxuICAgICAgICAgICAgaWYgKGZvdW5kICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVzdWx0LmZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgICAgIE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQoeCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGFzdFNlbGVjdGlvbiA9IHJlc3VsdDtcclxuICAgIH1cclxuICAgIC8vYWRkZWRcclxuICAgIGVsc2UgaWYgKGxhc3RTZWxlY3Rpb24ubGVuZ3RoIDwgc2VsZWN0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgIHNlbGVjdGlvbi5mb3JFYWNoKCh4LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gbGFzdFNlbGVjdGlvbi5maW5kKCh5LCBpMikgPT4geyByZXR1cm4geC5pZCA9PT0geS5pZDsgfSk7XHJcbiAgICAgICAgICAgIGlmIChmb3VuZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0U2VsZWN0aW9uLnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICBPblNlbGVjdGlvbkl0ZW1BZGRlZCh4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy9idWdcclxuICAgIGVsc2Uge1xyXG4gICAgfVxyXG4gICAgaWYgKGxhc3RTZWxlY3Rpb24ubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgT25TZWxlY3Rpb25DaGFuZ2VkKGxhc3RTZWxlY3Rpb24pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuVXBkYXRlU2VsZWN0aW9uID0gVXBkYXRlU2VsZWN0aW9uO1xyXG5mdW5jdGlvbiBHZXRTZWxlY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbGFzdFNlbGVjdGlvbjtcclxufVxyXG5leHBvcnRzLkdldFNlbGVjdGlvbiA9IEdldFNlbGVjdGlvbjtcclxuZnVuY3Rpb24gU2V0T25TZWxlY3Rpb25JdGVtUmVtb3ZlZChjYWxsYmFjaykge1xyXG4gICAgT25TZWxlY3Rpb25JdGVtUmVtb3ZlZCA9IGNhbGxiYWNrO1xyXG59XHJcbmV4cG9ydHMuU2V0T25TZWxlY3Rpb25JdGVtUmVtb3ZlZCA9IFNldE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQ7XHJcbmZ1bmN0aW9uIFNldE9uU2VsZWN0aW9uSXRlbUFkZGVkKGNhbGxiYWNrKSB7XHJcbiAgICBPblNlbGVjdGlvbkl0ZW1BZGRlZCA9IGNhbGxiYWNrO1xyXG59XHJcbmV4cG9ydHMuU2V0T25TZWxlY3Rpb25JdGVtQWRkZWQgPSBTZXRPblNlbGVjdGlvbkl0ZW1BZGRlZDtcclxuZnVuY3Rpb24gU2V0T25TZWxlY3Rpb25DaGFuZ2VkKGNhbGxiYWNrKSB7XHJcbiAgICBPblNlbGVjdGlvbkNoYW5nZWQgPSBjYWxsYmFjaztcclxuICAgIGZpZ21hLm9uKCdzZWxlY3Rpb25jaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgVXBkYXRlU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgLy8gc2V0SW50ZXJ2YWwoVXBkYXRlRmxvdywgMjAwKTtcclxuICAgICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgLy8gY2hlY2sgaWYgaXQgZG9lc250IGhhdmUgYXJyb3cgYXR0YWNoZWRcclxuICAgICAgICAgICAgLy8gbG9naWMgaXMgdG8gYXR0YWNoL3JlbW92ZSBmcm9tIC0yIHRvIC0xXHJcbiAgICAgICAgICAgIC8vIDBcclxuICAgICAgICAgICAgLy8gMVxyXG4gICAgICAgICAgICAvLyAyXHJcbiAgICAgICAgICAgIC8vIDNcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLlNldE9uU2VsZWN0aW9uQ2hhbmdlZCA9IFNldE9uU2VsZWN0aW9uQ2hhbmdlZDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyogZXNsaW50LWRpc2FibGUgbm8tbmVzdGVkLXRlcm5hcnkgKi9cclxuY29uc3QgdmVjdG9yXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vdmVjdG9yXCIpKTtcclxuY2xhc3MgU25hcFBvaW50IGV4dGVuZHMgdmVjdG9yXzEuZGVmYXVsdCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCBfdHlwZSkge1xyXG4gICAgICAgIHN1cGVyKHgsIHkpO1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSBfdHlwZTtcclxuICAgIH1cclxufVxyXG4vLyAjcmVnaW9uIFNuYXBQb2ludHMgXHJcbi8vIFRPRE8gUm90YXRpb24gc3VwcG9ydFxyXG5mdW5jdGlvbiBHZXRTbmFwUG9pbnQoeCwgX3R5cGUpIHtcclxuICAgIGxldCByZXN1bHQgPSBuZXcgU25hcFBvaW50KDAsIDAsIF90eXBlKTtcclxuICAgIGlmIChfdHlwZSA9PT0gJ3RvcCcpIHtcclxuICAgICAgICByZXN1bHQueCA9IHgueCArICh4LndpZHRoICogMC41KTtcclxuICAgICAgICByZXN1bHQueSA9IHgueTtcclxuICAgIH1cclxuICAgIGlmIChfdHlwZSA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICAgIHJlc3VsdC54ID0geC54ICsgeC53aWR0aDtcclxuICAgICAgICByZXN1bHQueSA9IHgueSArICh4LmhlaWdodCAqIDAuNSk7XHJcbiAgICB9XHJcbiAgICBpZiAoX3R5cGUgPT09ICdib3R0b20nKSB7XHJcbiAgICAgICAgcmVzdWx0LnggPSB4LnggKyAoeC53aWR0aCAqIDAuNSk7XHJcbiAgICAgICAgcmVzdWx0LnkgPSB4LnkgKyB4LmhlaWdodDtcclxuICAgIH1cclxuICAgIGlmIChfdHlwZSA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgcmVzdWx0LnggPSB4Lng7XHJcbiAgICAgICAgcmVzdWx0LnkgPSB4LnkgKyAoeC5oZWlnaHQgKiAwLjUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5mdW5jdGlvbiBHZXRTbmFwUG9pbnRCeUlkKHgsIGlkKSB7XHJcbiAgICByZXR1cm4gR2V0U25hcFBvaW50KHgsIGlkID09PSAwID8gJ3RvcCdcclxuICAgICAgICA6IGlkID09PSAxID8gJ3JpZ2h0J1xyXG4gICAgICAgICAgICA6IGlkID09PSAyID8gJ2JvdHRvbScgOiAnbGVmdCcpO1xyXG59XHJcbmZ1bmN0aW9uIEdldENsb3Nlc3RTbmFwUG9pbnRzKGZyb20sIHRvKSB7XHJcbiAgICAvKlxyXG4gICAgICBvIC0gbG9jYXRpb24gLyBzbmFwcG9pbnRcclxuICAgICAgeCAtIHNuYXBwb2ludFxyXG4gICAgICArIC0gYW5nbGVcclxuICAgICAgLVxyXG4gICAgICAgIG8tLS0tLXgtLS0tLStcclxuICAgICAgICB8ICAgICAgICAgICB8XHJcbiAgICAgICAgeCAgICAgICAgICAgeFxyXG4gICAgICAgIHwgICAgICAgICAgIHxcclxuICAgICAgICArLS0tLS14LS0tLS0rXHJcbiAgICAgICAgICAgICAgICAgICAgICArXHJcbiAgICAqL1xyXG4gICAgY29uc3QgTWFwID0gW1xyXG4gICAgICAgIFsndG9wJywgJ2JvdHRvbSddLFxyXG4gICAgICAgIFsncmlnaHQnLCAnbGVmdCddLFxyXG4gICAgICAgIFsnYm90dG9tJywgJ3RvcCddLFxyXG4gICAgICAgIFsnbGVmdCcsICdyaWdodCddLFxyXG4gICAgXTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtcclxuICAgICAgICBHZXRTbmFwUG9pbnRCeUlkKGZyb20sIDApLFxyXG4gICAgICAgIEdldFNuYXBQb2ludEJ5SWQodG8sIDApLFxyXG4gICAgXTtcclxuICAgIC8vIG9uIHRvcCBcclxuICAgIC8vIG9uIGJvdHRvbVxyXG4gICAgLy8gb24gdGhlIHNhbWUgXHJcbiAgICBsZXQgbGFzdERpc3RhbmNlID0gOTk5OTk5OTk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHMxID0gR2V0U25hcFBvaW50KGZyb20sIE1hcFtpXVswXSk7XHJcbiAgICAgICAgY29uc3QgczIgPSBHZXRTbmFwUG9pbnQodG8sIE1hcFtpXVsxXSk7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBzMS5kaXN0KHMyKTtcclxuICAgICAgICBpZiAoZGlzdGFuY2UgPCBsYXN0RGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgcmVzdWx0WzBdID0gczE7XHJcbiAgICAgICAgICAgIHJlc3VsdFsxXSA9IHMyO1xyXG4gICAgICAgICAgICBsYXN0RGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IHsgR2V0U25hcFBvaW50LCBHZXRTbmFwUG9pbnRCeUlkLCBHZXRDbG9zZXN0U25hcFBvaW50cyB9O1xyXG4vLyAjZW5kcmVnaW9uXHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8vICNyZWdpb24gVmVjdG9yXHJcbmNsYXNzIFZlY3RvcjJEIHtcclxuICAgIGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcbiAgICBkaXN0KHRvKSB7XHJcbiAgICAgICAgY29uc3QgeGQgPSB0aGlzLnggLSB0by54O1xyXG4gICAgICAgIGNvbnN0IHlkID0gdGhpcy55IC0gdG8ueTtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHhkICogeGQgKyB5ZCAqIHlkKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBWZWN0b3IyRDtcclxuLy8gI2VuZHJlZ2lvblxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY29kZS50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==