/* eslint-disable default-case */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as selection from './selection';
import * as flow from './flow';

figma.showUI(__html__);
// TODO check for removed
let stroke = 24;
/* todo update z index */
flow.SetEvents();
selection.SetOnSelectionChanged((selection: Array<SceneNode>) => {
  if (selection.length === 2) {
    flow.CreateFlow(selection[0], selection[1], new flow.FlowSettings());
  }
});
figma.ui.onmessage = (msg) => { 
  switch (msg.type) {
    case 'set-stroke': {
      stroke = msg.value;
      break;
    }
    case 'cancel': {
      figma.closePlugin();
      break;
    }
    case 'test': {
       
      break;
    }
  } 
};
