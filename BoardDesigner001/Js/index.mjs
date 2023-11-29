
import * as go from "../../node_modules/gojs/release/go.mjs";
//import {setMyDiagram} from "./data.js";

let myDiagram;

function init() {

  let borderCount = parseInt(prompt("boards count"));
  let startIndex = parseInt(prompt("start Index, 0 or 1"));
  let popupWindow;



  let $ = go.GraphObject.make;

  myDiagram = new go.Diagram("myDiagramDiv",
    {
      // when a drag-drop occurs in the Diagram's background, make it a top-level node
      // mouseDrop: e => finishDrop(e, null),
      layout: // Diagram has simple horizontal layout
        new go.GridLayout(
          { wrappingWidth: Infinity, alignment: go.GridLayout.Position, cellSize: new go.Size(1, 1) }),
      "commandHandler.archetypeGroupData": { isGroup: true, text: "Group", horiz: false },
      "undoManager.isEnabled": true,
      //"fixedBounds": new go.Rect(0, 0, 800, 400), // Set fixedBounds to a specific rectangular area
    });
  // myDiagram.toolManager.resizingTool.computeReshape = function () { return false; }


 
  function makeLayout(horiz) {
    if (horiz) {
      return new go.GridLayout(
        {
          wrappingWidth: Infinity, alignment: go.GridLayout.Position,
          cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
        });
    } else {
      return new go.GridLayout(
        {
          wrappingColumn: Infinity, alignment: go.GridLayout.Position,
          cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
        });
    }
  }


  function defaultColor(horiz) { // a Binding conversion function
    return horiz ? "lightgray" : "lightgray";
  }

  function defaultFont(horiz) { // a Binding conversion function
    return horiz ? "bold 20px sans-serif" : "bold 16px sans-serif";
  }



  // myDiagram.groupTemplateMap.add("shelf",
  //   new go.Group("Auto",
  //     {
  //       layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
  //       background: "gray",
  //       //ungroupable: true,
  //       resizable: false,


  //     })
  //     //.bind("layout", "horiz", makeLayout)
  //    // .bind(new go.Binding("background", "isHighlighted", h => h ? "rgba(255,0,0,0.2)" : "transparent").ofObject())
  //     .add(new go.Shape("Rectangle",
  //       { fill: null, stroke: defaultColor(false), fill: defaultColor(false), strokeWidth: 2 })
  //       .bind("stroke", "horiz", defaultColor)
  //       .bind("fill", "horiz", defaultColor))
  //     .add(
  //       new go.Panel("Vertical") // title above Placeholder
  //         .add(new go.Panel("Horizontal", // button next to TextBlock
  //           { stretch: go.GraphObject.Horizontal, background: defaultColor(false) })
  //           .bind("background", "horiz", defaultColor)
  //           .add(go.GraphObject.make("SubGraphExpanderButton", { alignment: go.Spot.Right, margin: 5 }))
  //           .add(new go.TextBlock(
  //             {
  //               //alignment: go.Spot.Left,
  //               // editable: true,
  //               margin: 5,
  //               font: defaultFont(false),
  //               opacity: 0.95, // allow some color to show through
  //               stroke: "#404040"
  //             })
  //             .bind("font", "horiz", defaultFont)
  //             .bind("text", "text", null, null)) // `null` as the fourth argument makes this a two-way binding
  //         ) // end Horizontal Panel
  //         .add(new go.Placeholder({ padding: 5, alignment: go.Spot.TopLeft }))
  //     ));





  //   go.Shape.defineFigureGenerator("headSection", function(shape, w, h) {
  //     var geo = new go.Geometry();
  //     var fig = new go.PathFigure(0, 0, true); // starting point
  //     geo.add(fig);

  //     // Top section (head)
  //     fig.add(new go.PathSegment(go.PathSegment.Line, w, 0));
  //     fig.add(new go.PathSegment(go.PathSegment.Line, w, 20));
  //     fig.add(new go.PathSegment(go.PathSegment.Line, 0, 20).close()); // height = 20px

  //     return geo;
  // });

  // go.Shape.defineFigureGenerator("BottomSection", function(shape, w, h) {
  //     var geo = new go.Geometry();
  //     var fig = new go.PathFigure(0, 0, true); // starting point
  //     geo.add(fig);

  //     // Bottom section (body)
  //     fig.add(new go.PathSegment(go.PathSegment.Line, 0, 20)); // Adjust starting point to match the ending point of the "headSection"
  //     fig.add(new go.PathSegment(go.PathSegment.Line, w, 20));
  //     fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
  //     fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close()); // height = h - 20px

  //     return geo;
  // });

  myDiagram.nodeTemplateMap.add("board",
    $(go.Node, "Auto",
      {
        resizable: true,
        resizeObjectName: "PANEL", // Set resizeObjectName to the name of the panel
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized
      },
      $(go.Panel, "Vertical",
        new go.Binding("width", "width", null, null),
        new go.Binding("height", "height", null, null),

        {
          name: "PANEL", // Give the panel a name for referencing in resizeObjectName
        },
        $(go.Panel, "Horizontal",

          { height: 20, stretch: go.GraphObject.Fill, },
          $(go.Shape, "Rectangle",
            new go.Binding("width", "width", v => v / 12),
            {
              fill: "black",
            }
          ),

          $(go.Panel, "Auto",

            $(go.Shape, "Rectangle",
              new go.Binding("width", "width", v => v * 0.83),

              {
                fill: "white",
                stretch: go.GraphObject.Fill, // Make the shape resizable

              }
            ),

            $(go.TextBlock, "",
              {
                //text: "0:0",
                name: "boardTextblock",
                margin: 3, // Add some margin to position the text inside the rectangle
                //editable: true, // Make the text editable

                alignment: go.Spot.Left, // Center the text within the shape
              },
              new go.Binding("text", "text").makeTwoWay() // Bind the text to the 'text' property of the node data
            )
          ),

          $(go.Shape, "Rectangle",
            new go.Binding("width", "width", v => v / 10),
            {
              fill: "black",
            }
          ),


        ),
        new go.Binding("width", "width").makeTwoWay(),

        $(go.Shape, "Rectangle",
          new go.Binding("height", "height", null, null),
          {
            height: 100,
            fill: "gray",
            stretch: go.GraphObject.Fill, // Make the shape resizable

          }
        )
      ),
    ),

  );



  // myDiagram.model = new go.GraphLinksModel(
  //   [
  //     { key: "boardGroup", isGroup: true, category: "shelf" },
  //     { key: "port1", group: "boardGroup", category: "board", width: 120, height: 120 },
  //     { key: "port2", group: "boardGroup", category: "board", width: 120, height: 120 },
  //     { key: "port3", group: "boardGroup", category: "board", width: 120, height: 120 },
  //     //{ key: "port1", category: "board", width: 120, height: 120 }, // Initial height value, you can set it accordingly


  //   ]
  // )




  // Clear existing nodes
  myDiagram.model = new go.GraphLinksModel();
  // myDiagram.model.addNodeData({ key: "boardGroup", isGroup: true, category: "shelf" }) ;
  // Add nodes dynamically based on the user input
  let indexSlot = 0;


  for (let i = 1; i <= borderCount; i++) {

    // myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "boardGroup", category: "board", width: 120, height: 120  });
    myDiagram.model.addNodeData({ key: `port${startIndex}`, category: "board", width: 120, height: 120, text: `${startIndex}:${indexSlot}` });
    startIndex++;
  }


  function openPopup() {
    // Specify the URL and other options for the popup window
    var popupOptions = 'width=600,height=800,scrollbars=yes';

    // Check if the popup already exists and is not closed
    if (popupWindow && !popupWindow.closed) {
      // If it is, just focus on it
      popupWindow.focus();
    } else {
      // If not, open a new popup window with the specified URL and options
      popupWindow = window.open('./html/popup.html', 'Popup', popupOptions);
    }
  }

  let openPopupButton = document.createElement('button');
  openPopupButton.textContent = 'Open Popup';
  openPopupButton.addEventListener('click', openPopup);
  document.body.appendChild(openPopupButton);

  let slotIndex;
  let indexOnSlot;
  let X;
  let Y;
  let width;
  let height;

  let width1;
  let height1;
  window.addEventListener('message', function (event) {
    // Optional: Check the origin of the data!
    // if (event.origin !== "http://example.com:8080")
    //     return;

    // The data sent from the popup
    if (event.source.name === "Popup") {

      const data = event.data;
      slotIndex = parseInt(data.slotIndex);
      indexOnSlot = parseInt(data.indexOnSlot);
      X = parseFloat(data.X, 10);
      Y = parseFloat(data.Y, 10);
      width = parseFloat(data.width, 10);
      height = parseFloat(data.height, 10);

      console.log("received message");
      // Use the data
      console.log(data);
      //updateProperties();

      width1 = parseFloat(data.width1, 10);
      height1 = parseFloat(data.height1, 10);
      UpdateAllNodesSize();
    }

    console.log(event.source.name);

  }, false);



  function updateProperties() {


    let nodeText = slotIndex + ":" + indexOnSlot;

    // Iterate over all nodes
    myDiagram.nodes.each(function (node) {
      var textBlock = node.findObject('boardTextblock');

      if (nodeText === textBlock.text) {
        // Start a transaction
        myDiagram.startTransaction('update properties');

        var key = node.key;
        var data = myDiagram.model.findNodeDataForKey(key);

        myDiagram.model.setDataProperty(data, "width", width);
        myDiagram.model.setDataProperty(data, "height", height);
        node.location = new go.Point(X, Y);
        node.updateTargetBindings();
        // Commit the transaction
        myDiagram.commitTransaction('update properties');
      }
    });


  }


  function UpdateAllNodesSize() {
    // Iterate over all nodes
    myDiagram.nodes.each(function (node) {
      // Start a transaction
      myDiagram.startTransaction('update size');

      var key = node.key;
      var data = myDiagram.model.findNodeDataForKey(key);

      myDiagram.model.setDataProperty(data, "width", width1);
      myDiagram.model.setDataProperty(data, "height", height1);
      node.updateTargetBindings();
      // Commit the transaction
      myDiagram.commitTransaction('update size');

    });


  }

  // Add a listener for the SelectionChanged event
  myDiagram.addDiagramListener("ChangedSelection", function (e) {
    // Get the selected node
    var node = e.subject.first();

    // If a node is selected
    if (node instanceof go.Node) {
      // Get the node's location, width, and height
      //var key = node.data.key;
      var text = node.data.text;
      let parts = text.split(':');
      let slotIndex = parts[0];
      let indexOnSlot = parts[1];

      var loc = node.location;
      var width = node.data.width;
      var height = node.data.height;
      var x = loc.x;
      var y = loc.y;

      var data = {
        slotIndex: slotIndex,
        indexOnSlot: indexOnSlot,
        X: x,
        Y: y,
        width: width,
        height: height
      };

      // Send the location, width, and height to the popup window
      popupWindow.postMessage(data, "*");
      console.log(data);

    }
  });



  // function printNodeTexts() {
  //   myDiagram.startTransaction('printNodeTexts');
  //   // Iterate over all nodes in the diagram
  //   myDiagram.nodes.each(function (node) {
  //     // Find the TextBlock in the node
  //     // var textBlock = node.findObject('boardTextblock'); // Replace 'TEXTBLOCK' with the actual name of your TextBlock, if you have assigned one
  //     // if (textBlock) {
  //     //   // Print the text
  //     //   console.log(textBlock.text);
  //     // }



  //     myDiagram.commitTransaction('printNodeTexts');
  //   });
  // }
  // printNodeTexts();


  // function printNodeShapes() {
  //   myDiagram.startTransaction('printNodeShape');
  //   // Iterate over all nodes in the diagram
  //   myDiagram.nodes.each(function (node) {


  //     var shape = node.findObject(node.findMainElement().panel.itemArray[0].name);
  //     console.log(shape);

  //     myDiagram.commitTransaction('printNodeShapes');
  //   });
  // }
  // printNodeShapes();



 // setMyDiagram(myDiagram);
}


window.addEventListener('DOMContentLoaded', init);
