/* eslint-disable no-restricted-globals */
window.onload = () => {

  /*
 <input id="itemflow-strokeWeight" type="number" label="Stroke" value="8">
    <input id="itemflow-dashPattern" type="number" label="Stroke" value="0">
    <input id="itemflow-strokeCap0" type="text" label="StrokeCap Begin" value="NONE">
    <input id="itemflow-strokeCap1" type="text" label="Stroke" value="NONE">
  */
  document.getElementById('itemflow-strokeWeight').onchange = () => {
    const { value } = document.getElementById('itemflow-strokeWeight') as HTMLDataElement;
    parent.postMessage({ pluginMessage: { type: 'set-stroke-weight', value } }, '*');
  };
  document.getElementById('itemflow-dashPattern').onchange = () => {
    const { value } = document.getElementById('itemflow-dashPattern') as HTMLDataElement;
    parent.postMessage({ pluginMessage: { type: 'set-dash-pattern', value } }, '*');
  };
  document.getElementById('itemflow-strokeCap0').onchange = () => {
    const value0 = (document.getElementById('itemflow-strokeCap0') as HTMLDataElement).value;
    const value1 = (document.getElementById('itemflow-strokeCap1') as HTMLDataElement).value;
    parent.postMessage({ pluginMessage: { type: 'set-stroke-cap', value: [value0, value1] } }, '*');
  };
  document.getElementById('itemflow-strokeCap1').onchange = () => {
    const value0 = (document.getElementById('itemflow-strokeCap0') as HTMLDataElement).value;
    const value1 = (document.getElementById('itemflow-strokeCap1') as HTMLDataElement).value;
    parent.postMessage({ pluginMessage: { type: 'set-stroke-cap', value: [value0, value1] } }, '*');
  }; 
  document.getElementById('itemflow-color').onchange = () => {
    const value = (document.getElementById('itemflow-color') as HTMLDataElement).value;
    parent.postMessage({ pluginMessage: { type: 'set-color', value } }, '*'); 
  }; 
  document.getElementById('itemflow-colorOpacity').onchange = () => {
    const value = parseInt((document.getElementById('itemflow-colorOpacity') as HTMLDataElement).value) / 100;
    parent.postMessage({ pluginMessage: { type: 'set-color-opacity', value: value } }, '*');
  };
  document.getElementById('itemflow-bezier').onchange = () => {
    const value = (document.getElementById('itemflow-bezier') as HTMLInputElement).checked;
    parent.postMessage({ pluginMessage: { type: 'set-bezier', value: value } }, '*');
  };
};
