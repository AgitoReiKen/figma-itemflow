/* eslint-disable no-restricted-globals */
window.onload = () => {
  document.getElementById('itemflow-stroke').onchange = () => {
    const { value } = document.getElementById('stroke') as HTMLDataElement;
    parent.postMessage({ pluginmessage: { type: 'set-stroke', value } }, '*');
  };
  document.getElementById('itemflow-cancel').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };
  document.getElementById('itemflow-test').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'test' } }, '*');
  };
};
