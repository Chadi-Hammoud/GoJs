import * as go from "./node_modules/gojs/release/go.js";
var myDiagram =
 new go.Diagram("myDiagramDiv",
   { "undoManager.isEnabled": true }); // enable undo & redo

// Define a simple Node template
myDiagram.nodeTemplate =
 new go.Node("Auto") // the Shape will automatically surround the TextBlock
   .add(new go.Shape("Rectangle",
       { strokeWidth: 0, fill: "white" }) // no border; default fill is white
       .bind("fill", "color")) // Shape.fill is bound to Node.data.color
   .add(new go.TextBlock({ margin: 8, stroke: "#333" }) // some room around the text
       .bind("text", "key")); // TextBlock.text is bound to Node.data.key

// Define the model data that will be represented by Nodes and Links
myDiagram.model = new go.GraphLinksModel(
 [
   { key: "A1", color: "lightblue" },
   { key: "A2", color: "orange" },
   { key: "A3", color: "lightgreen" },
   { key: "B1", color: "pink" },
   { key: "B2", color: "lightblue" },
   { key: "B3", color: "orange" },
   { key: "C1", color: "lightgreen" },
   { key: "C2", color: "pink" },
   { key: "C3", color: "lightblue" }
 ],
 [
   { from: "A1", to: "A2" },
   { from: "A2", to: "A3" },
   { from: "A1", to: "B1" },
   { from: "B1", to: "B2" },
   { from: "B2", to: "B3" },
   { from: "A2", to: "B2" },
   { from: "B2", to: "C2" },
   { from: "C2", to: "C3" },
   { from: "C3", to: "C1" },
   { from: "C1", to: "B1" },
   { from: "B1", to: "A1" },
   { from: "A1", to: "A2" }
 ]);
