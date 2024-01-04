
import { $, myDiagram } from "../../BoardDesigner001/Js/Diagram.mjs";


let popupWindow;

function init() {

  let borderCount = parseInt(prompt("boards count"));
  let startIndex = parseInt(prompt("start Index, 0 or 1"));
  let isVertical = prompt("is vertical?, v ");

  let divWidth = 2000;
  let divHeight = 900;

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




  myDiagram.nodeTemplateMap.add("board",
    $(go.Node, "Auto",
      new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
      new go.Binding("visible", "visible", null, null),
      new go.Binding("rear", "rear", null, null),

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
        new go.Binding("marginLeft", "marginLeft").makeTwoWay(),
        new go.Binding("marginTop", "marginTop").makeTwoWay(),
        new go.Binding("marginRight", "marginRight").makeTwoWay(),
        new go.Binding("marginBottom", "marginBottom").makeTwoWay(),

        new go.Binding("width", "width", null, null),
        new go.Binding("height", "height", null, null),

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

        $(go.Picture, {
          background: "white",
          name: "PANEL",
          stretch: go.GraphObject.Fill,
        },
          new go.Binding("source", "source"),
          new go.Binding("fill", "color"),
          new go.Binding("height", "height", null, null),
        ),
      ),
    ),

  );








  // Clear existing nodes
  myDiagram.model = new go.GraphLinksModel();

  let indexSlot = 0;
  let parts = [];

function modifyPart(src, backWidth, backHeight) {
  let part = $(go.Part, {
    locationSpot: go.Spot.Center,
    layerName: "Background",
    position: new go.Point(-10, -10),
    selectable: false,
    pickable: false,
    movable: false,
  }, 
  $(go.Picture, src || "", {
    background: "white",
    stretch: go.GraphObject.Fill,
    width: backWidth + 20,
    height: backHeight + 20,
  }));

  if (parts.length > 0) {
    // Clear existing parts
    parts.forEach(existingPart => myDiagram.remove(existingPart));
    parts.length = 0;
  }

  parts.push(part);
  myDiagram.add(part); // Add the new part to the diagram
  return part;
}


  function addPort() {
    let defaultValue = (startIndex === NaN ? startIndex : 0);


    let tempVal = 0.0;
    let backWidth = 0;
    let backHeight = 0;
    for (let i = 1; i <= borderCount; i++) {

      let dis = divHeight / borderCount
      if (isVertical !== 'v') {

        backWidth = divWidth;
        myDiagram.model.addNodeData({
          key: `port${defaultValue}`,
          category: "board",
          width: divWidth,
          height: dis,
          text: `${defaultValue}:${indexSlot}`,
          location: `0 ${tempVal}`,
          visible: true,
          source: "http://127.0.0.1:5500/PortDesigner/images/port.svg",
        });

        backHeight += dis;

      } else {

        backHeight = divHeight;

        myDiagram.model.addNodeData({
          key: `port${startIndex}`,
          category: "board",
          width: dis,
          height: divHeight,
          text: `${defaultValue}:${indexSlot}`,
          location: `${tempVal} 0`,
          visible: true,
          source: "http://127.0.0.1:5500/PortDesigner/images/port.svg",
        });

        backWidth += dis;
        //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 300, height: 120, text: `${startIndex}:${indexSlot}` });
      }
      tempVal += dis;
      defaultValue++;
    }
    let src;
    document.getElementById("addBackround").addEventListener("click", e => {
      document.getElementById("showBacks").style.display = "block";
      let back = document.getElementById("back1");
      let back1 = document.getElementById("back2");

      back.addEventListener("click", event => {

        src = back.currentSrc;

        let part = modifyPart(src, backWidth, backHeight);
        myDiagram.redraw(part);
      });

      back1.addEventListener("click", event => {

        src = back1.currentSrc;

        let part = modifyPart(src, backWidth, backHeight);
        myDiagram.redraw(part);
      });

    });

    document.getElementById("removeBackround").addEventListener("click", e=> {
      let part = modifyPart(src, backWidth, backHeight);
      myDiagram.remove(part); 
    });


    let part = modifyPart(src, backWidth, backHeight);
    myDiagram.redraw(part);


  }

  addPort();



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
        updateAttributesFromFields();

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



  function updateAttributesFromFields() {


    let nodeText = slotIndex + ":" + indexOnSlot;

    // Iterate over all nodes
    myDiagram.nodes.each(function (node) {
      var textBlock = node.findObject('boardTextblock');

      if (nodeText === textBlock.text) {
        // Start a transaction
        myDiagram.startTransaction('update properties');

        var key = node.key;
        var data = myDiagram.model.findNodeDataForKey(key);
        let location = `${X} ${Y}`;

        myDiagram.model.setDataProperty(data, "width", width);
        myDiagram.model.setDataProperty(data, "height", height);
        myDiagram.model.setDataProperty(data, "location", location);


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

    let location = `${parseInt(x * diagramWidth / divWidth)} ${parseInt(y * diagramHeight / divHeight)}`;
    let width = parseInt(data.width * diagramWidth / divWidth);
    let height = parseInt(data.height * diagramHeight / divHeight);
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

  var viewportBounds = myDiagram.viewportBounds;
  var diagramWidth = viewportBounds.width;
  var diagramHeight = viewportBounds.height;

  function updateBoardTypePort(x, y, portWidth, portHeight, data) {
    let xPercentage = ((parseFloat((x * divWidth) / diagramWidth)));
    let yPercentage = ((parseFloat(y * divHeight) / diagramHeight));
    let widthPercentage = ((parseFloat(portWidth * divWidth) / diagramWidth));
    let heightPercentage = ((parseFloat(portHeight * divHeight) / diagramHeight));

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
      let i = 0;
      // Iterate over all nodes
      myDiagram.nodes.each(function (node) {

        var key = node.key;
        var data = myDiagram.model.findNodeDataForKey(key);

        let x = 0, y = 0;

        // default calculation for top left
        let columnIndex = distribution === "horizontal" ? parseInt(((i % nbColumns) + 1)) : parseInt(((i / nbRows) + 1));
        let rowIndex = distribution === "horizontal" ? parseInt(((i / nbColumns) + 1)) : parseInt(((i % nbRows) + 1));

        if ("top-right" === startPoint) {
          columnIndex = nbColumns - columnIndex + 1;
        }
        else if ("bottom-left" === startPoint) {
          rowIndex = nbRows - rowIndex + 1;
        }
        else if ("bottom-right" === startPoint) {
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





  function nodeMoved(e) {
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
  }




  // Add a listener for the ChangedSelection event
  myDiagram.addDiagramListener("ChangedSelection", function (e) {
    nodeMoved(e);
  });


  // Add a listener for the SelectionChanged event
  myDiagram.addDiagramListener("SelectionMoved", function (e) {
    nodeMoved(e);
  });

}


window.addEventListener('DOMContentLoaded', init);

