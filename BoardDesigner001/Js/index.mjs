
import * as go from "../../node_modules/gojs/release/go.mjs";
//import {setMyDiagram} from "./data.js";

let myDiagram;
let popupWindow;

function init() {

  let borderCount = parseInt(prompt("boards count"));
  let startIndex = parseInt(prompt("start Index, 0 or 1"));
  let isVertical = prompt("is vertical?, v ");


  function createConfigNewSlotDialog() {
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

  createConfigNewSlotDialog();


  let $ = go.GraphObject.make;
  // let currentLayout = makeLayout(isVertical === 'v');

  myDiagram = new go.Diagram("myDiagramDiv",
    {

      // when a drag-drop occurs in the Diagram's background, make it a top-level node
      // mouseDrop: e => finishDrop(e, null),
      // layout: currentLayout,
      "commandHandler.archetypeGroupData": { isGroup: true, text: "Group", horiz: false },
      "undoManager.isEnabled": true,
      "allowZoom": true,
      "allowResize": true,
      //"fixedBounds": new go.Rect(0, 0, 250, 600), // Set fixedBounds to a specific rectangular area
    });

  function makeLayout(isVertical, columns, rows) {
    let layout = null;
    if (isVertical) {
      layout = $(go.GridLayout, {
        wrappingColumn: Infinity, alignment: go.GridLayout.Position,
        wrappingWidth: rows,
        cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4),

      });
    } else {
      layout = $(go.GridLayout, {
        wrappingWidth: Infinity, alignment: go.GridLayout.Position,
        wrappingColumn: columns || 1,
        cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
      });
    }
    return layout;
  }








  myDiagram.nodeTemplateMap.add("board",
    $(go.Node, "Auto",
      new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),

      {
        resizable: true,
        resizeObjectName: "PANEL",
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        selectionAdorned: false,
        resizeAdornmentTemplate: $(go.Adornment, "Spot",
          $(go.Placeholder),
          $(go.Shape, // the handle
            {
              alignment: go.Spot.TopLeft,
              cursor: "nw-resize",
              desiredSize: new go.Size(6, 6),
              fill: "transparent",
              stroke: "transparent",

            }),
          $(go.Shape, // the handle
            {
              alignment: go.Spot.TopRight,
              cursor: "ne-resize",
              desiredSize: new go.Size(6, 6),
              fill: "transparent",
              stroke: "transparent"
            }),
        ),


      },

      $(go.Panel, "Vertical",

        new go.Binding("width", "width", null, null),
        new go.Binding("height", "height", null, null),
        new go.Binding("marginLeft", "marginLeft").makeTwoWay(),
        new go.Binding("marginTop", "marginTop").makeTwoWay(),
        new go.Binding("marginRight", "marginRight").makeTwoWay(),
        new go.Binding("marginBottom", "marginBottom").makeTwoWay(),

        {
          name: "PANEL",
        },
        $(go.Panel, "Horizontal",
          new go.Binding("width", "width", null, null),
          { height: 18 },
          $(go.Shape, "Rectangle",
            {
              fill: "black",
              width: 10,
            }
          ),
          $(go.Panel, "Auto",
            $(go.Shape, "Rectangle",
              new go.Binding("width", "width", v => v - 20),
              {
                fill: "white",
                stretch: go.GraphObject.Fill,
              }
            ),
            $(go.TextBlock, "",
              {
                name: "boardTextblock",
                margin: 2,
                alignment: go.Spot.Left,
              },
              new go.Binding("text", "text").makeTwoWay()
            )
          ),
          $(go.Shape, "Rectangle",
            {
              fill: "black",
              width: 10,
            }
          )
        ),

        $(go.Shape, "Rectangle",
          new go.Binding("height", "height", null, null),
          {
            height: 100,
            fill: "gray",
            stretch: go.GraphObject.Fill,
          }
        )
      ),
    ),

  );









  // myDiagram.groupTemplateMap.add("shelf",

  //   $(go.Group, "Auto",
  //     new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
  //     {
  //       //isSubGraphExpanded: false,
  //       resizable: true,
  //       resizeObjectName: "SHELF",
  //       layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
  //       layout: currentLayout,

  //       dragComputation: function (group, pt, gridpt) {
  //         // Get the new size of the group

  //         // var shelfGroupData = myDiagram.model.findNodeDataForKey("shelfGroup");
  //         // Now you can use shelfGroupBounds.width and shelfGroupBounds.height
  //         var groupWidth = group.width;
  //         var groupHeight = group.height;

  //         var data;
  //         var key;
  //         var width;
  //         var height

  //         if (isVertical == 'v') {
  //           // Iterate through all nodes in the group and adjust their sizes
  //           width = (groupWidth / borderCount) - 5;
  //           height = groupHeight - 5;

  //         } else {
  //           width = groupWidth - 5;
  //           height = (groupHeight / borderCount) - 5;

  //         }
  //         group.memberParts.each(function (node) {
  //           if (node instanceof go.Node) {
  //             key = node.key;
  //             data = myDiagram.model.findNodeDataForKey(key);

  //             myDiagram.startTransaction("move nodes");

  //             var x = node.location.x;
  //             var y = node.location.y;

  //             var newLocation = "";
  //             if (isVertical == 'v') {
  //               if (x > 0) {

  //                 var newLocationX = x - 5;
  //                 newLocation = `${newLocationX} ${y}`;
  //                 myDiagram.model.setDataProperty(data, "location", newLocation);
  //               }

  //             } else {
  //               if (y > 0) {
  //                 var newLocationY = y - 5;
  //                 newLocation = `${x} ${newLocationY}`;
  //                 myDiagram.model.setDataProperty(data, "location", newLocation);
  //               }
  //             }

  //             myDiagram.commitTransaction("move nodes");


  //             myDiagram.model.setDataProperty(data, "width", width);
  //             myDiagram.model.setDataProperty(data, "height", height);

  //             myDiagram.startTransaction("update bindings");
  //             node.updateTargetBindings();
  //             myDiagram.commitTransaction("update bindings");

  //             console.log("new location: ", key , " " ,newLocation, " ", node.location);



  //           }
  //         });


  //         return pt;
  //       },
  //     },

  //     $(go.Panel, "Auto", { name: "SHELF" },
  //       { defaultAlignment: go.Spot.Left },
  //       $(go.Shape, "Rectangle",
  //         {

  //           fill: "#e0e0e0",

  //         }
  //       ),
  //       new go.Binding("width", "width", null, null),
  //       new go.Binding("height", "height", null, null),
  //     ),
  //     new go.Binding("width", "width", null, null),
  //     new go.Binding("height", "height", null, null),


  //   ),
  //   new go.Binding("width", "width", null, null),
  //   new go.Binding("height", "height", null, null),
  // );






  // myDiagram.model = new go.GraphLinksModel(
  //   [
  //     { key: "boardGroup", isGroup: true, category: "shelf", width: 16.666666 * 30, height: 500 },
  //     { key: "port1", group: "boardGroup", category: "board", width: 16.666666 * 10, height: 100, loc: "0 0", text: "1 0" },
  //     { key: "port2", group: "boardGroup", category: "board", width: 16.666666 * 10, height: 100, loc: "16.666666 0", text: "2 0" },
  //     { key: "port3", group: "boardGroup", category: "board", width: 16.666666 * 10, height: 100, loc: "33.3333320", text: "3 0" },
  //     { key: "port4", group: "boardGroup", category: "board", width: 16.666666 * 10, height: 100, loc: "50 0", text: "4 0" },
  //     { key: "port5", group: "boardGroup", category: "board", width: 16.666666 * 10, height: 100, loc: "66.666664 0", text: "5 0" },
  //     { key: "port5", group: "boardGroup", category: "board", width: 16.666666 * 10, height: 100, loc: "83.33333 0", text: "6 0" },
  //     //{ key: "port1", category: "board", width: 120, height: 120 }, // Initial height value, you can set it accordingly


  //   ]
  // )




  // Clear existing nodes
  myDiagram.model = new go.GraphLinksModel();
  // myDiagram.model.addNodeData({
  //   key: "shelfGroup",
  //   isGroup: true,
  //   category: "shelf",
  //   width: 600,
  //   height: 300,
  //   location: ""
  // });
  // Add nodes dynamically based on the user input
  let indexSlot = 0;

  function addSlot() {

    // // Get the shelfGroup data
    // var shelfGroupData = myDiagram.model.findNodeDataForKey("shelfGroup");
    // // Now you can use shelfGroupBounds.width and shelfGroupBounds.height
    // var groupWidth = shelfGroupData.width;
    // var groupHeight = shelfGroupData.height;

    // if (isVertical == 'v') {
    //   currentLayout = makeLayout(isVertical === 'v');

    // } else {
    //   currentLayout = makeLayout(!isVertical === 'v');

    // }


    // myDiagram.layout = currentLayout;
    // myDiagram.layout.invalidateLayout();

    let defaultValue = (startIndex === NaN ? startIndex : 0);

    // for (let i = 1; i <= borderCount; i++) {
    //   addSlot();
    // }
    let tempVal = 0.0;
    for (let i = 1; i <= borderCount; i++) {
      
      let dis = 1000.0 / borderCount
      if (isVertical === 'v') {

        //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 120, height: 300, text: `${startIndex}:${indexSlot}` });
        myDiagram.model.addNodeData({
          key: `port${defaultValue}`,
          category: "board",
          width: 100,
          height: dis,
          text: `${defaultValue}:${indexSlot}`,
          location: `0 ${tempVal}`
        });



      } else {
        myDiagram.model.addNodeData({
          key: `port${startIndex}`,
          category: "board",
          width: dis,
          height: 100,
          text: `${defaultValue}:${indexSlot}`,
          location: `${tempVal} 0`
        });
        //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 300, height: 120, text: `${startIndex}:${indexSlot}` });
      }
      tempVal += dis;
      defaultValue++;
    }

  }

  addSlot();



  let slotIndex;
  let indexOnSlot;
  let X;
  let Y;
  let width;
  let height;

  let width1;
  let height1;

  let addSlotIndex;
  let addIndexOnSlot;

  let top;
  let left;
  let right;
  let bottom;


  let horizontal;
  let vertical;
  let rows;

  let distribution;
  let startPoint;
 
  

  window.addEventListener('message', function (event) {
    // Optional: Check the origin of the data!
    // if (event.origin !== "http://example.com:8080")
    //     return;

    // The data sent from the popup
    if (event.source.name === "Popup") {
      const data = event.data;
      if (data.formId == 'form0') {

        slotIndex = parseInt(data.slotIndex);
        indexOnSlot = parseInt(data.indexOnSlot);
        X = parseFloat(data.X, 10);
        Y = parseFloat(data.Y, 10);
        width = parseFloat(data.width, 10);
        height = parseFloat(data.height, 10);

        console.log("received message");
        // Use the data
        console.log(data);
        updateProperties();

      } else if (data.formId == 'form1') {

        //if form1
        width1 = parseFloat(data.width1, 10);
        height1 = parseFloat(data.height1, 10);
        autoResizePorts();
      } else if (data.formId == 'form2') {
        addSlotIndex = parseInt(data.addSlotIndex);
        addIndexOnSlot = parseInt(data.addIndexOnSlot);
        checkIndex();
      } else if (data.formId == 'form3') {
        top = parseInt(data.marginTop);
        right = parseInt(data.marginRight);
        bottom = parseInt(data.marginBottom);
        left = parseInt(data.marginLeft);

        horizontal = parseInt(data.horizontal);
        vertical = parseInt(data.vertical);
        rows = parseInt(data.rowsCount);

        distribution = data.direction;
        startPoint = data.startPoint;


        autoDistributionNodes(rows, left, right, horizontal, vertical, distribution, startPoint, top, bottom);

      }

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

  function updateBoardTypePortFromModel(data, x, y) {
    var viewportBounds = myDiagram.viewportBounds;
    var diagramWidth = viewportBounds.width;
    var diagramHeight = viewportBounds.height;

    let location = `${parseInt(x * diagramWidth / 1000)} ${parseInt(y * diagramHeight / 1000)}`;
    let width = parseInt(data.width * diagramWidth / 1000);
    let height = parseInt(data.height * diagramHeight / 1000);
    myDiagram.model.setDataProperty(data, "width", width);
    myDiagram.model.setDataProperty(data, "height", height);

    myDiagram.model.setDataProperty(data, "location", location);
  }

  function autoResizePorts() {
    let x, y;
    myDiagram.nodes.each(function (node) {
      // Start a transaction
      myDiagram.startTransaction('update size');

      var key = node.key;
      var data = myDiagram.model.findNodeDataForKey(key);
      let parts = data.location.split(' ');
      x = parts[0];
      y = parts[1];
      myDiagram.model.setDataProperty(data, "width", width1);
      myDiagram.model.setDataProperty(data, "height", height1);

      updateBoardTypePortFromModel(data, x, y);

      console.log(data);
      node.updateTargetBindings();
      // Commit the transaction
      myDiagram.commitTransaction('update size');

    });




  }

  function checkIndex() {
    let nodeText = addSlotIndex + ":" + addIndexOnSlot;
    let nodeExists = false;
    // Iterate over all nodes
    myDiagram.nodes.each(function (node) {
      var textBlock = node.findObject('boardTextblock');
      if (nodeText === textBlock.text) {
        // A node with the same text exists
        nodeExists = true;
      }
    });
    addNode(nodeExists);

  }

  function addNode(nodeExists) {
    if (!nodeExists) {
      // Start a transaction
      myDiagram.startTransaction('checkIndex');

      // Add a new node
      myDiagram.model.addNodeData({ key: `port${startIndex}`, category: "board", width: 120, height: 120, text: `${addSlotIndex}:${addIndexOnSlot}` });
      //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 120, height: 120, text: `${addSlotIndex}:${addIndexOnSlot}` });
      startIndex++;
      // Commit the transaction
      myDiagram.commitTransaction('checkIndex');
    }

  }

  var viewportBounds = myDiagram.viewportBounds;
  var diagramWidth = viewportBounds.width;
  var diagramHeight = viewportBounds.height;

  function updateBoardTypePort(x, y, portWidth, portHeight, data){
    let xPercentage = ((parseFloat((x * 1000) / diagramWidth)));
    let yPercentage = ((parseFloat(y * 1000) / diagramHeight));
    let widthPercentage = ((parseFloat(portWidth * 1000) / diagramWidth));
    let heightPercentage = ((parseFloat(portHeight * 1000) / diagramHeight));

    let location = `${xPercentage} ${yPercentage}`;
    myDiagram.model.setDataProperty(data, "location", location);
    myDiagram.model.setDataProperty(data, "width", widthPercentage);
    myDiagram.model.setDataProperty(data, "height", heightPercentage);

  }
  function applyChanges(rows, left, right, horizontal, vertical, distribution, startPoint, top, bottom) {
    if (borderCount > 0) {
      let nbRows = parseInt(rows), nbColumns = parseInt(Math.ceil(parseFloat(borderCount) / nbRows));
      let portWidth = parseInt((diagramWidth - (left + right + (horizontal * (nbColumns - 1)))) / nbColumns);
      let portHeight = parseInt((diagramHeight - (top + bottom + (vertical * (nbRows - 1)))) / nbRows);
      let i =0;
      // Iterate over all nodes
      myDiagram.nodes.each(function (node) {
        
        var key = node.key;
        var data = myDiagram.model.findNodeDataForKey(key);

        let x = 0, y = 0;

        // default calculation for top left
        let columnIndex = distribution === "horizontal" ? parseInt(((i % nbColumns) + 1)) : parseInt(((i / nbRows) + 1));
        let rowIndex = distribution === "horizontal" ? parseInt(((i / nbColumns) + 1)) : parseInt(((i % nbRows) + 1));

        if ("top-right"=== startPoint) {
          columnIndex = nbColumns - columnIndex + 1;
        }
        else if ("bottom-left"=== startPoint) {
          rowIndex = nbRows - rowIndex + 1;
        }
        else if ("bottom-right"=== startPoint) {
          columnIndex = nbColumns - columnIndex + 1;
          rowIndex = nbRows - rowIndex + 1;
        }

        x = left + (columnIndex - 1) * (portWidth + horizontal);
        y = top + (rowIndex - 1) * (portHeight + vertical);


        updateBoardTypePort(x, y, portWidth, portHeight, data);

        i++;
        node.updateTargetBindings();

      });
    }

    }
  function autoDistributionNodes(rows, left, right, horizontal, vertical, distribution, startPoint, top, bottom) {
  
    applyChanges(rows, left, right, horizontal, vertical, distribution, startPoint, top, bottom);

  }




  // Add a listener for the SelectionChanged event
  myDiagram.addDiagramListener("ChangedSelection", function (e) {
    // Get the selected node

    var node = e.subject.first();

    // If a node is selected
    if (node instanceof go.Node) {
      var type = node.data.category;
      if (type === "board") {
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

