import * as go from "../../node_modules/gojs/release/go.mjs";


let $ = go.GraphObject.make;
// let currentLayout = makeLayout(isVertical === 'v');

let myDiagram = new go.Diagram("myDiagramDiv",
  {
    "commandHandler.archetypeGroupData": { isGroup: true, text: "Group", horiz: false },
    "undoManager.isEnabled": true,
    "allowZoom": true,
    "allowResize": true,
    "fixedBounds": new go.Rect(5, 5, 100, 100), // Set fixedBounds to a specific rectangular area
    // "initialContentAlignment": go.Spot.TopLeft,
    // "autoScale": go.Diagram.Uniform,
  });

myDiagram.scale = 1.490455443789063;


// myDiagram.scale = 4.3;
export { $, myDiagram };