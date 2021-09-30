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
    parent.postMessage({ pluginmessage: { type: 'set-stroke-weight', value } }, '*');
  };
  document.getElementById('itemflow-dashPattern').onchange = () => {
    const { value } = document.getElementById('itemflow-dashPattern') as HTMLDataElement;
    parent.postMessage({ pluginmessage: { type: 'set-dash-pattern', value } }, '*');
  };
  document.getElementById('itemflow-strokeCap0').onchange = () => {
    const value0 = (document.getElementById('itemflow-strokeCap0') as HTMLDataElement).value;
    const value1 = (document.getElementById('itemflow-strokeCap1') as HTMLDataElement).value;
    parent.postMessage({ pluginmessage: { type: 'set-stroke-cap', value: [value0, value1] } }, '*');
  };
  document.getElementById('itemflow-strokeCap1').onchange = () => {
   const value0 = (document.getElementById('itemflow-strokeCap0') as HTMLDataElement).value;
    const value1 = (document.getElementById('itemflow-strokeCap1') as HTMLDataElement).value;
    parent.postMessage({ pluginmessage: { type: 'set-stroke-cap', value: [value0, value1] } }, '*');
  }; 
};
