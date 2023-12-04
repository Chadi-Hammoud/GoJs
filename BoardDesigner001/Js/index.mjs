
import * as go from "../../node_modules/gojs/release/go.mjs";
//import {setMyDiagram} from "./data.js";

let myDiagram;
let popupWindow;

function init() {

  let borderCount = parseInt(prompt("boards count"));
  let startIndex = parseInt(prompt("start Index, 0 or 1"));
  let isVertical = prompt("is vertical?, v ");


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

  openPopup();


  let $ = go.GraphObject.make;

  myDiagram = new go.Diagram("myDiagramDiv",
    {
      // when a drag-drop occurs in the Diagram's background, make it a top-level node
      // mouseDrop: e => finishDrop(e, null),

      "commandHandler.archetypeGroupData": { isGroup: true, text: "Group", horiz: false },
      "undoManager.isEnabled": true,
      "allowZoom": false,
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



  myDiagram.groupTemplateMap.add("shelf",
    $(go.Group, "Auto",
      {
        //isSubGraphExpanded: false,
        resizable: true,
        resizeObjectName: "SHELF"
      },

      $(go.Panel, "Auto", { name: "SHELF" },

        $(go.Shape, "Rectangle",
          {

            fill: "#e0e0e0",

          }
        ),
        new go.Binding("width", "width", null, null),
        new go.Binding("height", "height", null, null),
      ),
    )
  );





  myDiagram.nodeTemplateMap.add("board",
    $(go.Node, "Auto",
      new go.Binding("location", "loc").makeTwoWay(),
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
        dragComputation: function (node, pt, gridpt) {
          // get the shelf group
          var shelfGroup = node.containingGroup;
          if (shelfGroup !== null) {
            // get the shelf group's bounds
            var shelfBounds = shelfGroup.actualBounds;
            // get the node's bounds
            var nodeBounds = node.actualBounds;
            // check if the new location is outside the shelf group
            if (pt.x < shelfBounds.x || pt.y < shelfBounds.y ||
              pt.x + nodeBounds.width > shelfBounds.x + shelfBounds.width ||
              pt.y + nodeBounds.height > shelfBounds.y + shelfBounds.height) {
              // adjust the new location to keep the node inside the shelf group
              pt.x = Math.max(shelfBounds.x, Math.min(pt.x, shelfBounds.x + shelfBounds.width - nodeBounds.width));
              pt.y = Math.max(shelfBounds.y, Math.min(pt.y, shelfBounds.y + shelfBounds.height - nodeBounds.height));
            }
          }
          return pt;
        },


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
    )
  );

  let currentLayout = makeLayout(isVertical === 'v');








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
  myDiagram.model.addNodeData({ key: "shelfGroup", isGroup: true, category: "shelf", width: 600, height: 300 });
  // Add nodes dynamically based on the user input
  let indexSlot = 0;

  function addBoardsFromUserPrompt() {
    // Get the shelfGroup data
    var shelfGroupData = myDiagram.model.findNodeDataForKey("shelfGroup");
    // Now you can use shelfGroupBounds.width and shelfGroupBounds.height
    var groupWidth = shelfGroupData.width;
    var groupHeight = shelfGroupData.height;

    if (isVertical == 'v') {
      currentLayout = makeLayout(isVertical === 'v');

    } else {
      currentLayout = makeLayout(!isVertical === 'v');

    }

    if (shelfGroupData) {
      shelfGroupData.layout = currentLayout;


    }

    for (let i = 1; i <= borderCount; i++) {
      if (isVertical === 'v') {

        //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 120, height: 300, text: `${startIndex}:${indexSlot}` });
        myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: (groupWidth / borderCount) - 20, height: groupHeight - 10, text: `${startIndex}:${indexSlot}` });

      } else {
        myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: groupWidth - 40, height: (groupHeight / borderCount) - 13, text: `${startIndex}:${indexSlot}` });
        //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 300, height: 120, text: `${startIndex}:${indexSlot}` });

      }
      startIndex++;
    }

  }

  addBoardsFromUserPrompt();




  // let openPopupButton = document.createElement('button');
  // openPopupButton.textContent = 'Open Popup';
  // openPopupButton.addEventListener('click', openPopup);
  // document.body.appendChild(openPopupButton);

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

  let marginTop;
  let marginLeft;
  let marginRight;
  let marginBottom;


  let horizontal;
  let vertical;
  let rowsCount
  let layout;

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
        UpdateAllNodesSize();
      } else if (data.formId == 'form2') {
        addSlotIndex = parseInt(data.addSlotIndex);
        addIndexOnSlot = parseInt(data.addIndexOnSlot);
        checkIndex();
      } else if (data.formId == 'form3') {
        marginTop = parseInt(data.marginTop);
        marginRight = parseInt(data.marginRight);
        marginBottom = parseInt(data.marginBottom);
        marginLeft = parseInt(data.marginLeft);

        horizontal = parseInt(data.horizontal);
        vertical = parseInt(data.vertical);
        rowsCount = parseInt(data.rowsCount);

        layout = data.direction;


        autoDistributionNodes();

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

  function autoDistributionNodes() {
    // Clear existing layout
    //myDiagram.layout = null;

    // Set up new layout based on user input
    // if (layout === 'vertical') {
    //   myDiagram.layout = makeLayout(true);
    // } else {
    //   myDiagram.layout = makeLayout(false);
    // }

    var viewportBounds = myDiagram.viewportBounds;
    var diagramWidth = viewportBounds.width;
    var diagramHeight = viewportBounds.height;

    // Iterate over all nodes
    myDiagram.nodes.each(function (node) {
      // Start a transaction
      myDiagram.startTransaction('autoDistributionNodes');

      var key = node.key;
      var data = myDiagram.model.findNodeDataForKey(key);

      // Update marginLeft, marginTop, marginRight, and marginBottom
      myDiagram.model.setDataProperty(data, "marginLeft", marginLeft);
      myDiagram.model.setDataProperty(data, "marginTop", marginTop);
      myDiagram.model.setDataProperty(data, "marginRight", marginRight);
      myDiagram.model.setDataProperty(data, "marginBottom", marginBottom);

      // Update width and height based on layout direction
      if (isVertical == 'v') {

        myDiagram.model.setDataProperty(data, "height", (diagramHeight - 10) - marginTop - marginBottom);

        myDiagram.model.setDataProperty(data, "width", (diagramWidth / borderCount) - 13 - marginLeft - marginRight);
      } else {

        myDiagram.model.setDataProperty(data, "height", diagramWidth - 30 - marginTop - marginBottom);

        myDiagram.model.setDataProperty(data, "width", (diagramHeight / borderCount) - 13 - marginLeft - marginRight);
      }



      node.updateTargetBindings();

      // Commit the transaction
      myDiagram.commitTransaction('autoDistributionNodes');
    });

    // Adjust spacing between nodes horizontally and vertically
    myDiagram.layout.spacing = new go.Size(horizontal, vertical);
    if (layout === 'vertical') {
      currentLayout = makeLayout(true, rowsCount);
    } else {
      currentLayout = makeLayout(false, rowsCount);
    }
    myDiagram.layout = currentLayout;
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

