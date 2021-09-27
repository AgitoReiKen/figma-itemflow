/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

figma.showUI(__html__);
// TODO check for removed

/* todo update z index */
figma.on('selectionchange', () => {
  console.log(figma.currentPage.selection);
  setInterval(UpdateFlow, 200);
  if (figma.currentPage.selection.length > 1) {
    // check if it doesnt have arrow attached
    // logic is to attach/remove from -2 to -1
    // 0
    // 1
    // 2
    // 3
  }
});
figma.ui.onmessage = (msg) => {
  console.log(msg);
  if (msg.type === 'create-rectangles') {

  }
  figma.closePlugin();
};
