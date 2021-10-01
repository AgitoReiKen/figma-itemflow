/* eslint-disable default-case */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as selection from './selection';
import * as flow from './flow';
import { truncate } from 'fs';

figma.showUI(__html__);
// TODO check for removed 
const flowSettings: flow.FlowSettings = new flow.FlowSettings();


/* todo update z index */
flow.Enable();
selection.SetOnSelectionChanged((selection: Array<SceneNode>) => {
  if (selection.length === 2) {
    flow.CreateFlow(selection[0], selection[1], flowSettings);
  }
});
figma.on('close', () => { flow.Disable();});
figma.ui.onmessage = (msg) => {
  console.log(msg);
  switch (msg.type) {
    case 'set-stroke-weight': {
      flowSettings.weight = parseInt(msg.value); 
      break;
    }
    case 'set-stroke-cap': {
      flowSettings.strokeCap[0] = msg.value[0] as StrokeCap;
      flowSettings.strokeCap[1] = msg.value[1] as StrokeCap;
      break;
    }
    case 'set-color': {
      const getColor = function (pos: number, value: string): number {
        return parseFloat((parseInt((msg.value as string).substr(pos, 2), 16) / 0xFF).toPrecision(3));
      };
      //#ABACAD
      flowSettings.color.r = getColor(1, msg.value); // AB 
      flowSettings.color.g = getColor(3, msg.value); // AC
      flowSettings.color.b = getColor(5, msg.value); // AD
      console.log(flowSettings);
      break;
    }
    case 'set-color-opacity': {
      flowSettings.color.a = msg.value;
      break;
    }
    case 'set-dash-pattern': {
      flowSettings.dashPattern = [parseInt(msg.value)];
      break;
    }
    case 'set-bezier': { 
      flowSettings.bezier = msg.value;
      break;
    }
    case 'cancel': {
      figma.closePlugin();
      break;
    } 
  } 
};
