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
        case 'set-color': {
            const getColor = function (pos, value) {
                return parseFloat((parseInt(msg.value.substr(pos, 2), 16) / 0xFF).toPrecision(3));
            };
            //#ABACAD
            flowSettings.color.r = getColor(1, msg.value); // AB 
            flowSettings.color.g = getColor(3, msg.value); // AC
            flowSettings.color.b = getColor(5, msg.value); // AD
            console.log(flowSettings);
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
    console.log(copy[0]);
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
            console.log(sp);
            console.log([cX, cY]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsb0NBQW9DLGdCQUFnQjtBQUN2RixDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLDBDQUEwQyw0QkFBNEI7QUFDdEUsQ0FBQztBQUNEO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELCtCQUErQixtQkFBTyxDQUFDLHVDQUFhO0FBQ3BELDBCQUEwQixtQkFBTyxDQUFDLDZCQUFRO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCwwQkFBMEIsaUJBQWlCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0QsMkRBQTJEO0FBQzNELDJEQUEyRDtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDakZhO0FBQ2I7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsa0JBQWtCLEdBQUcsZUFBZSxHQUFHLGNBQWMsR0FBRyxvQkFBb0I7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1CQUFPLENBQUMsdUNBQWE7QUFDekMscUNBQXFDLG1CQUFPLENBQUMseUNBQWM7QUFDM0QsaUNBQWlDLG1CQUFPLENBQUMsaUNBQVU7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELHFDQUFxQztBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlO0FBQ2Y7Ozs7Ozs7VUNmQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vSXRlbUZsb3cvLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9JdGVtRmxvdy8uL3NyYy9mbG93LnRzIiwid2VicGFjazovL0l0ZW1GbG93Ly4vc3JjL3NlbGVjdGlvbi50cyIsIndlYnBhY2s6Ly9JdGVtRmxvdy8uL3NyYy9zbmFwcG9pbnRzLnRzIiwid2VicGFjazovL0l0ZW1GbG93Ly4vc3JjL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly9JdGVtRmxvdy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9JdGVtRmxvdy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0l0ZW1GbG93L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9JdGVtRmxvdy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qIGVzbGludC1kaXNhYmxlIGRlZmF1bHQtY2FzZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wbHVzcGx1cyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1uZXN0ZWQtdGVybmFyeSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtY2xhc3Nlcy1wZXItZmlsZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufSk7XHJcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHNlbGVjdGlvbiA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9zZWxlY3Rpb25cIikpO1xyXG5jb25zdCBmbG93ID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2Zsb3dcIikpO1xyXG5maWdtYS5zaG93VUkoX19odG1sX18pO1xyXG4vLyBUT0RPIGNoZWNrIGZvciByZW1vdmVkIFxyXG5jb25zdCBmbG93U2V0dGluZ3MgPSBuZXcgZmxvdy5GbG93U2V0dGluZ3MoKTtcclxuLyogdG9kbyB1cGRhdGUgeiBpbmRleCAqL1xyXG5mbG93LkVuYWJsZSgpO1xyXG5zZWxlY3Rpb24uU2V0T25TZWxlY3Rpb25DaGFuZ2VkKChzZWxlY3Rpb24pID0+IHtcclxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgZmxvdy5DcmVhdGVGbG93KHNlbGVjdGlvblswXSwgc2VsZWN0aW9uWzFdLCBmbG93U2V0dGluZ3MpO1xyXG4gICAgfVxyXG59KTtcclxuZmlnbWEub24oJ2Nsb3NlJywgKCkgPT4geyBmbG93LkRpc2FibGUoKTsgfSk7XHJcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IChtc2cpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKG1zZyk7XHJcbiAgICBzd2l0Y2ggKG1zZy50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnc2V0LXN0cm9rZS13ZWlnaHQnOiB7XHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy53ZWlnaHQgPSBwYXJzZUludChtc2cudmFsdWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnc2V0LXN0cm9rZS1jYXAnOiB7XHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy5zdHJva2VDYXBbMF0gPSBtc2cudmFsdWVbMF07XHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy5zdHJva2VDYXBbMV0gPSBtc2cudmFsdWVbMV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlICdzZXQtY29sb3InOiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdldENvbG9yID0gZnVuY3Rpb24gKHBvcywgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KChwYXJzZUludChtc2cudmFsdWUuc3Vic3RyKHBvcywgMiksIDE2KSAvIDB4RkYpLnRvUHJlY2lzaW9uKDMpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8jQUJBQ0FEXHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy5jb2xvci5yID0gZ2V0Q29sb3IoMSwgbXNnLnZhbHVlKTsgLy8gQUIgXHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy5jb2xvci5nID0gZ2V0Q29sb3IoMywgbXNnLnZhbHVlKTsgLy8gQUNcclxuICAgICAgICAgICAgZmxvd1NldHRpbmdzLmNvbG9yLmIgPSBnZXRDb2xvcig1LCBtc2cudmFsdWUpOyAvLyBBRFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmbG93U2V0dGluZ3MpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnc2V0LWNvbG9yLW9wYWNpdHknOiB7XHJcbiAgICAgICAgICAgIGZsb3dTZXR0aW5ncy5jb2xvci5hID0gbXNnLnZhbHVlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnc2V0LWRhc2gtcGF0dGVybic6IHtcclxuICAgICAgICAgICAgZmxvd1NldHRpbmdzLmRhc2hQYXR0ZXJuID0gW3BhcnNlSW50KG1zZy52YWx1ZSldO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnc2V0LWJlemllcic6IHtcclxuICAgICAgICAgICAgZmxvd1NldHRpbmdzLmJlemllciA9IG1zZy52YWx1ZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgJ2NhbmNlbCc6IHtcclxuICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkNyZWF0ZUZsb3cgPSBleHBvcnRzLkRpc2FibGUgPSBleHBvcnRzLkVuYWJsZSA9IGV4cG9ydHMuRmxvd1NldHRpbmdzID0gdm9pZCAwO1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wbHVzcGx1cyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1uZXN0ZWQtdGVybmFyeSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtY2xhc3Nlcy1wZXItZmlsZSAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXHJcbmNvbnN0IHNlbGVjdGlvbl8xID0gcmVxdWlyZShcIi4vc2VsZWN0aW9uXCIpO1xyXG5jb25zdCBzbmFwcG9pbnRzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vc25hcHBvaW50c1wiKSk7XHJcbmNvbnN0IHZlY3Rvcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3ZlY3RvclwiKSk7XHJcbmNvbnN0IFBMVUdJTl9OQU1FID0gJ0l0ZW1GcmFtZSc7XHJcbmNvbnN0IEZMT1dfREFUQSA9ICdJRic7XHJcbmNvbnN0IEZMT1dfQ09PUkRTX0RBVEEgPSAnSUZDJztcclxuY29uc3QgRkxPV19TRVRUSU5HU19EQVRBID0gJ0lGUyc7XHJcbmNvbnN0IEZSQU1FX0RBVEEgPSBQTFVHSU5fTkFNRTtcclxuY29uc3QgVU5ERUZJTkVEX0lEID0gJ3VuZGVmaW5lZCc7XHJcbmNvbnN0IEZSQU1FX09GRlNFVCA9IG5ldyB2ZWN0b3JfMS5kZWZhdWx0KC05OTk5OSwgLTk5OTk5KTtcclxubGV0IERBVEFfTk9ERV9JRCA9IFVOREVGSU5FRF9JRDtcclxuLy8gI3JlZ2lvbiBGcmFtZVxyXG5mdW5jdGlvbiBHZXRQbHVnaW5GcmFtZSgpIHtcclxuICAgIGxldCBmb3VuZDtcclxuICAgIGlmIChEQVRBX05PREVfSUQgIT09IFVOREVGSU5FRF9JRCkge1xyXG4gICAgICAgIGZvdW5kID0gZmlnbWEuY3VycmVudFBhZ2UuZmluZE9uZSgoeCkgPT4geC5pZCA9PT0gREFUQV9OT0RFX0lEKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZvdW5kID0gZmlnbWEuY3VycmVudFBhZ2UuZmluZE9uZSgoeCkgPT4geC5nZXRQbHVnaW5EYXRhKEZSQU1FX0RBVEEpID09PSAnMScpO1xyXG4gICAgfVxyXG4gICAgaWYgKGZvdW5kID09PSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgcGx1Z2luRnJhbWUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xyXG4gICAgICAgIHBsdWdpbkZyYW1lLnJlc2l6ZSgxLCAxKTtcclxuICAgICAgICBwbHVnaW5GcmFtZS54ID0gRlJBTUVfT0ZGU0VULng7XHJcbiAgICAgICAgcGx1Z2luRnJhbWUueSA9IEZSQU1FX09GRlNFVC55O1xyXG4gICAgICAgIHBsdWdpbkZyYW1lLmxvY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgIHBsdWdpbkZyYW1lLm5hbWUgPSBQTFVHSU5fTkFNRTtcclxuICAgICAgICBwbHVnaW5GcmFtZS5jbGlwc0NvbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICBwbHVnaW5GcmFtZS5zZXRQbHVnaW5EYXRhKEZSQU1FX0RBVEEsICcxJyk7XHJcbiAgICAgICAgZm91bmQgPSBmaWdtYS5jdXJyZW50UGFnZS5maW5kT25lKCh4KSA9PiB4LmdldFBsdWdpbkRhdGEoRlJBTUVfREFUQSkgPT09ICcxJyk7XHJcbiAgICAgICAgREFUQV9OT0RFX0lEID0gZm91bmQuaWQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBEQVRBX05PREVfSUQgPSBmb3VuZC5pZDtcclxuICAgIH1cclxuICAgIHJldHVybiBmb3VuZDtcclxufVxyXG5mdW5jdGlvbiBVcGRhdGVQbHVnaW5GcmFtZSgpIHtcclxuICAgIGZpZ21hLmN1cnJlbnRQYWdlLmluc2VydENoaWxkKGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmxlbmd0aCwgR2V0UGx1Z2luRnJhbWUoKSk7XHJcbn1cclxuY2xhc3MgQ29sb3Ige1xyXG4gICAgY29uc3RydWN0b3IociwgZywgYiwgYSkge1xyXG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KHIgPD0gMS4wICYmIGcgPD0gMS4wICYmIGIgPD0gMS4wICYmIGEgPD0gMS4wKTtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgfVxyXG59XHJcbi8vICNlbmRyZWdpb25cclxuY2xhc3MgRmxvd1NldHRpbmdzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuc3Ryb2tlQ2FwID0gWydOT05FJywgJ0FSUk9XX0VRVUlMQVRFUkFMJ107XHJcbiAgICAgICAgdGhpcy5kYXNoUGF0dGVybiA9IFtdO1xyXG4gICAgICAgIHRoaXMud2VpZ2h0ID0gMTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gbmV3IENvbG9yKDAsIDAsIDAsIDEpO1xyXG4gICAgICAgIHRoaXMuYmV6aWVyID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkZsb3dTZXR0aW5ncyA9IEZsb3dTZXR0aW5ncztcclxuY2xhc3MgRmxvd0Nvb3Jkc0RhdGEge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5zbmFwUG9pbnRzID0gW107XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gU2V0Rmxvd0Nvb3Jkc0RhdGEobm9kZSwgZGF0YSkge1xyXG4gICAgbm9kZS5zZXRQbHVnaW5EYXRhKEZMT1dfQ09PUkRTX0RBVEEsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxufVxyXG5mdW5jdGlvbiBHZXRGbG93Q29vcmRzRGF0YShub2RlKSB7XHJcbiAgICBjb25zdCBkYXRhID0gbm9kZS5nZXRQbHVnaW5EYXRhKEZMT1dfQ09PUkRTX0RBVEEpO1xyXG4gICAgaWYgKGRhdGEubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuZnVuY3Rpb24gU2V0Rmxvd1NldHRpbmdzKG5vZGUsIHNldHRpbmdzKSB7XHJcbiAgICBub2RlLnNldFBsdWdpbkRhdGEoRkxPV19TRVRUSU5HU19EQVRBLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xyXG59XHJcbmZ1bmN0aW9uIEdldEZsb3dTZXR0aW5ncyhub2RlKSB7XHJcbiAgICBjb25zdCBkYXRhID0gbm9kZS5nZXRQbHVnaW5EYXRhKEZMT1dfU0VUVElOR1NfREFUQSk7XHJcbiAgICBpZiAoZGF0YS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZWQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5mdW5jdGlvbiBTZXRGbG93RGF0YShub2RlLCBkYXRhKSB7XHJcbiAgICBub2RlLnNldFBsdWdpbkRhdGEoRkxPV19EQVRBLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbn1cclxuZnVuY3Rpb24gR2V0Rmxvd0RhdGEobm9kZSkge1xyXG4gICAgY29uc3QgZGF0YSA9IG5vZGUuZ2V0UGx1Z2luRGF0YShGTE9XX0RBVEEpO1xyXG4gICAgaWYgKGRhdGEubGVuZ3RoICE9IDApIHtcclxuICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZWQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW107XHJcbn1cclxuZnVuY3Rpb24gUmVtb3ZlRmxvd3Mob2YpIHtcclxuICAgIGxldCBmbG93cyA9IEdldFBsdWdpbkZyYW1lKCkuZmluZENoaWxkcmVuKHggPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBHZXRGbG93RGF0YSh4KTtcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGEuZmluZCh4ID0+IHggPT09IG9mLmlkKSAhPT0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICBmbG93cy5mb3JFYWNoKHggPT4geC5yZW1vdmUoKSk7XHJcbn1cclxuZnVuY3Rpb24gR2V0QWxsRmxvd3MoKSB7XHJcbiAgICByZXR1cm4gR2V0UGx1Z2luRnJhbWUoKS5maW5kQ2hpbGRyZW4oeCA9PiB7IHJldHVybiBHZXRGbG93RGF0YSh4KS5sZW5ndGggPT09IDI7IH0pO1xyXG59XHJcbmZ1bmN0aW9uIEdldEZsb3coZnJvbSwgdG8pIHtcclxuICAgIHJldHVybiBmaWdtYS5jdXJyZW50UGFnZS5maW5kT25lKHggPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBHZXRGbG93RGF0YSh4KTtcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGFbMF0gPT09IGZyb20uaWQgJiYgZGF0YVsxXSA9PT0gdG8uaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIFVwZGF0ZUZsb3dBcHBlYXJhbmNlKGZsb3cpIHtcclxuICAgIGNvbnN0IGZsb3dTZXR0aW5ncyA9IEdldEZsb3dTZXR0aW5ncyhmbG93KTtcclxuICAgIFNldFN0cm9rZUNhcChmbG93LCBmbG93U2V0dGluZ3Muc3Ryb2tlQ2FwWzBdLCBmbG93U2V0dGluZ3Muc3Ryb2tlQ2FwWzFdKTtcclxuICAgIGZsb3cuZGFzaFBhdHRlcm4gPSBmbG93U2V0dGluZ3MuZGFzaFBhdHRlcm47XHJcbiAgICBmbG93LnN0cm9rZVdlaWdodCA9IGZsb3dTZXR0aW5ncy53ZWlnaHQ7XHJcbiAgICBjb25zdCBjb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShmbG93LnN0cm9rZXMpKTtcclxuICAgIGNvbnNvbGUubG9nKGNvcHlbMF0pO1xyXG4gICAgY29weVswXS5jb2xvci5yID0gZmxvd1NldHRpbmdzLmNvbG9yLnI7XHJcbiAgICBjb3B5WzBdLmNvbG9yLmcgPSBmbG93U2V0dGluZ3MuY29sb3IuZztcclxuICAgIGNvcHlbMF0uY29sb3IuYiA9IGZsb3dTZXR0aW5ncy5jb2xvci5iO1xyXG4gICAgY29weVswXS5vcGFjaXR5ID0gZmxvd1NldHRpbmdzLmNvbG9yLmE7XHJcbiAgICBmbG93LnN0cm9rZXMgPSBjb3B5O1xyXG59XHJcbmZ1bmN0aW9uIFVwZGF0ZUZsb3dfSW50ZXJuYWwoZmxvdywgZnJvbSwgdG8sIGZvcmNlKSB7XHJcbiAgICBjb25zdCBzcCA9IHNuYXBwb2ludHNfMS5kZWZhdWx0LkdldENsb3Nlc3RTbmFwUG9pbnRzKGZyb20sIHRvKTtcclxuICAgIGNvbnN0IHggPSBzcFswXS54IC0gc3BbMV0ueDtcclxuICAgIGNvbnN0IHkgPSBzcFswXS55IC0gc3BbMV0ueTtcclxuICAgIGNvbnN0IGNvb3Jkc0RhdGEgPSBHZXRGbG93Q29vcmRzRGF0YShmbG93KTtcclxuICAgIGxldCBzbmFwUG9pbnRzQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAvLyBkb2VzbnQgbWF0dGVyIHRvIGNhbGMgY2hhbmdlcyBpZiBmb3JjZSB1cGRhdGVcclxuICAgIGlmICghZm9yY2UgJiYgY29vcmRzRGF0YSAhPT0gbnVsbCkge1xyXG4gICAgICAgIHNuYXBQb2ludHNDaGFuZ2VkID1cclxuICAgICAgICAgICAgY29vcmRzRGF0YS5zbmFwUG9pbnRzWzBdLnggIT09IHNwWzBdLnggfHxcclxuICAgICAgICAgICAgICAgIGNvb3Jkc0RhdGEuc25hcFBvaW50c1swXS55ICE9PSBzcFswXS55IHx8XHJcbiAgICAgICAgICAgICAgICBjb29yZHNEYXRhLnNuYXBQb2ludHNbMV0ueCAhPT0gc3BbMV0ueCB8fFxyXG4gICAgICAgICAgICAgICAgY29vcmRzRGF0YS5zbmFwUG9pbnRzWzFdLnkgIT09IHNwWzFdLnk7XHJcbiAgICB9XHJcbiAgICBpZiAoc25hcFBvaW50c0NoYW5nZWQpIHtcclxuICAgICAgICBjb25zdCBmbG93WCA9IHNwWzBdLnggLSB4IC0gRlJBTUVfT0ZGU0VULng7XHJcbiAgICAgICAgY29uc3QgZmxvd1kgPSBzcFswXS55IC0geSAtIEZSQU1FX09GRlNFVC55O1xyXG4gICAgICAgIGZsb3cueCA9IGZsb3dYO1xyXG4gICAgICAgIGZsb3cueSA9IGZsb3dZO1xyXG4gICAgICAgIGlmIChHZXRGbG93U2V0dGluZ3MoZmxvdykuYmV6aWVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNYID0gWzAsIDBdO1xyXG4gICAgICAgICAgICBjb25zdCBjWSA9IFswLCAwXTtcclxuICAgICAgICAgICAgLy8gVE9ETyBSb3RhdGlvbiBzdXBwb3J0XHJcbiAgICAgICAgICAgIC8vIC8vIEVORFBPSU5UIElGIEZST00gSVMgUklHSFRcclxuICAgICAgICAgICAgLy8gY29uc3QgZnJvbVJhZGlhbiA9IChmcm9tIGFzIExheW91dE1peGluKS5yb3RhdGlvbiAqICgzLjE0IC8gMTgwKTtcclxuICAgICAgICAgICAgLy8gY29uc3QgdG9SYWRpYW4gPSAodG8gYXMgTGF5b3V0TWl4aW4pLnJvdGF0aW9uICogKDMuMTQgLyAxODApO1xyXG4gICAgICAgICAgICAvLyBpZiAoc3BbMF0uX3R5cGUgPT09ICdyaWdodCcpIHtcclxuICAgICAgICAgICAgLy8gICBjWFswXSA9IHgyICogTWF0aC5jb3ModG9SYWRpYW4pICsgKHkyICogTWF0aC5zaW4odG9SYWRpYW4pKTsgIFxyXG4gICAgICAgICAgICAvLyAgIGNZWzBdID0geDIgKiAoMi81ICogMy4xNCkgKiBNYXRoLnNpbigtMSAqIHRvUmFkaWFuKSArICh5MiAqIE1hdGguc2luKHRvUmFkaWFuKSk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gLy9TVEFSVFBPSU5UIElGIFRPIElTIExFRlRcclxuICAgICAgICAgICAgLy8gaWYgKHNwWzFdLl90eXBlID09PSAnbGVmdCcpIHtcclxuICAgICAgICAgICAgLy8gICBjWFsxXSA9IHgyICogTWF0aC5jb3MoZnJvbVJhZGlhbik7ICBcclxuICAgICAgICAgICAgLy8gICBjWVsxXSA9IHgyICogKDIvNSozLjE0KSAqIE1hdGguc2luKC0xICogdG9SYWRpYW4pICsgeTIgKiAyICAqIE1hdGguY29zKGZyb21SYWRpYW4pO1xyXG4gICAgICAgICAgICAvLyB9IFxyXG4gICAgICAgICAgICBjb25zdCB5MiA9IHkgKiAwLjU7XHJcbiAgICAgICAgICAgIGNvbnN0IHgyID0geCAqIDAuNTtcclxuICAgICAgICAgICAgaWYgKHNwWzBdLl90eXBlID09PSAncmlnaHQnIHx8IHNwWzBdLl90eXBlID09PSAnbGVmdCcpIHtcclxuICAgICAgICAgICAgICAgIGNYWzFdID0geDI7XHJcbiAgICAgICAgICAgICAgICBjWVsxXSA9IHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNwWzBdLl90eXBlID09PSAndG9wJyB8fCBzcFswXS5fdHlwZSA9PT0gJ2JvdHRvbScpIHtcclxuICAgICAgICAgICAgICAgIGNYWzFdID0geDtcclxuICAgICAgICAgICAgICAgIGNZWzFdID0geTI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNwWzFdLl90eXBlID09PSAncmlnaHQnIHx8IHNwWzFdLl90eXBlID09PSAnbGVmdCcpIHtcclxuICAgICAgICAgICAgICAgIGNYWzBdID0geDI7XHJcbiAgICAgICAgICAgICAgICBjWVswXSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNwWzFdLl90eXBlID09PSAndG9wJyB8fCBzcFsxXS5fdHlwZSA9PT0gJ2JvdHRvbScpIHtcclxuICAgICAgICAgICAgICAgIGNYWzBdID0gMDtcclxuICAgICAgICAgICAgICAgIGNZWzBdID0geTI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coc3ApO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhbY1gsIGNZXSk7XHJcbiAgICAgICAgICAgIGZsb3cudmVjdG9yUGF0aHMgPSBbe1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRpbmdSdWxlOiAnRVZFTk9ERCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogYE0gMCAwIEMgJHtjWFswXX0gJHtjWVswXX0gJHtjWFsxXX0gJHtjWVsxXX0gJHt4fSAke3l9YCxcclxuICAgICAgICAgICAgICAgIH1dO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZmxvdy52ZWN0b3JQYXRocyA9IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZGluZ1J1bGU6ICdFVkVOT0REJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBgTSAwIDAgTCAke3h9ICR7eX1gLFxyXG4gICAgICAgICAgICAgICAgfV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFVwZGF0ZUZsb3dBcHBlYXJhbmNlKGZsb3cpO1xyXG4gICAgICAgIGxldCBkYXRhID0gbmV3IEZsb3dDb29yZHNEYXRhKCk7XHJcbiAgICAgICAgZGF0YS5zbmFwUG9pbnRzID0gW25ldyB2ZWN0b3JfMS5kZWZhdWx0KHNwWzBdLngsIHNwWzBdLnkpLCBuZXcgdmVjdG9yXzEuZGVmYXVsdChzcFsxXS54LCBzcFsxXS55KV07XHJcbiAgICAgICAgU2V0Rmxvd0Nvb3Jkc0RhdGEoZmxvdywgZGF0YSk7XHJcbiAgICAgICAgZmxvdy5uYW1lID0gYCR7ZnJvbS5uYW1lfSAtPiAke3RvLm5hbWV9YDtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBVcGRhdGVGbG93KGZsb3csIGZvcmNlID0gZmFsc2UpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBHZXRGbG93RGF0YShmbG93KTtcclxuICAgIGNvbnN0IGZyb20gPSBmaWdtYS5nZXROb2RlQnlJZChkYXRhWzBdKTtcclxuICAgIGNvbnN0IHRvID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoZGF0YVsxXSk7XHJcbiAgICBpZiAoZnJvbSA9PT0gbnVsbCB8fCB0byA9PT0gbnVsbCkge1xyXG4gICAgICAgIGZsb3cucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoZnJvbS5yZW1vdmVkKSB7XHJcbiAgICAgICAgICAgIFJlbW92ZUZsb3dzKGZyb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodG8ucmVtb3ZlZCkge1xyXG4gICAgICAgICAgICBSZW1vdmVGbG93cyh0byk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdG8ucmVtb3ZlZCAmJiAhZnJvbS5yZW1vdmVkKSB7XHJcbiAgICAgICAgICAgIFVwZGF0ZUZsb3dfSW50ZXJuYWwoZmxvdywgZnJvbSwgdG8sIGZvcmNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gQ3JlYXRlRmxvdyhmcm9tLCB0bywgc2V0dGluZ3MpIHtcclxuICAgIGxldCBzdmcgPSBudWxsO1xyXG4gICAgc3ZnID0gR2V0Rmxvdyhmcm9tLCB0byk7XHJcbiAgICBpZiAoc3ZnID09PSBudWxsKSB7XHJcbiAgICAgICAgc3ZnID0gZmlnbWEuY3JlYXRlVmVjdG9yKCk7XHJcbiAgICAgICAgR2V0UGx1Z2luRnJhbWUoKS5hcHBlbmRDaGlsZChzdmcpO1xyXG4gICAgfVxyXG4gICAgLy8gT3JkZXIgaXMgbWF0dGVyIDopXHJcbiAgICBTZXRGbG93U2V0dGluZ3Moc3ZnLCBzZXR0aW5ncyk7XHJcbiAgICBTZXRGbG93RGF0YShzdmcsIFtmcm9tLmlkLCB0by5pZF0pO1xyXG4gICAgVXBkYXRlRmxvdyhzdmcsIHRydWUpO1xyXG59XHJcbmV4cG9ydHMuQ3JlYXRlRmxvdyA9IENyZWF0ZUZsb3c7XHJcbi8vIFRPRE8gQ2lyY2xlIFxyXG5mdW5jdGlvbiBTZXRTdHJva2VDYXAobm9kZSwgc3RhcnQsIGVuZCkge1xyXG4gICAgY29uc3QgY29weSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobm9kZS52ZWN0b3JOZXR3b3JrKSk7XHJcbiAgICBpZiAoXCJzdHJva2VDYXBcIiBpbiBjb3B5LnZlcnRpY2VzW2NvcHkudmVydGljZXMubGVuZ3RoIC0gMV0pIHtcclxuICAgICAgICBjb3B5LnZlcnRpY2VzW2NvcHkudmVydGljZXMubGVuZ3RoIC0gMV0uc3Ryb2tlQ2FwID0gc3RhcnQ7XHJcbiAgICAgICAgY29weS52ZXJ0aWNlc1swXS5zdHJva2VDYXAgPSBlbmQ7XHJcbiAgICB9XHJcbiAgICBub2RlLnZlY3Rvck5ldHdvcmsgPSBjb3B5O1xyXG59XHJcbmxldCB1cGRhdGVGbG93SW50ZXJ2YWxJZCA9IC0xO1xyXG5sZXQgdXBkYXRlRnJhbWVJbnRlcnZhbElkID0gLTE7XHJcbmZ1bmN0aW9uIEVuYWJsZSgpIHtcclxuICAgIHVwZGF0ZUZsb3dJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIEdldEFsbEZsb3dzKCkuZm9yRWFjaCh4ID0+IHtcclxuICAgICAgICAgICAgVXBkYXRlRmxvdyh4KTtcclxuICAgICAgICB9KTtcclxuICAgIH0sIDEwMCk7XHJcbiAgICB1cGRhdGVGcmFtZUludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgVXBkYXRlUGx1Z2luRnJhbWUoKTtcclxuICAgIH0sIDEwMDApO1xyXG4gICAgKDAsIHNlbGVjdGlvbl8xLlNldE9uU2VsZWN0aW9uSXRlbUFkZGVkKSgoaXRlbSkgPT4ge1xyXG4gICAgfSk7XHJcbiAgICAoMCwgc2VsZWN0aW9uXzEuU2V0T25TZWxlY3Rpb25JdGVtUmVtb3ZlZCkoKGl0ZW0pID0+IHtcclxuICAgICAgICBpZiAoaXRlbS5yZW1vdmVkKSB7XHJcbiAgICAgICAgICAgIFJlbW92ZUZsb3dzKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuRW5hYmxlID0gRW5hYmxlO1xyXG5mdW5jdGlvbiBEaXNhYmxlKCkge1xyXG4gICAgaWYgKHVwZGF0ZUZsb3dJbnRlcnZhbElkICE9PSAtMSkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodXBkYXRlRmxvd0ludGVydmFsSWQpO1xyXG4gICAgfVxyXG4gICAgaWYgKHVwZGF0ZUZyYW1lSW50ZXJ2YWxJZCAhPT0gLTEpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHVwZGF0ZUZyYW1lSW50ZXJ2YWxJZCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5EaXNhYmxlID0gRGlzYWJsZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5VcGRhdGVTZWxlY3Rpb24gPSBleHBvcnRzLkdldFNlbGVjdGlvbiA9IGV4cG9ydHMuU2V0T25TZWxlY3Rpb25JdGVtUmVtb3ZlZCA9IGV4cG9ydHMuU2V0T25TZWxlY3Rpb25JdGVtQWRkZWQgPSBleHBvcnRzLlNldE9uU2VsZWN0aW9uQ2hhbmdlZCA9IHZvaWQgMDtcclxubGV0IGxhc3RTZWxlY3Rpb24gPSBbXTtcclxubGV0IE9uU2VsZWN0aW9uQ2hhbmdlZDtcclxubGV0IE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQ7XHJcbmxldCBPblNlbGVjdGlvbkl0ZW1BZGRlZDtcclxuZnVuY3Rpb24gVXBkYXRlU2VsZWN0aW9uKCkge1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xyXG4gICAgY29uc3QgbGFzdFNlbGVjdGlvbkxlbmd0aCA9IGxhc3RTZWxlY3Rpb24ubGVuZ3RoO1xyXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgLy9yZW1vdmVkXHJcbiAgICBpZiAobGFzdFNlbGVjdGlvbi5sZW5ndGggPiBzZWxlY3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgbGFzdFNlbGVjdGlvbi5mb3JFYWNoKCh4LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gc2VsZWN0aW9uLmZpbmQoKHksIGkyKSA9PiB7IHJldHVybiB4LmlkID09PSB5LmlkOyB9KTtcclxuICAgICAgICAgICAgaWYgKGZvdW5kICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVzdWx0LmZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgICAgIE9uU2VsZWN0aW9uSXRlbVJlbW92ZWQoeCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGFzdFNlbGVjdGlvbiA9IHJlc3VsdDtcclxuICAgIH1cclxuICAgIC8vYWRkZWRcclxuICAgIGVsc2UgaWYgKGxhc3RTZWxlY3Rpb24ubGVuZ3RoIDwgc2VsZWN0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgIHNlbGVjdGlvbi5mb3JFYWNoKCh4LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gbGFzdFNlbGVjdGlvbi5maW5kKCh5LCBpMikgPT4geyByZXR1cm4geC5pZCA9PT0geS5pZDsgfSk7XHJcbiAgICAgICAgICAgIGlmIChmb3VuZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0U2VsZWN0aW9uLnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICBPblNlbGVjdGlvbkl0ZW1BZGRlZCh4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy9idWdcclxuICAgIGVsc2Uge1xyXG4gICAgfVxyXG4gICAgaWYgKGxhc3RTZWxlY3Rpb25MZW5ndGggPT09IDEgJiYgbGFzdFNlbGVjdGlvbi5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICBPblNlbGVjdGlvbkNoYW5nZWQobGFzdFNlbGVjdGlvbik7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5VcGRhdGVTZWxlY3Rpb24gPSBVcGRhdGVTZWxlY3Rpb247XHJcbmZ1bmN0aW9uIEdldFNlbGVjdGlvbigpIHtcclxuICAgIHJldHVybiBsYXN0U2VsZWN0aW9uO1xyXG59XHJcbmV4cG9ydHMuR2V0U2VsZWN0aW9uID0gR2V0U2VsZWN0aW9uO1xyXG5mdW5jdGlvbiBTZXRPblNlbGVjdGlvbkl0ZW1SZW1vdmVkKGNhbGxiYWNrKSB7XHJcbiAgICBPblNlbGVjdGlvbkl0ZW1SZW1vdmVkID0gY2FsbGJhY2s7XHJcbn1cclxuZXhwb3J0cy5TZXRPblNlbGVjdGlvbkl0ZW1SZW1vdmVkID0gU2V0T25TZWxlY3Rpb25JdGVtUmVtb3ZlZDtcclxuZnVuY3Rpb24gU2V0T25TZWxlY3Rpb25JdGVtQWRkZWQoY2FsbGJhY2spIHtcclxuICAgIE9uU2VsZWN0aW9uSXRlbUFkZGVkID0gY2FsbGJhY2s7XHJcbn1cclxuZXhwb3J0cy5TZXRPblNlbGVjdGlvbkl0ZW1BZGRlZCA9IFNldE9uU2VsZWN0aW9uSXRlbUFkZGVkO1xyXG5mdW5jdGlvbiBTZXRPblNlbGVjdGlvbkNoYW5nZWQoY2FsbGJhY2spIHtcclxuICAgIE9uU2VsZWN0aW9uQ2hhbmdlZCA9IGNhbGxiYWNrO1xyXG4gICAgZmlnbWEub24oJ3NlbGVjdGlvbmNoYW5nZScsICgpID0+IHtcclxuICAgICAgICBVcGRhdGVTZWxlY3Rpb24oKTtcclxuICAgICAgICAvLyBzZXRJbnRlcnZhbChVcGRhdGVGbG93LCAyMDApO1xyXG4gICAgICAgIGlmIChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24ubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBpdCBkb2VzbnQgaGF2ZSBhcnJvdyBhdHRhY2hlZFxyXG4gICAgICAgICAgICAvLyBsb2dpYyBpcyB0byBhdHRhY2gvcmVtb3ZlIGZyb20gLTIgdG8gLTFcclxuICAgICAgICAgICAgLy8gMFxyXG4gICAgICAgICAgICAvLyAxXHJcbiAgICAgICAgICAgIC8vIDJcclxuICAgICAgICAgICAgLy8gM1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuU2V0T25TZWxlY3Rpb25DaGFuZ2VkID0gU2V0T25TZWxlY3Rpb25DaGFuZ2VkO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCB2ZWN0b3JfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi92ZWN0b3JcIikpO1xyXG5jbGFzcyBTbmFwUG9pbnQgZXh0ZW5kcyB2ZWN0b3JfMS5kZWZhdWx0IHtcclxuICAgIGNvbnN0cnVjdG9yKHgsIHksIF90eXBlKSB7XHJcbiAgICAgICAgc3VwZXIoeCwgeSk7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IF90eXBlO1xyXG4gICAgfVxyXG59XHJcbi8vICNyZWdpb24gU25hcFBvaW50cyAgXHJcbmZ1bmN0aW9uIEdldFNuYXBQb2ludCh4LCBfdHlwZSkge1xyXG4gICAgbGV0IHJlc3VsdCA9IG5ldyBTbmFwUG9pbnQoMCwgMCwgX3R5cGUpO1xyXG4gICAgY29uc3QgcGkgPSAzLjE0IC8gMTgwO1xyXG4gICAgY29uc3QgcmFkaWFuID0geC5yb3RhdGlvbiAqIHBpO1xyXG4gICAgaWYgKF90eXBlID09PSAndG9wJykge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICB4YCA9IHggKyAodyAvIDIgKiBjb3Mocm90YXRpb24pKVxyXG4gICAgICAgICAgeWAgPSB5IC0gKHcgLyAyICogc2luKHJvdGF0aW9uKSlcclxuICAgICAgICAqL1xyXG4gICAgICAgIHJlc3VsdC54ID0geC54ICsgKHgud2lkdGggKiAwLjUgKiBNYXRoLmNvcyhyYWRpYW4pKTtcclxuICAgICAgICByZXN1bHQueSA9IHgueSAtICh4LndpZHRoICogMC41ICogTWF0aC5zaW4ocmFkaWFuKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoX3R5cGUgPT09ICdyaWdodCcpIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgeGAgPSB4ICsgKHcgKiBjb3Mocm90YXRpb24pKSArIChoLzIgKiBzaW4ocm90YXRpb24pKVxyXG4gICAgICAgICAgeWAgPSB5ICsgKGgvMiAqIGNvcyhyb3RhdGlvbikpIC0gKHcgKiBzaW4ocm90YXRpb24pKVxyXG4gICAgICAgICovXHJcbiAgICAgICAgcmVzdWx0LnggPSB4LnggKyAoeC53aWR0aCAqIE1hdGguY29zKHJhZGlhbikpICsgKHguaGVpZ2h0ICogMC41ICogTWF0aC5zaW4ocmFkaWFuKSk7XHJcbiAgICAgICAgcmVzdWx0LnkgPSB4LnkgKyAoeC5oZWlnaHQgKiAwLjUgKiBNYXRoLmNvcyhyYWRpYW4pKSAtICh4LndpZHRoICogTWF0aC5zaW4ocmFkaWFuKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoX3R5cGUgPT09ICdib3R0b20nKSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgIHhgID0geCArICh3LzIgKiBjb3Mocm90YXRpb24pKSArIChoICogc2luKHJvdGF0aW9uKSlcclxuICAgICAgICAgIHlgID0geSAtICh3LzIgKiBzaW4ocm90YXRpb24pKSArIChoICogY29zKHJvdGF0aW9uKSlcclxuICAgICAgICAqL1xyXG4gICAgICAgIHJlc3VsdC54ID0geC54ICsgKHgud2lkdGggKiAwLjUgKiBNYXRoLmNvcyhyYWRpYW4pKSArICh4LmhlaWdodCAqIE1hdGguc2luKHJhZGlhbikpO1xyXG4gICAgICAgIHJlc3VsdC55ID0geC55ICsgKHguaGVpZ2h0ICogTWF0aC5jb3MocmFkaWFuKSkgLSAoeC53aWR0aCAqIDAuNSAqIE1hdGguc2luKHJhZGlhbikpO1xyXG4gICAgfVxyXG4gICAgaWYgKF90eXBlID09PSAnbGVmdCcpIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgeGAgPSB4ICsgKGgvMiAqIHNpbihyb3RhdGlvbikpXHJcbiAgICAgICAgICB5YCA9IHkgKyAoaC8yICogY29zKHJvdGF0aW9uKSlcclxuICAgICAgICAqL1xyXG4gICAgICAgIHJlc3VsdC54ID0geC54ICsgKHguaGVpZ2h0ICogMC41ICogTWF0aC5zaW4ocmFkaWFuKSk7XHJcbiAgICAgICAgcmVzdWx0LnkgPSB4LnkgKyAoeC5oZWlnaHQgKiAwLjUgKiBNYXRoLmNvcyhyYWRpYW4pKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gR2V0U25hcFBvaW50QnlJZCh4LCBpZCkge1xyXG4gICAgcmV0dXJuIEdldFNuYXBQb2ludCh4LCBpZCA9PT0gMCA/ICd0b3AnXHJcbiAgICAgICAgOiBpZCA9PT0gMSA/ICdyaWdodCdcclxuICAgICAgICAgICAgOiBpZCA9PT0gMiA/ICdib3R0b20nIDogJ2xlZnQnKTtcclxufVxyXG5mdW5jdGlvbiBHZXRDbG9zZXN0U25hcFBvaW50cyhmcm9tLCB0bykge1xyXG4gICAgLypcclxuICAgICAgbyAtIGxvY2F0aW9uIC8gc25hcHBvaW50XHJcbiAgICAgIHggLSBzbmFwcG9pbnRcclxuICAgICAgKyAtIGFuZ2xlXHJcbiAgICAgIC1cclxuICAgICAgICBvLS0tLS14LS0tLS0rXHJcbiAgICAgICAgfCAgICAgICAgICAgfFxyXG4gICAgICAgIHggICAgICAgICAgIHhcclxuICAgICAgICB8ICAgICAgICAgICB8XHJcbiAgICAgICAgKy0tLS0teC0tLS0tK1xyXG4gICAgICAgICAgICAgICAgICAgICAgK1xyXG4gICAgKi9cclxuICAgIGNvbnN0IHJlc3VsdCA9IFtcclxuICAgICAgICBHZXRTbmFwUG9pbnRCeUlkKGZyb20sIDApLFxyXG4gICAgICAgIEdldFNuYXBQb2ludEJ5SWQodG8sIDApLFxyXG4gICAgXTtcclxuICAgIGxldCBsYXN0RGlzdGFuY2UgPSA5OTk5OTk5OTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgczEgPSBHZXRTbmFwUG9pbnRCeUlkKGZyb20sIGkpO1xyXG4gICAgICAgIGZvciAobGV0IGkyID0gMDsgaTIgPCA0OyBpMisrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHMyID0gR2V0U25hcFBvaW50QnlJZCh0bywgaTIpO1xyXG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHMxLmRpc3QoczIpO1xyXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCBsYXN0RGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFswXSA9IHMxO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0WzFdID0gczI7XHJcbiAgICAgICAgICAgICAgICBsYXN0RGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0geyBHZXRTbmFwUG9pbnQsIEdldFNuYXBQb2ludEJ5SWQsIEdldENsb3Nlc3RTbmFwUG9pbnRzIH07XHJcbi8vICNlbmRyZWdpb25cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLy8gI3JlZ2lvbiBWZWN0b3JcclxuY2xhc3MgVmVjdG9yMkQge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSkge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxuICAgIGRpc3QodG8pIHtcclxuICAgICAgICBjb25zdCB4ZCA9IHRoaXMueCAtIHRvLng7XHJcbiAgICAgICAgY29uc3QgeWQgPSB0aGlzLnkgLSB0by55O1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeGQgKiB4ZCArIHlkICogeWQpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFZlY3RvcjJEO1xyXG4vLyAjZW5kcmVnaW9uXHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jb2RlLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9