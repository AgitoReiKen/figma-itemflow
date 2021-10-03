/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*******************!*\
  !*** ./src/ui.ts ***!
  \*******************/
/* eslint-disable brace-style */
/* eslint-disable no-restricted-globals */
window.onload = () => {
    const arrowLeftIcon = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12L10 6V18L2 12Z" fill="currentColor"></path>
            <line x1="10" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="4"></line>
            </svg>
        `;
    const lineIcon = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="4"></line>
            </svg>
        `;
    const arrowRightIcon = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12L14 18L14 6L22 12Z" fill="currentColor"></path>
            <line x1="14" y1="12" x2="2" y2="12" stroke="currentColor" stroke-width="4"></line>
            </svg>
        `;
    const strokeCap0 = document.getElementById('strokecap0-switch');
    const strokeCap1 = document.getElementById('strokecap1-switch');
    strokeCap0.setAttribute('capType', 'NONE');
    strokeCap0.innerHTML = lineIcon;
    strokeCap1.setAttribute('capType', 'ARROW_EQUILATERAL');
    strokeCap1.innerHTML = arrowRightIcon;
    strokeCap0.onclick = () => {
        const types = [
            { id: 'NONE', icon: lineIcon },
            { id: 'ARROW_EQUILATERAL', icon: arrowLeftIcon },
        ];
        const _this = document.getElementById('strokecap0-switch');
        const type = _this.getAttribute('capType');
        const id = types.findIndex((x) => x.id === type);
        const nextId = id + 1 >= types.length ? 0 : id + 1;
        _this.setAttribute('capType', types[nextId].id);
        _this.innerHTML = types[nextId].icon;
        const value = [types[nextId].id, null];
        parent.postMessage({ pluginMessage: { type: 'set-stroke-cap', value } }, '*');
    };
    strokeCap1.onclick = () => {
        const types = [
            { id: 'NONE', icon: lineIcon },
            { id: 'ARROW_EQUILATERAL', icon: arrowRightIcon },
        ];
        const _this = document.getElementById('strokecap1-switch');
        const type = _this.getAttribute('capType');
        const id = types.findIndex((x) => x.id === type);
        const nextId = id + 1 >= types.length ? 0 : id + 1;
        _this.setAttribute('capType', types[nextId].id);
        _this.innerHTML = types[nextId].icon;
        const value = [null, types[nextId].id];
        parent.postMessage({ pluginMessage: { type: 'set-stroke-cap', value } }, '*');
    };
    document.getElementById('bezier-switch').setAttribute('checked', 'true');
    document.getElementById('bezier-switch').onclick = () => {
        const _this = document.getElementById('bezier-switch');
        const hasAttr = _this.hasAttribute('checked');
        if (hasAttr) {
            _this.removeAttribute('checked');
        }
        else {
            _this.setAttribute('checked', 'true');
        }
        parent.postMessage({ pluginMessage: { type: 'set-bezier', value: !hasAttr } }, '*');
    };
    document.getElementById('enable-switch').setAttribute('checked', 'true');
    document.getElementById('enable-switch').onclick = () => {
        const _this = document.getElementById('enable-switch');
        const hasAttr = _this.hasAttribute('checked');
        if (hasAttr) {
            _this.removeAttribute('checked');
        }
        else {
            _this.setAttribute('checked', 'true');
        }
        parent.postMessage({ pluginMessage: { type: 'set-enabled', value: !hasAttr } }, '*');
    };
    document.getElementById('lock-switch').setAttribute('checked', 'true');
    document.getElementById('lock-switch').onclick = () => {
        const _this = document.getElementById('lock-switch');
        const hasAttr = _this.hasAttribute('checked');
        if (hasAttr) {
            _this.removeAttribute('checked');
        }
        else {
            _this.setAttribute('checked', 'true');
        }
        parent.postMessage({ pluginMessage: { type: 'set-framelocked', value: !hasAttr } }, '*');
    };
    for (let it = 1; it < 6; it++) {
        document.getElementById(`stroke-color-${it}`).onclick = () => {
            const _this = document.getElementById(`stroke-color-${it}`);
            const color = _this.getAttribute('color');
            const disableOthers = function disableOthers() {
                for (let i = 1; i < 6; i++) {
                    const __this = document.getElementById(`stroke-color-${it}`);
                    const _color = __this.getAttribute('color');
                    if (color !== _color) {
                        _this.removeAttribute('checked');
                    }
                }
            };
            disableOthers();
            _this.setAttribute('checked', 'true');
            document.getElementById('stroke-color-hex').value = color;
            document.getElementById('stroke-color').value = color;
            parent.postMessage({ pluginMessage: { type: 'set-color', value: color } }, '*');
        };
    }
    document.getElementById('stroke-opacity').onchange = () => {
        const _this = document.getElementById('stroke-opacity');
        const value = _this.value.replace('%', '');
        let parsed = 0;
        parsed = parseFloat(value);
        if (!isNaN(parsed)) {
            if (parsed > 100)
                parsed = 100;
            if (parsed < 0)
                parsed = 0;
            _this.value = `${parsed.toFixed(0)}%`;
        }
        else {
            parsed = 100;
            _this.value = '100%';
        }
        parent.postMessage({ pluginMessage: { type: 'set-color-opacity', value: parsed / 100 } }, '*');
    };
    document.getElementById('stroke-color').onchange = () => {
        const { value } = document.getElementById('stroke-color');
        for (let it = 1; it < 6; it++) {
            const _this = document.getElementById(`stroke-color-${it}`);
            const color = _this.getAttribute('color');
            if (value === color) {
                _this.setAttribute('checked', 'true');
            }
            else {
                _this.removeAttribute('checked');
            }
        }
        document.getElementById('stroke-color-hex').value = value;
        parent.postMessage({ pluginMessage: { type: 'set-color', value } }, '*');
    };
    document.getElementById('stroke-color-hex').onchange = () => {
        const _this = document.getElementById('stroke-color-hex');
        const getRGBHex = function getRGBHex(value) {
            const getColor = function getColor(pos, val, len = 2) {
                return parseInt((val).substr(pos, len), 16);
            };
            if (!value.startsWith('#')) {
                value = `#${value}`;
            }
            // 0 -> #0 -> #000000
            if (value.length === 2) {
                const A = parseInt(value.substr(1, 1), 16);
                if (!isNaN(A)) {
                    let result = '#';
                    const hexA = A.toString(16).toUpperCase();
                    for (let i = 0; i < 6; i++) {
                        result += hexA;
                    }
                    return result;
                }
            }
            // 01 -> #01 -> #010101
            if (value.length === 3) {
                const R = getColor(1, value);
                if (!isNaN(R)) {
                    let rHex = R.toString(16).toUpperCase();
                    if (rHex.length === 1)
                        rHex += '0';
                    return `#${rHex}${rHex}${rHex}`;
                }
            }
            // 01 -> #FF1 -> #FF1010
            if (value.length === 4) {
                const R = getColor(1, value);
                const B = getColor(3, value, 1);
                if (!isNaN(R) && !isNaN(B)) {
                    let rHex = R.toString(16).toUpperCase();
                    let bHex = B.toString(16).toUpperCase();
                    if (rHex.length === 1)
                        rHex += '0';
                    if (bHex.length === 1)
                        bHex += '0';
                    return `#${rHex}${bHex}${bHex}`;
                }
            }
            // #1010 -> #1010 -> #101000
            else if (value.length === 5) {
                const R = getColor(1, value);
                const G = getColor(3, value);
                if (!isNaN(R) && !isNaN(G)) {
                    let rHex = R.toString(16).toUpperCase();
                    if (rHex.length === 1)
                        rHex += '0';
                    let gHex = G.toString(16).toUpperCase();
                    if (gHex.length === 1)
                        gHex += '0';
                    return `#${rHex}${gHex}00`;
                }
            }
            // #101010
            else if (value.length >= 6) {
                const R = getColor(1, value);
                const G = getColor(3, value);
                const B = getColor(5, value);
                if (!isNaN(R) && !isNaN(G) && !isNaN(B)) {
                    let rHex = R.toString(16).toUpperCase();
                    if (rHex.length === 1)
                        rHex += '0';
                    let gHex = G.toString(16).toUpperCase();
                    if (gHex.length === 1)
                        gHex += '0';
                    let bHex = B.toString(16).toUpperCase();
                    if (bHex.length === 1)
                        bHex += '0';
                    return `#${rHex}${gHex}${bHex}`;
                }
            }
            return '#000000';
        };
        _this.value = getRGBHex(_this.value);
        const colorPicker = document.getElementById('stroke-color');
        if (colorPicker.value !== _this.value) {
            colorPicker.value = _this.value;
        }
        parent.postMessage({ pluginMessage: { type: 'set-color', value: _this.value } }, '*');
    };
    document.getElementById('stroke-weight').onchange = () => {
        const _this = document.getElementById('stroke-weight');
        if (_this.value.length === 0) {
            _this.value = '1';
        }
        parent.postMessage({ pluginMessage: { type: 'set-stroke-weight', value: parseInt(_this.value, 10) } }, '*');
    };
    document.getElementById('dash-pattern').onchange = () => {
        const _this = document.getElementById('dash-pattern');
        if (_this.value.length === 0) {
            _this.value = '0';
        }
        parent.postMessage({ pluginMessage: { type: 'set-dash-pattern', value: parseInt(_this.value, 10) } }, '*');
    };
    document.getElementById('github-link').onclick = () => {
        window.open('https://github.com/AgitoReiKen/figma-itemflow');
    };
};

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LGlCQUFpQiw4REFBOEQ7QUFDNUc7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2l0ZW1mbG93LWZpZ21hLy4vc3JjL3VpLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIGJyYWNlLXN0eWxlICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAqL1xyXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYXJyb3dMZWZ0SWNvbiA9IGBcbiAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0yIDEyTDEwIDZWMThMMiAxMlpcIiBmaWxsPVwiY3VycmVudENvbG9yXCI+PC9wYXRoPlxuICAgICAgICAgICAgPGxpbmUgeDE9XCIxMFwiIHkxPVwiMTJcIiB4Mj1cIjIyXCIgeTI9XCIxMlwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjRcIj48L2xpbmU+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgYDtcclxuICAgIGNvbnN0IGxpbmVJY29uID0gYFxuICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgICAgICA8bGluZSB4MT1cIjJcIiB5MT1cIjEyXCIgeDI9XCIyMlwiIHkyPVwiMTJcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCI0XCI+PC9saW5lPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgIGA7XHJcbiAgICBjb25zdCBhcnJvd1JpZ2h0SWNvbiA9IGBcbiAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0yMiAxMkwxNCAxOEwxNCA2TDIyIDEyWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIj48L3BhdGg+XG4gICAgICAgICAgICA8bGluZSB4MT1cIjE0XCIgeTE9XCIxMlwiIHgyPVwiMlwiIHkyPVwiMTJcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCI0XCI+PC9saW5lPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgIGA7XHJcbiAgICBjb25zdCBzdHJva2VDYXAwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0cm9rZWNhcDAtc3dpdGNoJyk7XHJcbiAgICBjb25zdCBzdHJva2VDYXAxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0cm9rZWNhcDEtc3dpdGNoJyk7XHJcbiAgICBzdHJva2VDYXAwLnNldEF0dHJpYnV0ZSgnY2FwVHlwZScsICdOT05FJyk7XHJcbiAgICBzdHJva2VDYXAwLmlubmVySFRNTCA9IGxpbmVJY29uO1xyXG4gICAgc3Ryb2tlQ2FwMS5zZXRBdHRyaWJ1dGUoJ2NhcFR5cGUnLCAnQVJST1dfRVFVSUxBVEVSQUwnKTtcclxuICAgIHN0cm9rZUNhcDEuaW5uZXJIVE1MID0gYXJyb3dSaWdodEljb247XHJcbiAgICBzdHJva2VDYXAwLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdHlwZXMgPSBbXHJcbiAgICAgICAgICAgIHsgaWQ6ICdOT05FJywgaWNvbjogbGluZUljb24gfSxcclxuICAgICAgICAgICAgeyBpZDogJ0FSUk9XX0VRVUlMQVRFUkFMJywgaWNvbjogYXJyb3dMZWZ0SWNvbiB9LFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgY29uc3QgX3RoaXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Ryb2tlY2FwMC1zd2l0Y2gnKTtcclxuICAgICAgICBjb25zdCB0eXBlID0gX3RoaXMuZ2V0QXR0cmlidXRlKCdjYXBUeXBlJyk7XHJcbiAgICAgICAgY29uc3QgaWQgPSB0eXBlcy5maW5kSW5kZXgoKHgpID0+IHguaWQgPT09IHR5cGUpO1xyXG4gICAgICAgIGNvbnN0IG5leHRJZCA9IGlkICsgMSA+PSB0eXBlcy5sZW5ndGggPyAwIDogaWQgKyAxO1xyXG4gICAgICAgIF90aGlzLnNldEF0dHJpYnV0ZSgnY2FwVHlwZScsIHR5cGVzW25leHRJZF0uaWQpO1xyXG4gICAgICAgIF90aGlzLmlubmVySFRNTCA9IHR5cGVzW25leHRJZF0uaWNvbjtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IFt0eXBlc1tuZXh0SWRdLmlkLCBudWxsXTtcclxuICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiB7IHR5cGU6ICdzZXQtc3Ryb2tlLWNhcCcsIHZhbHVlIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBzdHJva2VDYXAxLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdHlwZXMgPSBbXHJcbiAgICAgICAgICAgIHsgaWQ6ICdOT05FJywgaWNvbjogbGluZUljb24gfSxcclxuICAgICAgICAgICAgeyBpZDogJ0FSUk9XX0VRVUlMQVRFUkFMJywgaWNvbjogYXJyb3dSaWdodEljb24gfSxcclxuICAgICAgICBdO1xyXG4gICAgICAgIGNvbnN0IF90aGlzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0cm9rZWNhcDEtc3dpdGNoJyk7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IF90aGlzLmdldEF0dHJpYnV0ZSgnY2FwVHlwZScpO1xyXG4gICAgICAgIGNvbnN0IGlkID0gdHlwZXMuZmluZEluZGV4KCh4KSA9PiB4LmlkID09PSB0eXBlKTtcclxuICAgICAgICBjb25zdCBuZXh0SWQgPSBpZCArIDEgPj0gdHlwZXMubGVuZ3RoID8gMCA6IGlkICsgMTtcclxuICAgICAgICBfdGhpcy5zZXRBdHRyaWJ1dGUoJ2NhcFR5cGUnLCB0eXBlc1tuZXh0SWRdLmlkKTtcclxuICAgICAgICBfdGhpcy5pbm5lckhUTUwgPSB0eXBlc1tuZXh0SWRdLmljb247XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBbbnVsbCwgdHlwZXNbbmV4dElkXS5pZF07XHJcbiAgICAgICAgcGFyZW50LnBvc3RNZXNzYWdlKHsgcGx1Z2luTWVzc2FnZTogeyB0eXBlOiAnc2V0LXN0cm9rZS1jYXAnLCB2YWx1ZSB9IH0sICcqJyk7XHJcbiAgICB9O1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Jlemllci1zd2l0Y2gnKS5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAndHJ1ZScpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Jlemllci1zd2l0Y2gnKS5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IF90aGlzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Jlemllci1zd2l0Y2gnKTtcclxuICAgICAgICBjb25zdCBoYXNBdHRyID0gX3RoaXMuaGFzQXR0cmlidXRlKCdjaGVja2VkJyk7XHJcbiAgICAgICAgaWYgKGhhc0F0dHIpIHtcclxuICAgICAgICAgICAgX3RoaXMucmVtb3ZlQXR0cmlidXRlKCdjaGVja2VkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBfdGhpcy5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiB7IHR5cGU6ICdzZXQtYmV6aWVyJywgdmFsdWU6ICFoYXNBdHRyIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5hYmxlLXN3aXRjaCcpLnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICd0cnVlJyk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5hYmxlLXN3aXRjaCcpLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgX3RoaXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5hYmxlLXN3aXRjaCcpO1xyXG4gICAgICAgIGNvbnN0IGhhc0F0dHIgPSBfdGhpcy5oYXNBdHRyaWJ1dGUoJ2NoZWNrZWQnKTtcclxuICAgICAgICBpZiAoaGFzQXR0cikge1xyXG4gICAgICAgICAgICBfdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2NoZWNrZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIF90aGlzLnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbk1lc3NhZ2U6IHsgdHlwZTogJ3NldC1lbmFibGVkJywgdmFsdWU6ICFoYXNBdHRyIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9jay1zd2l0Y2gnKS5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAndHJ1ZScpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvY2stc3dpdGNoJykub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBfdGhpcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2NrLXN3aXRjaCcpO1xyXG4gICAgICAgIGNvbnN0IGhhc0F0dHIgPSBfdGhpcy5oYXNBdHRyaWJ1dGUoJ2NoZWNrZWQnKTtcclxuICAgICAgICBpZiAoaGFzQXR0cikge1xyXG4gICAgICAgICAgICBfdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2NoZWNrZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIF90aGlzLnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbk1lc3NhZ2U6IHsgdHlwZTogJ3NldC1mcmFtZWxvY2tlZCcsIHZhbHVlOiAhaGFzQXR0ciB9IH0sICcqJyk7XHJcbiAgICB9O1xyXG4gICAgZm9yIChsZXQgaXQgPSAxOyBpdCA8IDY7IGl0KyspIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgc3Ryb2tlLWNvbG9yLSR7aXR9YCkub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgX3RoaXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgc3Ryb2tlLWNvbG9yLSR7aXR9YCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gX3RoaXMuZ2V0QXR0cmlidXRlKCdjb2xvcicpO1xyXG4gICAgICAgICAgICBjb25zdCBkaXNhYmxlT3RoZXJzID0gZnVuY3Rpb24gZGlzYWJsZU90aGVycygpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgNjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgX190aGlzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHN0cm9rZS1jb2xvci0ke2l0fWApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IF9jb2xvciA9IF9fdGhpcy5nZXRBdHRyaWJ1dGUoJ2NvbG9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yICE9PSBfY29sb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVtb3ZlQXR0cmlidXRlKCdjaGVja2VkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkaXNhYmxlT3RoZXJzKCk7XHJcbiAgICAgICAgICAgIF90aGlzLnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdHJva2UtY29sb3ItaGV4JykudmFsdWUgPSBjb2xvcjtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0cm9rZS1jb2xvcicpLnZhbHVlID0gY29sb3I7XHJcbiAgICAgICAgICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbk1lc3NhZ2U6IHsgdHlwZTogJ3NldC1jb2xvcicsIHZhbHVlOiBjb2xvciB9IH0sICcqJyk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdHJva2Utb3BhY2l0eScpLm9uY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IF90aGlzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0cm9rZS1vcGFjaXR5Jyk7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBfdGhpcy52YWx1ZS5yZXBsYWNlKCclJywgJycpO1xyXG4gICAgICAgIGxldCBwYXJzZWQgPSAwO1xyXG4gICAgICAgIHBhcnNlZCA9IHBhcnNlRmxvYXQodmFsdWUpO1xyXG4gICAgICAgIGlmICghaXNOYU4ocGFyc2VkKSkge1xyXG4gICAgICAgICAgICBpZiAocGFyc2VkID4gMTAwKVxyXG4gICAgICAgICAgICAgICAgcGFyc2VkID0gMTAwO1xyXG4gICAgICAgICAgICBpZiAocGFyc2VkIDwgMClcclxuICAgICAgICAgICAgICAgIHBhcnNlZCA9IDA7XHJcbiAgICAgICAgICAgIF90aGlzLnZhbHVlID0gYCR7cGFyc2VkLnRvRml4ZWQoMCl9JWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwYXJzZWQgPSAxMDA7XHJcbiAgICAgICAgICAgIF90aGlzLnZhbHVlID0gJzEwMCUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiB7IHR5cGU6ICdzZXQtY29sb3Itb3BhY2l0eScsIHZhbHVlOiBwYXJzZWQgLyAxMDAgfSB9LCAnKicpO1xyXG4gICAgfTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdHJva2UtY29sb3InKS5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IHZhbHVlIH0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Ryb2tlLWNvbG9yJyk7XHJcbiAgICAgICAgZm9yIChsZXQgaXQgPSAxOyBpdCA8IDY7IGl0KyspIHtcclxuICAgICAgICAgICAgY29uc3QgX3RoaXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgc3Ryb2tlLWNvbG9yLSR7aXR9YCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gX3RoaXMuZ2V0QXR0cmlidXRlKCdjb2xvcicpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IGNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucmVtb3ZlQXR0cmlidXRlKCdjaGVja2VkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0cm9rZS1jb2xvci1oZXgnKS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbk1lc3NhZ2U6IHsgdHlwZTogJ3NldC1jb2xvcicsIHZhbHVlIH0gfSwgJyonKTtcclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Ryb2tlLWNvbG9yLWhleCcpLm9uY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IF90aGlzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0cm9rZS1jb2xvci1oZXgnKTtcclxuICAgICAgICBjb25zdCBnZXRSR0JIZXggPSBmdW5jdGlvbiBnZXRSR0JIZXgodmFsdWUpIHtcclxuICAgICAgICAgICAgY29uc3QgZ2V0Q29sb3IgPSBmdW5jdGlvbiBnZXRDb2xvcihwb3MsIHZhbCwgbGVuID0gMikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KCh2YWwpLnN1YnN0cihwb3MsIGxlbiksIDE2KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKCF2YWx1ZS5zdGFydHNXaXRoKCcjJykpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gYCMke3ZhbHVlfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gMCAtPiAjMCAtPiAjMDAwMDAwXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IEEgPSBwYXJzZUludCh2YWx1ZS5zdWJzdHIoMSwgMSksIDE2KTtcclxuICAgICAgICAgICAgICAgIGlmICghaXNOYU4oQSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gJyMnO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhleEEgPSBBLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBoZXhBO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIDAxIC0+ICMwMSAtPiAjMDEwMTAxXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IFIgPSBnZXRDb2xvcigxLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKFIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJIZXggPSBSLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChySGV4Lmxlbmd0aCA9PT0gMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgckhleCArPSAnMCc7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAjJHtySGV4fSR7ckhleH0ke3JIZXh9YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAwMSAtPiAjRkYxIC0+ICNGRjEwMTBcclxuICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gNCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgUiA9IGdldENvbG9yKDEsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IEIgPSBnZXRDb2xvcigzLCB2YWx1ZSwgMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKFIpICYmICFpc05hTihCKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBySGV4ID0gUi50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYkhleCA9IEIudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJIZXgubGVuZ3RoID09PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBySGV4ICs9ICcwJztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYkhleC5sZW5ndGggPT09IDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJIZXggKz0gJzAnO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgIyR7ckhleH0ke2JIZXh9JHtiSGV4fWA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gIzEwMTAgLT4gIzEwMTAgLT4gIzEwMTAwMFxyXG4gICAgICAgICAgICBlbHNlIGlmICh2YWx1ZS5sZW5ndGggPT09IDUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IFIgPSBnZXRDb2xvcigxLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBHID0gZ2V0Q29sb3IoMywgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc05hTihSKSAmJiAhaXNOYU4oRykpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgckhleCA9IFIudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJIZXgubGVuZ3RoID09PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBySGV4ICs9ICcwJztcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZ0hleCA9IEcudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdIZXgubGVuZ3RoID09PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnSGV4ICs9ICcwJztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCMke3JIZXh9JHtnSGV4fTAwYDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAjMTAxMDEwXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlLmxlbmd0aCA+PSA2KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBSID0gZ2V0Q29sb3IoMSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgRyA9IGdldENvbG9yKDMsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IEIgPSBnZXRDb2xvcig1LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKFIpICYmICFpc05hTihHKSAmJiAhaXNOYU4oQikpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgckhleCA9IFIudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJIZXgubGVuZ3RoID09PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBySGV4ICs9ICcwJztcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZ0hleCA9IEcudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdIZXgubGVuZ3RoID09PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnSGV4ICs9ICcwJztcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYkhleCA9IEIudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJIZXgubGVuZ3RoID09PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiSGV4ICs9ICcwJztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCMke3JIZXh9JHtnSGV4fSR7YkhleH1gO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAnIzAwMDAwMCc7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBfdGhpcy52YWx1ZSA9IGdldFJHQkhleChfdGhpcy52YWx1ZSk7XHJcbiAgICAgICAgY29uc3QgY29sb3JQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Ryb2tlLWNvbG9yJyk7XHJcbiAgICAgICAgaWYgKGNvbG9yUGlja2VyLnZhbHVlICE9PSBfdGhpcy52YWx1ZSkge1xyXG4gICAgICAgICAgICBjb2xvclBpY2tlci52YWx1ZSA9IF90aGlzLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiB7IHR5cGU6ICdzZXQtY29sb3InLCB2YWx1ZTogX3RoaXMudmFsdWUgfSB9LCAnKicpO1xyXG4gICAgfTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdHJva2Utd2VpZ2h0Jykub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgX3RoaXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Ryb2tlLXdlaWdodCcpO1xyXG4gICAgICAgIGlmIChfdGhpcy52YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgX3RoaXMudmFsdWUgPSAnMSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbk1lc3NhZ2U6IHsgdHlwZTogJ3NldC1zdHJva2Utd2VpZ2h0JywgdmFsdWU6IHBhcnNlSW50KF90aGlzLnZhbHVlLCAxMCkgfSB9LCAnKicpO1xyXG4gICAgfTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXNoLXBhdHRlcm4nKS5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBfdGhpcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXNoLXBhdHRlcm4nKTtcclxuICAgICAgICBpZiAoX3RoaXMudmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnZhbHVlID0gJzAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiB7IHR5cGU6ICdzZXQtZGFzaC1wYXR0ZXJuJywgdmFsdWU6IHBhcnNlSW50KF90aGlzLnZhbHVlLCAxMCkgfSB9LCAnKicpO1xyXG4gICAgfTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnaXRodWItbGluaycpLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93Lm9wZW4oJ2h0dHBzOi8vZ2l0aHViLmNvbS9BZ2l0b1JlaUtlbi9maWdtYS1pdGVtZmxvdycpO1xyXG4gICAgfTtcclxufTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9