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
    const types: Array<{ id: StrokeCap, icon: string }> = [
      { id: 'NONE', icon: lineIcon },
      { id: 'ARROW_EQUILATERAL', icon: arrowLeftIcon },
    ];
    const _this = document.getElementById('strokecap0-switch');
    const type = _this.getAttribute('capType') as StrokeCap;
    const id = types.findIndex((x) => x.id === type);
    const nextId = id + 1 >= types.length ? 0 : id + 1;
    _this.setAttribute('capType', types[nextId].id);
    _this.innerHTML = types[nextId].icon;
    const value: Array<StrokeCap | null> = [types[nextId].id, null];
    parent.postMessage({ pluginMessage: { type: 'set-stroke-cap', value } }, '*');
  };
  strokeCap1.onclick = () => {
    const types: Array<{ id: StrokeCap, icon: string }> = [
      { id: 'NONE', icon: lineIcon },
      { id: 'ARROW_EQUILATERAL', icon: arrowRightIcon },
    ];
    const _this = document.getElementById('strokecap1-switch');
    const type = _this.getAttribute('capType') as StrokeCap;
    const id = types.findIndex((x) => x.id === type);
    const nextId = id + 1 >= types.length ? 0 : id + 1;
    _this.setAttribute('capType', types[nextId].id);
    _this.innerHTML = types[nextId].icon;
    const value: Array<StrokeCap | null> = [null, types[nextId].id];
    parent.postMessage({ pluginMessage: { type: 'set-stroke-cap', value } }, '*');
  };
  document.getElementById('bezier-switch').setAttribute('checked', 'true');
  document.getElementById('bezier-switch').onclick = () => {
    const _this = document.getElementById('bezier-switch');
    const hasAttr = _this.hasAttribute('checked');
    if (hasAttr) {
      _this.removeAttribute('checked');
    } else {
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
    } else {
      _this.setAttribute('checked', 'true');
    }
    parent.postMessage({ pluginMessage: { type: 'set-enabled', value: !hasAttr } }, '*');
  };
  document.getElementById('update-switch').setAttribute('checked', 'true');
  document.getElementById('update-switch').onclick = () => {
    const _this = document.getElementById('update-switch');
    const hasAttr = _this.hasAttribute('checked');
    if (hasAttr) {
      _this.removeAttribute('checked');
    } else {
      _this.setAttribute('checked', 'true');
    }
    parent.postMessage({ pluginMessage: { type: 'set-update', value: !hasAttr } }, '*');
  };
  document.getElementById('lock-switch').setAttribute('checked', 'true');
  document.getElementById('lock-switch').onclick = () => {
    const _this = document.getElementById('lock-switch');
    const hasAttr = _this.hasAttribute('checked');
    if (hasAttr) {
      _this.removeAttribute('checked');
    } else {
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
      (document.getElementById('stroke-color-hex') as HTMLInputElement).value = color;
      (document.getElementById('stroke-color') as HTMLInputElement).value = color;
      parent.postMessage({ pluginMessage: { type: 'set-color', value: color } }, '*');
    };
  }
  document.getElementById('stroke-opacity').onchange = () => {
    const _this = document.getElementById('stroke-opacity') as HTMLInputElement;
    const value = _this.value.replace('%', '');
    let parsed = 0;
    parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      if (parsed > 100) parsed = 100;
      if (parsed < 0) parsed = 0;
      _this.value = `${parsed.toFixed(0)}%`;
    } else {
      parsed = 100;
      _this.value = '100%';
    }
    parent.postMessage({ pluginMessage: { type: 'set-color-opacity', value: parsed / 100 } }, '*');
  };
  document.getElementById('stroke-color').onchange = () => {
    const { value } = document.getElementById('stroke-color') as HTMLInputElement;
    for (let it = 1; it < 6; it++) {
      const _this = document.getElementById(`stroke-color-${it}`);
      const color = _this.getAttribute('color');
      if (value === color) {
        _this.setAttribute('checked', 'true');
      } else {
        _this.removeAttribute('checked');
      }
    }
    (document.getElementById('stroke-color-hex') as HTMLInputElement).value = value;
    parent.postMessage({ pluginMessage: { type: 'set-color', value } }, '*');
  };
  document.getElementById('stroke-color-hex').onchange = () => {
    const _this = document.getElementById('stroke-color-hex') as HTMLInputElement;
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
          if (rHex.length === 1) rHex += '0';
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
          if (rHex.length === 1) rHex += '0';
          if (bHex.length === 1) bHex += '0';

          return `#${rHex}${bHex}${bHex}`;
        }
      }
      // #1010 -> #1010 -> #101000
      else if (value.length === 5) {
        const R = getColor(1, value);
        const G = getColor(3, value);
        if (!isNaN(R) && !isNaN(G)) {
          let rHex = R.toString(16).toUpperCase();
          if (rHex.length === 1) rHex += '0';
          let gHex = G.toString(16).toUpperCase();
          if (gHex.length === 1) gHex += '0';
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
          if (rHex.length === 1) rHex += '0';
          let gHex = G.toString(16).toUpperCase();
          if (gHex.length === 1) gHex += '0';
          let bHex = B.toString(16).toUpperCase();
          if (bHex.length === 1) bHex += '0';
          return `#${rHex}${gHex}${bHex}`;
        }
      }
      return '#000000';
    };
    _this.value = getRGBHex(_this.value);
    const colorPicker = document.getElementById('stroke-color') as HTMLInputElement;
    if (colorPicker.value !== _this.value) {
      colorPicker.value = _this.value;
    }
    parent.postMessage({ pluginMessage: { type: 'set-color', value: _this.value } }, '*');
  };
  document.getElementById('stroke-weight').onchange = () => {
    const _this = document.getElementById('stroke-weight') as HTMLInputElement;
    if (_this.value.length === 0) {
      _this.value = '1';
    }
    parent.postMessage({ pluginMessage: { type: 'set-stroke-weight', value: parseInt(_this.value, 10) } }, '*');
  };
  document.getElementById('dash-pattern').onchange = () => {
    const _this = document.getElementById('dash-pattern') as HTMLInputElement;
    if (_this.value.length === 0) {
      _this.value = '0';
    }
    parent.postMessage({ pluginMessage: { type: 'set-dash-pattern', value: parseInt(_this.value, 10) } }, '*');
  };
  document.getElementById('dash-pattern-switch').onclick = () => {
    const _this = document.getElementById('dash-pattern-switch');
    const input = document.getElementById('dash-pattern') as HTMLInputElement;
    const hasAttr = _this.hasAttribute('value');
    if (hasAttr) {
      console.log('hasAttr');
      const attr = _this.getAttribute('value');
      if (input.value === '0') {
        input.value = attr;
      } else if (input.value === attr) {
        input.value = '0';
      } else {
        _this.setAttribute('value', input.value);
        input.value = '0';
      }
    } else if (input.value !== '0') {
      _this.setAttribute('value', input.value);
      input.value = '0';
    }
    parent.postMessage({ pluginMessage: { type: 'set-dash-pattern', value: parseInt(input.value, 10) } }, '*');
  };
  document.getElementById('github-link').onclick = () => {
    window.open('https://github.com/AgitoReiKen/figma-itemflow');
  };
};
