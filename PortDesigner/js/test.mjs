
import * as go from "../../node_modules/gojs/release/go.mjs";
//import {setMyDiagram} from "./data.js";

let myDiagram;
let popupWindow;

function init() {
    let $ = go.GraphObject.make;
    myDiagram = $(
        go.Diagram,
        "myDiagramDiv",
        {
          "undoManager.isEnabled": true,
          "allowZoom": false,
          "allowResize": true,
          "draggingTool.dragsTree": true,
        }
      );
      
      // Define a node template
      myDiagram.nodeTemplateMap.add("RectangleNode",
        $(
          go.Node,
          "Auto",   
          {
            resizable: true,
            resizeObjectName: "PANEL",
            movable: true,
          },

          $(
            go.Panel, "Vertical",
            { name: "PANEL" },
            $(
              go.Shape,
              "Rectangle",
              { fill: "rgba(0, 0, 255, 0.1)", stroke: "purple", strokeWidth: 2, height: 100,    },
            ),

          ),
         
        )
      );
      
      // Define a group template with two rectangles
      myDiagram.groupTemplateMap.add("TwoRectanglesGroup",
        $(
          go.Group,
          "Auto",
          {
            resizable: true,
            resizeObjectName: "PANEL",
            layout: $(go.GridLayout, { wrappingColumn: 1, alignment: go.GridLayout.Position }),
            movable: true,
            width: 200,
            height: 400,
           
          },
          $(
            go.Shape,
            "Rectangle",
            { fill: "rgba(0, 0, 255, 0.1)", stroke: "black", strokeWidth: 2,    },
          ),

          $(go.Panel, "Auto",
            $(go.Placeholder)
          )
        )
      );
      
      // Create a group using the group template
      myDiagram.model.addNodeData({ key: "group1", isGroup: true , category: "TwoRectanglesGroup" });
      
      // Add nodes to the group from the node template
      myDiagram.model.addNodeData({ key: "port1", text: "Node 1", group: "group1", category: "RectangleNode" });
      myDiagram.model.addNodeData({ key: "port2", text: "Node 2", group: "group1", category: "RectangleNode" });
      
      // Enable linking from nodes to the group
      myDiagram.toolManager.linkingTool.archetypeGroupData = { isGroup: true, text: "TwoRectanglesGroup" };
      

}


window.addEventListener('DOMContentLoaded', init);

