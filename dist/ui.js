/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*******************!*\
  !*** ./src/ui.ts ***!
  \*******************/
/* eslint-disable no-restricted-globals */
window.onload = () => {
    /*
   <input id="itemflow-strokeWeight" type="number" label="Stroke" value="8">
      <input id="itemflow-dashPattern" type="number" label="Stroke" value="0">
      <input id="itemflow-strokeCap0" type="text" label="StrokeCap Begin" value="NONE">
      <input id="itemflow-strokeCap1" type="text" label="Stroke" value="NONE">
    */
    document.getElementById('itemflow-strokeWeight').onchange = () => {
        const { value } = document.getElementById('itemflow-strokeWeight');
        parent.postMessage({ pluginmessage: { type: 'set-stroke-weight', value } }, '*');
    };
    document.getElementById('itemflow-dashPattern').onchange = () => {
        const { value } = document.getElementById('itemflow-dashPattern');
        parent.postMessage({ pluginmessage: { type: 'set-dash-pattern', value } }, '*');
    };
    document.getElementById('itemflow-strokeCap0').onchange = () => {
        const value0 = document.getElementById('itemflow-strokeCap0').value;
        const value1 = document.getElementById('itemflow-strokeCap1').value;
        parent.postMessage({ pluginmessage: { type: 'set-stroke-cap', value: [value0, value1] } }, '*');
    };
    document.getElementById('itemflow-strokeCap1').onchange = () => {
        const value0 = document.getElementById('itemflow-strokeCap0').value;
        const value1 = document.getElementById('itemflow-strokeCap1').value;
        parent.postMessage({ pluginmessage: { type: 'set-stroke-cap', value: [value0, value1] } }, '*');
    };
};

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWkuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsUUFBUTtBQUN4Qiw2QkFBNkIsaUJBQWlCLG9DQUFvQztBQUNsRjtBQUNBO0FBQ0EsZ0JBQWdCLFFBQVE7QUFDeEIsNkJBQTZCLGlCQUFpQixtQ0FBbUM7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsaUJBQWlCLG1EQUFtRDtBQUNqRztBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixpQkFBaUIsbURBQW1EO0FBQ2pHO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9JdGVtRmxvdy8uL3NyYy91aS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1yZXN0cmljdGVkLWdsb2JhbHMgKi9cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgIC8qXHJcbiAgIDxpbnB1dCBpZD1cIml0ZW1mbG93LXN0cm9rZVdlaWdodFwiIHR5cGU9XCJudW1iZXJcIiBsYWJlbD1cIlN0cm9rZVwiIHZhbHVlPVwiOFwiPlxyXG4gICAgICA8aW5wdXQgaWQ9XCJpdGVtZmxvdy1kYXNoUGF0dGVyblwiIHR5cGU9XCJudW1iZXJcIiBsYWJlbD1cIlN0cm9rZVwiIHZhbHVlPVwiMFwiPlxyXG4gICAgICA8aW5wdXQgaWQ9XCJpdGVtZmxvdy1zdHJva2VDYXAwXCIgdHlwZT1cInRleHRcIiBsYWJlbD1cIlN0cm9rZUNhcCBCZWdpblwiIHZhbHVlPVwiTk9ORVwiPlxyXG4gICAgICA8aW5wdXQgaWQ9XCJpdGVtZmxvdy1zdHJva2VDYXAxXCIgdHlwZT1cInRleHRcIiBsYWJlbD1cIlN0cm9rZVwiIHZhbHVlPVwiTk9ORVwiPlxyXG4gICAgKi9cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtZmxvdy1zdHJva2VXZWlnaHQnKS5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IHZhbHVlIH0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctc3Ryb2tlV2VpZ2h0Jyk7XHJcbiAgICAgICAgcGFyZW50LnBvc3RNZXNzYWdlKHsgcGx1Z2lubWVzc2FnZTogeyB0eXBlOiAnc2V0LXN0cm9rZS13ZWlnaHQnLCB2YWx1ZSB9IH0sICcqJyk7XHJcbiAgICB9O1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1mbG93LWRhc2hQYXR0ZXJuJykub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyB2YWx1ZSB9ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1mbG93LWRhc2hQYXR0ZXJuJyk7XHJcbiAgICAgICAgcGFyZW50LnBvc3RNZXNzYWdlKHsgcGx1Z2lubWVzc2FnZTogeyB0eXBlOiAnc2V0LWRhc2gtcGF0dGVybicsIHZhbHVlIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctc3Ryb2tlQ2FwMCcpLm9uY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlMCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtZmxvdy1zdHJva2VDYXAwJykudmFsdWU7XHJcbiAgICAgICAgY29uc3QgdmFsdWUxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1mbG93LXN0cm9rZUNhcDEnKS52YWx1ZTtcclxuICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5tZXNzYWdlOiB7IHR5cGU6ICdzZXQtc3Ryb2tlLWNhcCcsIHZhbHVlOiBbdmFsdWUwLCB2YWx1ZTFdIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctc3Ryb2tlQ2FwMScpLm9uY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlMCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtZmxvdy1zdHJva2VDYXAwJykudmFsdWU7XHJcbiAgICAgICAgY29uc3QgdmFsdWUxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1mbG93LXN0cm9rZUNhcDEnKS52YWx1ZTtcclxuICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5tZXNzYWdlOiB7IHR5cGU6ICdzZXQtc3Ryb2tlLWNhcCcsIHZhbHVlOiBbdmFsdWUwLCB2YWx1ZTFdIH0gfSwgJyonKTtcclxuICAgIH07XHJcbn07XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==