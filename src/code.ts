import { GetPluginFrame } from './flow';

import * as selection from './selection';
import * as flow from './flow';

figma.showUI(__html__);
figma.ui.resize(300, 330);
const flowSettings: flow.FlowSettings = new flow.FlowSettings();

/* todo update z index */
flow.Enable();
selection.SetOnSelectionChanged((_selection: Array<SceneNode>) => {
  if (_selection.length === 2) {
    flow.CreateFlow(_selection[0], _selection[1], flowSettings);
  }
});
figma.on('close', () => { flow.Disable(); });
figma.ui.onmessage = (msg) => {
  console.log(msg);
  switch (msg.type) {
    case 'set-stroke-weight': {
      flowSettings.weight = parseInt(msg.value, 10);
      break;
    }
    case 'set-stroke-cap': {
      if (msg.value[0] !== null) {
        flowSettings.strokeCap[0] = msg.value[0] as StrokeCap;
      }
      if (msg.value[1] !== null) {
        flowSettings.strokeCap[1] = msg.value[1] as StrokeCap;
      }
      console.log(flowSettings);
      break;
    }
    case 'set-color': {
      // eslint-disable-next-line func-names
      const getColor = function getColor(pos: number, value: string): number {
        return parseFloat((parseInt(value.substr(pos, 2), 16) / 0xFF).toPrecision(3));
      };
      // #ABACAD
      flowSettings.color.r = getColor(1, msg.value); // AB
      flowSettings.color.g = getColor(3, msg.value); // AC
      flowSettings.color.b = getColor(5, msg.value); // AD
      break;
    }
    case 'set-color-opacity': {
      flowSettings.color.a = msg.value;
      break;
    }
    case 'set-dash-pattern': {
      flowSettings.dashPattern = [parseInt(msg.value, 10)];
      break;
    }
    case 'set-bezier': {
      flowSettings.bezier = msg.value;
      break;
    }
    case 'set-enabled': {
      if (msg.value) {
        flow.Enable();
      } else {
        flow.Disable();
      }
      break;
    }
    case 'set-framelocked': {
      GetPluginFrame().locked = msg.value;
      break;
    }
    case 'cancel': {
      figma.closePlugin();
      break;
    }
  }
};
