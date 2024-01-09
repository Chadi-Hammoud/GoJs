

import { $, myDiagram } from "./Diagram.mjs";

import { slotDesigner } from "./slotDesigner.mjs";

myDiagram.nodeTemplateMap.add(slotDesigner);
function init() {

  let borderCount = parseInt(prompt("number of slots"));
  let startIndex = parseInt(prompt("start Index, 0 or 1"));
  let isVertical = prompt("is vertical?, v ");


  // Clear existing nodes
  myDiagram.model = new go.GraphLinksModel();

  let indexSlot = 0;

  function addSlot() {


    let defaultValue = (startIndex === NaN ? startIndex : 0);

    // for (let i = 1; i <= borderCount; i++) {
    //   addSlot();
    // }
    let tempVal = 0.0;
    for (let i = 1; i <= borderCount; i++) {

      let dis = 900.0 / borderCount
      if (isVertical !== 'v') {

        //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 120, height: 300, text: `${startIndex}:${indexSlot}` });
        myDiagram.model.addNodeData({
          key: `port${defaultValue}`,
          category: "slot",
          width: 2000,
          height: dis,
          text: `${defaultValue}:${indexSlot}`,
          location: `0 ${tempVal}`,
          visible: true,
          rear: null || 0,
        });



      } else {
        dis = 2000.0 / borderCount
        myDiagram.model.addNodeData({
          key: `port${startIndex}`,
          category: "slot",
          width: dis,
          height: 900,
          text: `${defaultValue}:${indexSlot}`,
          location: `${tempVal} 0`,
          visible: true,
          rear: null || 0,
        });
        //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 300, height: 120, text: `${startIndex}:${indexSlot}` });
      }
      tempVal += dis;
      defaultValue++;
    }

    // fitNodesOnScreen();
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
  let isbackMode;
  let rear;


  let selectedNode;
  myDiagram.addDiagramListener("ChangedSelection", function (e) {
    // Get the selected node
    selectedNode = e.subject.first();
  });


  document.querySelector('#autoDistributionForm').addEventListener('submit', function (event) {
    event.preventDefault();

    top = parseInt(document.getElementById("marginTop").value);
    right = parseInt(document.getElementById("marginRight").value);
    bottom = parseInt(document.getElementById("marginBottom").value);
    left = parseInt(document.getElementById("marginLeft").value);

    horizontal = parseInt(document.getElementById("horizontal").value);
    vertical = parseInt(document.getElementById("vertical").value);
    rows = parseInt(document.getElementById("rowsCount").value);

    distribution = document.getElementById("direction").value;
    startPoint = document.getElementById("startPoint").value;


    autoDistributionNodes(rows, left, right, horizontal, vertical, distribution, startPoint, top, bottom);
  });

  document.querySelector('#autoResizeForm').addEventListener('submit', function (event) {
    event.preventDefault();
    width1 = parseFloat(document.getElementById("width1").value, 10);
    height1 = parseFloat(document.getElementById("height1").value, 10);
    autoResizePorts();
  });


  document.querySelector('#addSlotForm').addEventListener('submit', function (event) {
    event.preventDefault();
    addSlotIndex = parseInt(document.getElementById("addSlotIndex").value);
    addIndexOnSlot = parseInt(document.getElementById("addIndexOnSlot").value);
    document.getElementById("added").style.display = "block";
    checkIndex();
  });

  let displayBackModeChB;
  document.querySelector('#displayBackModeChB').addEventListener('click', function (event) {
    isbackMode = document.getElementById("displayBackModeChB").checked;
    displayBackMode(isbackMode);

  });

  let backSLotChB;

  document.querySelector('#configureSlotForm').addEventListener("submit", function (event) {
    event.preventDefault();
    slotIndex = parseInt(document.getElementById("slotIndex").value);
    indexOnSlot = parseInt(document.getElementById("indexOnSlot").value);
    X = parseFloat(document.getElementById("X").value, 10);
    Y = parseFloat(document.getElementById("Y").value, 10);
    width = parseFloat(document.getElementById("width").value, 10);
    height = parseFloat(document.getElementById("height").value, 10);
    backSLotChB = document.getElementById("backSLotChB").checked;
    displayBackModeChB = document.getElementById("displayBackModeChB").checked;


    updateAttributesFromFields();

  });




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

    })

    rear = backSLotChB === true ? 1 : 0;


    if (selectedNode instanceof go.Node) {
      var type = selectedNode.data.category;
      if (type === "slot") {
        selectedNode.data.rear = rear;
        backSLotChB = false;
        isbackMode = displayBackModeChB;
        displayBackMode(isbackMode);
      }
    };
  }

  function updateBoardTypePortFromModel(data, x, y) {
    var viewportBounds = myDiagram.viewportBounds;
    var diagramWidth = viewportBounds.width;
    var diagramHeight = viewportBounds.height;

    let location = `${parseInt(x * diagramWidth / 2000)} ${parseInt(y * diagramHeight / 900)}`;
    let width = parseInt(data.width * diagramWidth / 2000);
    let height = parseInt(data.height * diagramHeight / 900);
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
      myDiagram.model.addNodeData({
        key: `port${startIndex}`,
        category: "slot",
        width: 120,
        height: 120,
        text: `${addSlotIndex}:${addIndexOnSlot}`,
        location: `0 0`,
        visible: true,
        rear: null || 0,
      });
      //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 120, height: 120, text: `${addSlotIndex}:${addIndexOnSlot}` });
      startIndex++;
      // Commit the transaction
      myDiagram.commitTransaction('checkIndex');
    }

  }

  var viewportBounds = myDiagram.viewportBounds;
  var diagramWidth = viewportBounds.width;
  var diagramHeight = viewportBounds.height;

  function updateBoardTypePort(x, y, portWidth, portHeight, data) {
    let xPercentage = ((parseFloat((x * 2000) / diagramWidth)));
    let yPercentage = ((parseFloat(y * 900) / diagramHeight));
    let widthPercentage = ((parseFloat(portWidth * 2000) / diagramWidth));
    let heightPercentage = ((parseFloat(portHeight * 900) / diagramHeight));

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

  function displayBackMode(isbackMode) {

    myDiagram.nodes.each(function (node) {

      var key = node.key;
      var data = myDiagram.model.findNodeDataForKey(key);

      let bacKS = data.rear;

      if (isbackMode) {
        if (bacKS == 0 || bacKS == null) {
          myDiagram.model.setDataProperty(data, "visible", false);

        } else {
          myDiagram.model.setDataProperty(data, "visible", true);
        }
      } else {
        if (bacKS == null || bacKS == 0) {
          myDiagram.model.setDataProperty(data, "visible", true);
        } else if (bacKS == 1) {
          myDiagram.model.setDataProperty(data, "visible", false);
        } else {
          myDiagram.model.setDataProperty(data, "visible", true);
        }
      }



    },
    )
    return;
  }
  displayBackMode(false);



  function nodeMoved(e) {
    var node = e.subject.first();

    // If a node is selected
    if (node instanceof go.Node) {
      var type = node.data.category;
      if (type === "slot") {
        // Get the node's location, width, and height
        //var key = node.data.key;
        let text = node.data.text;
        let parts = text.split(':');
        let slotIndex = parts[0];
        let indexOnSlot = parts[1];

        let loc = node.location;
        let width = node.data.width;
        let height = node.data.height;
        let x = loc.x;
        let y = loc.y;

        let bacKslotChecked = node.data.rear;


        document.getElementById('slotIndex').value = slotIndex;
        document.getElementById('indexOnSlot').value = indexOnSlot;
        document.getElementById('X').value = x;
        document.getElementById('Y').value = y;
        document.getElementById('width').value = width;
        document.getElementById('height').value = height;
        document.getElementById('backSLotChB').checked = bacKslotChecked;

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



document.getElementById("putSlotOnShelf").addEventListener("click", init);


