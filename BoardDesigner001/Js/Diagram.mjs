import * as go from "../../node_modules/gojs/release/go.mjs";

let $ = go.GraphObject.make;
// let currentLayout = makeLayout(isVertical === 'v');

let myDiagram = new go.Diagram("myDiagramDiv",
  {
    "commandHandler.archetypeGroupData": { isGroup: true, text: "Group", horiz: false },
    "undoManager.isEnabled": true,
    "allowZoom": true,
    "allowResize": true,
    //"fixedBounds": new go.Rect(10, 10, 100, 100), // Set fixedBounds to a specific rectangular area
  });


  export { $ , myDiagram } ;