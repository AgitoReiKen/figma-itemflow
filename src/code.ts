import { GetPluginFrame } from './flow';

import * as selection from './selection';
import * as flow from './flow';

figma.showUI(__html__);
figma.ui.resize(300, 330);

/* todo update z index */
flow.Enable();

flow.GetPluginFrame().locked = true;

figma.on('close', () => {
  flow.Disable();
  figma.closePlugin();
});
figma.ui.onmessage = (msg) => {
  switch (msg.type) {
    case 'set-stroke-weight': {
      flow.flowSettings.weight = parseInt(msg.value, 10);
      break;
    }
    case 'set-stroke-cap': {
      if (msg.value[0] !== null) {
        flow.flowSettings.strokeCap[0] = msg.value[0] as StrokeCap;
      }
      if (msg.value[1] !== null) {
        flow.flowSettings.strokeCap[1] = msg.value[1] as StrokeCap;
      }
      break;
    }
    case 'set-color': {
      // eslint-disable-next-line func-names
      const getColor = function getColor(pos: number, value: string): number {
        return parseFloat((parseInt(value.substr(pos, 2), 16) / 0xFF).toPrecision(3));
      };
      // #ABACAD
      flow.flowSettings.color.r = getColor(1, msg.value); // AB
      flow.flowSettings.color.g = getColor(3, msg.value); // AC
      flow.flowSettings.color.b = getColor(5, msg.value); // AD
      break;
    }
    case 'set-color-opacity': {
      flow.flowSettings.color.a = msg.value;
      break;
    }
    case 'set-dash-pattern': {
      const dash = parseInt(msg.value, 10);
      flow.flowSettings.dashPattern = [dash, dash];
      break;
    }
    case 'set-bezier': {
      flow.flowSettings.bezier = msg.value;
      break;
    }
    case 'set-enabled': {
      if (msg.value) {
        flow.EnableFlowEvents();
      } else {
        flow.DisableFlowEvents();
      }
      break;
    }
    case 'set-update': {
      if (msg.value) {
        flow.EnableFlowUpdate();
      } else {
        flow.DisableFlowUpdate();
      }
      break;
    }
    case 'set-framelocked': {
      GetPluginFrame().locked = msg.value;
      break;
    }
  }
};
