/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*******************!*\
  !*** ./src/ui.ts ***!
  \*******************/
/* eslint-disable no-restricted-globals */
window.onload = () => {
    document.getElementById('itemflow-strokeWeight').onchange = () => {
        const { value } = document.getElementById('itemflow-strokeWeight');
        parent.postMessage({ pluginMessage: { type: 'set-stroke-weight', value } }, '*');
    };
    document.getElementById('itemflow-dashPattern').onchange = () => {
        const { value } = document.getElementById('itemflow-dashPattern');
        parent.postMessage({ pluginMessage: { type: 'set-dash-pattern', value } }, '*');
    };
    document.getElementById('itemflow-strokeCap0').onchange = () => {
        const value0 = document.getElementById('itemflow-strokeCap0').value;
        const value1 = document.getElementById('itemflow-strokeCap1').value;
        parent.postMessage({ pluginMessage: { type: 'set-stroke-cap', value: [value0, value1] } }, '*');
    };
    document.getElementById('itemflow-strokeCap1').onchange = () => {
        const value0 = document.getElementById('itemflow-strokeCap0').value;
        const value1 = document.getElementById('itemflow-strokeCap1').value;
        parent.postMessage({ pluginMessage: { type: 'set-stroke-cap', value: [value0, value1] } }, '*');
    };
    document.getElementById('itemflow-color').onchange = () => {
        const value = document.getElementById('itemflow-color').value;
        parent.postMessage({ pluginMessage: { type: 'set-color', value } }, '*');
    };
    document.getElementById('itemflow-colorOpacity').onchange = () => {
        const value = parseInt(document.getElementById('itemflow-colorOpacity').value) / 100;
        parent.postMessage({ pluginMessage: { type: 'set-color-opacity', value: value } }, '*');
    };
    document.getElementById('itemflow-bezier').onchange = () => {
        const value = document.getElementById('itemflow-bezier').checked;
        parent.postMessage({ pluginMessage: { type: 'set-bezier', value: value } }, '*');
    };
    document.getElementById('itemflow-enabled').onchange = () => {
        const value = document.getElementById('itemflow-enabled').checked;
        parent.postMessage({ pluginMessage: { type: 'set-enabled', value: value } }, '*');
    };
    document.getElementById('itemflow-framelocked').onchange = () => {
        const value = document.getElementById('itemflow-framelocked').checked;
        parent.postMessage({ pluginMessage: { type: 'set-framelocked', value: value } }, '*');
    };
};

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWkuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsUUFBUTtBQUN4Qiw2QkFBNkIsaUJBQWlCLG9DQUFvQztBQUNsRjtBQUNBO0FBQ0EsZ0JBQWdCLFFBQVE7QUFDeEIsNkJBQTZCLGlCQUFpQixtQ0FBbUM7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsaUJBQWlCLG1EQUFtRDtBQUNqRztBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixpQkFBaUIsbURBQW1EO0FBQ2pHO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixpQkFBaUIsNEJBQTRCO0FBQzFFO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixpQkFBaUIsMkNBQTJDO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixpQkFBaUIsb0NBQW9DO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixpQkFBaUIscUNBQXFDO0FBQ25GO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixpQkFBaUIseUNBQXlDO0FBQ3ZGO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9JdGVtRmxvdy8uL3NyYy91aS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1yZXN0cmljdGVkLWdsb2JhbHMgKi9cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtZmxvdy1zdHJva2VXZWlnaHQnKS5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IHZhbHVlIH0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctc3Ryb2tlV2VpZ2h0Jyk7XHJcbiAgICAgICAgcGFyZW50LnBvc3RNZXNzYWdlKHsgcGx1Z2luTWVzc2FnZTogeyB0eXBlOiAnc2V0LXN0cm9rZS13ZWlnaHQnLCB2YWx1ZSB9IH0sICcqJyk7XHJcbiAgICB9O1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1mbG93LWRhc2hQYXR0ZXJuJykub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyB2YWx1ZSB9ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1mbG93LWRhc2hQYXR0ZXJuJyk7XHJcbiAgICAgICAgcGFyZW50LnBvc3RNZXNzYWdlKHsgcGx1Z2luTWVzc2FnZTogeyB0eXBlOiAnc2V0LWRhc2gtcGF0dGVybicsIHZhbHVlIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctc3Ryb2tlQ2FwMCcpLm9uY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlMCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtZmxvdy1zdHJva2VDYXAwJykudmFsdWU7XHJcbiAgICAgICAgY29uc3QgdmFsdWUxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1mbG93LXN0cm9rZUNhcDEnKS52YWx1ZTtcclxuICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiB7IHR5cGU6ICdzZXQtc3Ryb2tlLWNhcCcsIHZhbHVlOiBbdmFsdWUwLCB2YWx1ZTFdIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctc3Ryb2tlQ2FwMScpLm9uY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlMCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtZmxvdy1zdHJva2VDYXAwJykudmFsdWU7XHJcbiAgICAgICAgY29uc3QgdmFsdWUxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1mbG93LXN0cm9rZUNhcDEnKS52YWx1ZTtcclxuICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiB7IHR5cGU6ICdzZXQtc3Ryb2tlLWNhcCcsIHZhbHVlOiBbdmFsdWUwLCB2YWx1ZTFdIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctY29sb3InKS5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtZmxvdy1jb2xvcicpLnZhbHVlO1xyXG4gICAgICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbk1lc3NhZ2U6IHsgdHlwZTogJ3NldC1jb2xvcicsIHZhbHVlIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctY29sb3JPcGFjaXR5Jykub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctY29sb3JPcGFjaXR5JykudmFsdWUpIC8gMTAwO1xyXG4gICAgICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbk1lc3NhZ2U6IHsgdHlwZTogJ3NldC1jb2xvci1vcGFjaXR5JywgdmFsdWU6IHZhbHVlIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctYmV6aWVyJykub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctYmV6aWVyJykuY2hlY2tlZDtcclxuICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiB7IHR5cGU6ICdzZXQtYmV6aWVyJywgdmFsdWU6IHZhbHVlIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctZW5hYmxlZCcpLm9uY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1mbG93LWVuYWJsZWQnKS5jaGVja2VkO1xyXG4gICAgICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbk1lc3NhZ2U6IHsgdHlwZTogJ3NldC1lbmFibGVkJywgdmFsdWU6IHZhbHVlIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctZnJhbWVsb2NrZWQnKS5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtZmxvdy1mcmFtZWxvY2tlZCcpLmNoZWNrZWQ7XHJcbiAgICAgICAgcGFyZW50LnBvc3RNZXNzYWdlKHsgcGx1Z2luTWVzc2FnZTogeyB0eXBlOiAnc2V0LWZyYW1lbG9ja2VkJywgdmFsdWU6IHZhbHVlIH0gfSwgJyonKTtcclxuICAgIH07XHJcbn07XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==