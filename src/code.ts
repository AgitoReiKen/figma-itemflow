/* eslint-disable default-case */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as selection from './selection';
import { CreateFlow } from './core';

figma.showUI(__html__);
// TODO check for removed
let stroke = 24;
/* todo update z index */
selection.SetFigmaListener();
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
      CreateFlow(figma.currentPage.selection[0], figma.currentPage.selection[1]);
      break;
    }
  }
  if (msg.type === 'create-rectangles') {

  }
  figma.closePlugin();
};
