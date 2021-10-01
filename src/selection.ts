import { copyFileSync } from "fs";

let lastSelection: Array<SceneNode> = [];
type OnSelectionChangedType = (selection: Array<SceneNode>) => void
type OnSelectionItemRemovedType = (item: SceneNode) => void;
type OnSelectionItemAddedType = (item: SceneNode) => void;
let OnSelectionChanged: OnSelectionChangedType;
let OnSelectionItemRemoved: OnSelectionItemRemovedType;
let OnSelectionItemAdded: OnSelectionItemAddedType;
function UpdateSelection() {
    const selection = figma.currentPage.selection;
    const lastSelectionLength = lastSelection.length;
    let result: Array<SceneNode> = [];
    //removed
    if (lastSelection.length > selection.length) {
        lastSelection.forEach((x, i) => {
            const found = selection.find((y, i2) => {  return x.id === y.id } )
            if (found != null) {
                result.push(x);
                
            }
        });
        result.forEach(x => {
            OnSelectionItemRemoved(x);
        });
        lastSelection = result;
    }
    //added
    else if (lastSelection.length < selection.length) {
        selection.forEach((x, i) => {
            const found = lastSelection.find((y, i2) => { return x.id === y.id })
            if (found == null) {
                lastSelection.push(x);
                OnSelectionItemAdded(x);
            }
        });
    }
    //bug
    else {
        
    }
    if (lastSelectionLength === 1 && lastSelection.length === 2) {
        OnSelectionChanged(lastSelection);
    }
}
function GetSelection(): Array<SceneNode> {
    return lastSelection;
}
function SetOnSelectionItemRemoved(callback: OnSelectionItemRemovedType) {
    OnSelectionItemRemoved = callback;
 }
function SetOnSelectionItemAdded(callback: OnSelectionItemAddedType){
    OnSelectionItemAdded = callback;
}
function SetOnSelectionChanged(callback: OnSelectionChangedType): void {
    OnSelectionChanged = callback;
    figma.on('selectionchange', () => {
        UpdateSelection();
        
        // setInterval(UpdateFlow, 200);
        if (figma.currentPage.selection.length > 1) {
            // check if it doesnt have arrow attached
            // logic is to attach/remove from -2 to -1
            // 0
            // 1
            // 2
            // 3
        }
    });
}
export { SetOnSelectionChanged, SetOnSelectionItemAdded, SetOnSelectionItemRemoved, GetSelection, UpdateSelection };