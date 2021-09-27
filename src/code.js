/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// TODO check for removed
function UpdateFlow() {
    const currentNodeInfo = GetCurrentNodeInfo();
    if (currentNodeInfo.length !== LastNodeInfo.length) {
    }
    else {
        for (let it = 0; it < LastNodeInfo.length; it++) {
            if (!LastNodeInfo[it].equal(currentNodeInfo[it])) {
                // TODO update for current node info
            }
        }
    }
}
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
export {};
