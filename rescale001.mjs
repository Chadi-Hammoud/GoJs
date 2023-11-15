import * as go from "./node_modules/gojs/release/go.mjs";
import { GraphObject , Diagram} from './node_modules/gojs/release/go.mjs';
import {RescalingTool} from "./RescalingTool.js";

// import  * as RescalingTool  from './node_modules/gojs/extensions/RescalingTool.js';

function init() {
    let myDiagram;
    // let RescalingTool = new RescalingTool;
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = GraphObject.make;  // for conciseness in defining templates

    myDiagram = new Diagram("myDiagramDiv",  // create a Diagram for the DIV HTML element
      {
        layout: $(go.TreeLayout),
        "undoManager.isEnabled": true  // enable undo & redo
      });

    // install the RescalingTool as a mouse-down tool
    myDiagram.toolManager.mouseDownTools.add(new RescalingTool());

    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        { locationSpot: go.Spot.Center },
        new go.Binding("scale").makeTwoWay(),
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0 },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8 },
          new go.Binding("text"))
      );

    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
    myDiagram.model = new go.GraphLinksModel(
      [
        { key: 1, text: "Alpha", color: "lightblue" },
        { key: 2, text: "Beta", color: "orange" },
        { key: 3, text: "Gamma", color: "lightgreen" },
        { key: 4, text: "Delta", color: "pink" }
      ],
      [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 3, to: 4 }
      ]);
  }
  window.addEventListener('DOMContentLoaded', init);