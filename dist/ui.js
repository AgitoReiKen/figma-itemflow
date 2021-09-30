/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*******************!*\
  !*** ./src/ui.ts ***!
  \*******************/
/* eslint-disable no-restricted-globals */
window.onload = () => {
    document.getElementById('itemflow-stroke').onchange = () => {
        const { value } = document.getElementById('stroke');
        parent.postMessage({ pluginmessage: { type: 'set-stroke', value } }, '*');
    };
    document.getElementById('itemflow-cancel').onclick = () => {
        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
    };
    document.getElementById('itemflow-test').onclick = () => {
        parent.postMessage({ pluginMessage: { type: 'test' } }, '*');
    };
};

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWkuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsUUFBUTtBQUN4Qiw2QkFBNkIsaUJBQWlCLDZCQUE2QjtBQUMzRTtBQUNBO0FBQ0EsNkJBQTZCLGlCQUFpQixrQkFBa0I7QUFDaEU7QUFDQTtBQUNBLDZCQUE2QixpQkFBaUIsZ0JBQWdCO0FBQzlEO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9JdGVtRmxvdy8uL3NyYy91aS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1yZXN0cmljdGVkLWdsb2JhbHMgKi9cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtZmxvdy1zdHJva2UnKS5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IHZhbHVlIH0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Ryb2tlJyk7XHJcbiAgICAgICAgcGFyZW50LnBvc3RNZXNzYWdlKHsgcGx1Z2lubWVzc2FnZTogeyB0eXBlOiAnc2V0LXN0cm9rZScsIHZhbHVlIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctY2FuY2VsJykub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiB7IHR5cGU6ICdjYW5jZWwnIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbWZsb3ctdGVzdCcpLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgcGFyZW50LnBvc3RNZXNzYWdlKHsgcGx1Z2luTWVzc2FnZTogeyB0eXBlOiAndGVzdCcgfSB9LCAnKicpO1xyXG4gICAgfTtcclxufTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9