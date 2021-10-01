 
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
            const found = selection.find((y, i2) => { return x.id === y.id }) !== undefined;
            if (found) {
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
            const found = lastSelection.find((y, i2) => { return x.id === y.id }) !== undefined;
            if (!found) {
                lastSelection.push(x);
                OnSelectionItemAdded(x);
            }
        });
    }
    //changed
    else if (selection.length === lastSelection.length && selection.length === 1) {
        if (selection[0].id != lastSelection[0].id) {
            result.push(selection[0]);
            OnSelectionItemAdded(selection[0]);
            OnSelectionItemRemoved(lastSelection[0]);
            lastSelection = result;
        }
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
    });
}
export { SetOnSelectionChanged, SetOnSelectionItemAdded, SetOnSelectionItemRemoved, GetSelection, UpdateSelection };