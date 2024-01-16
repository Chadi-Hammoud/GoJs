

import { $, myDiagram } from "./Diagram.mjs";

import { slotDesigner } from "../../CabinetType/Js/NodeTemplate.mjs";
import { Shelf } from "./Shelf.mjs";
import { ShelfTypeSlot } from "./ShelfTypeSlot.mjs";
import { ShelfType } from "./ShelfType.mjs";

myDiagram.nodeTemplateMap.add(slotDesigner);
let nodeExists = false;


let shelfType = new ShelfType();
let shelf = new Shelf();
let shelfTypeSlot;
function init() {

  let borderCount = parseInt(prompt("number of slots"));
  let slotStartingIndex = parseInt(prompt("slot starting index"));
  let isVertical = prompt("is vertical?, v ");


  // Clear existing nodes
  myDiagram.model = new go.GraphLinksModel();

  let indexSlot = 0;


  // let defaultValue = (startIndex === NaN ? startIndex : 0);

  let tempVal = 0.0;
  let addedSlotKey = 0;
  shelfType.slotStartingIndex = slotStartingIndex;
  let defaultValue = (isNaN(shelfType.slotStartingIndex) ? 0 : shelfType.slotStartingIndex);



  shelfType.numberOfSlot = borderCount;

  let numberSlot = parseInt(shelfType.numberOfSlot);
  let tempArr = [numberSlot];
  for (let i = 0; i < numberSlot; i++) {

    tempArr[i] = addSlot(shelfType, i + defaultValue, 0, 0, false)
  }



  // fitNodesOnScreen();

  function addSlot(shelfType, slot, indexOnSlot, rearShelf, withRepaint) {
    shelfTypeSlot = new ShelfTypeSlot();
    let dis = 900.0 / numberSlot;

    shelfTypeSlot.shelfTypeId = (shelf !== null ? shelf.id : null);
    addedSlotKey = `port${shelfTypeSlot.shelfTypeId}`;
    if (isVertical !== 'v') {
      shelfTypeSlot.widthPercentage = 2000;
      shelfTypeSlot.heightPercentage = dis;
      shelfTypeSlot.xPercentage = 0.0;
      shelfTypeSlot.yPercentage = tempVal;
      shelfTypeSlot.rearShelf = rearShelf;
      shelfTypeSlot.indexOnSlot = indexOnSlot;
      shelfTypeSlot.slot = slot;
      shelfTypeSlot.rearShelf = null || 0;
      //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 120, height: 300, text: `${startIndex}:${indexSlot}` });

      myDiagram.model.addNodeData({
        key: addedSlotKey,
        category: "slot",
        width: shelfTypeSlot.widthPercentage,
        height: shelfTypeSlot.heightPercentage,
        text: `${shelfTypeSlot.slot}:${shelfTypeSlot.indexOnSlot}`,
        location: `${shelfTypeSlot.xPercentage} ${shelfTypeSlot.yPercentage}`,
        slot: shelfTypeSlot.slot,
        visible: true,
        rear: shelfTypeSlot.rearShelf,
        indexOnSlot: shelfTypeSlot.indexOnSlot,
      });


    } else {
      dis = 2000.0 / numberSlot;

      shelfTypeSlot.widthPercentage = dis;
      shelfTypeSlot.heightPercentage = 900;
      shelfTypeSlot.xPercentage = tempVal;
      shelfTypeSlot.yPercentage = 0.0;
      shelfTypeSlot.rearShelf = rearShelf;
      shelfTypeSlot.indexOnSlot = indexOnSlot;
      shelfTypeSlot.slot = slot;


      myDiagram.model.addNodeData({
        key: addedSlotKey,
        category: "slot",
        width: dis,
        height: 900,
        text: `${shelfTypeSlot.slot}:${shelfTypeSlot.indexOnSlot}`,
        location: `${shelfTypeSlot.xPercentage} ${shelfTypeSlot.yPercentage}`,
        slot: shelfTypeSlot.slot,
        visible: true,
        rear: shelfTypeSlot.rearShelf,
        indexOnSlot: shelfTypeSlot.indexOnSlot,
      });
      //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 300, height: 120, text: `${startIndex}:${indexSlot}` });
    }


    shelfType.getShelfTypeSlots().add(shelfTypeSlot);

    tempVal += dis;



  }

  function removeSlot() {
    let slot = myDiagram.selection.first(); // Get the first selected node

    let slotText;
    for (let slotOnShelf of shelfType.getShelfTypeSlots()) {
      slotText = `${slotOnShelf.slot}:${slotOnShelf.indexOnSlot}`;
      if (slotText === slot.data.text) {
        shelfType.getShelfTypeSlots().delete(slotOnShelf);
        break;
      }
    }

    if (slot) {
      myDiagram.startTransaction("deleteSlot");
      myDiagram.model.removeNodeData(slot.data);
      myDiagram.commitTransaction("deleteSlot");
    }
  }
  document.getElementById("removeSlotLink").addEventListener("click", removeSlot);


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
      let textBlock = node.findObject('boardTextblock');

      if (nodeText === textBlock.text) {
        // Start a transaction
        myDiagram.startTransaction('update properties');

        let key = node.key;
        let data = myDiagram.model.findNodeDataForKey(key);
        let location = `${X} ${Y}`;

        myDiagram.model.setDataProperty(data, "width", width);
        myDiagram.model.setDataProperty(data, "height", height);
        myDiagram.model.setDataProperty(data, "location", location);

        shelfTypeSlot.heightPercentage = height;
        shelfTypeSlot.widthPercentage = width;
        shelfTypeSlot.xPercentage = X;
        shelfTypeSlot.yPercentage = Y;


        node.updateTargetBindings();
        // Commit the transaction
        myDiagram.commitTransaction('update properties');
      }

    })

    rear = backSLotChB === true ? 1 : 0;


    if (selectedNode instanceof go.Node) {
      let type = selectedNode.data.category;
      if (type === "slot") {
        selectedNode.data.rear = rear;
        shelfTypeSlot.rearShelf = selectedNode.data.rear;
        backSLotChB = false;
        isbackMode = displayBackModeChB;
        displayBackMode(isbackMode);
      }
    };
  }

  function updateBoardTypePortFromModel(data, x, y) {
    let viewportBounds = myDiagram.viewportBounds;
    let diagramWidth = viewportBounds.width;
    let diagramHeight = viewportBounds.height;

    let location = `${parseInt(x * diagramWidth / 2000)} ${parseInt(y * diagramHeight / 900)}`;
    let width = parseInt(data.width * diagramWidth / 2000);
    let height = parseInt(data.height * diagramHeight / 900);
    myDiagram.model.setDataProperty(data, "width", width);
    myDiagram.model.setDataProperty(data, "height", height);
    myDiagram.model.setDataProperty(data, "location", location);

    shelfTypeSlot.heightPercentage = height;
    shelfTypeSlot.widthPercentage = width;
    shelfTypeSlot.xPercentage = X;
    shelfTypeSlot.yPercentage = Y;


  }

  function autoResizePorts() {
    let x, y;
    myDiagram.nodes.each(function (node) {
      // Start a transaction
      myDiagram.startTransaction('update size');

      let key = node.key;
      let data = myDiagram.model.findNodeDataForKey(key);
      let parts = data.location.split(' ');
      x = parts[0];
      y = parts[1];
      myDiagram.model.setDataProperty(data, "width", width1);
      myDiagram.model.setDataProperty(data, "height", height1);

      shelfTypeSlot.heightPercentage = height1;
      shelfTypeSlot.widthPercentage = width1;

      updateBoardTypePortFromModel(data, x, y);

      console.log(data);
      node.updateTargetBindings();
      // Commit the transaction
      myDiagram.commitTransaction('update size');

    });
    displayData();

  }


  function checkIndex() {
    let nodeText = addSlotIndex + ":" + addIndexOnSlot;

    // Iterate over all nodes
    myDiagram.nodes.each(function (node) {
      let textBlock = node.findObject('boardTextblock');
      if (nodeText === textBlock.text) {
        // A node with the same text exists
        nodeExists = true;
      }
    });
    addNode(nodeExists);

  }

  function addNode(nodeExists) {
    if (!nodeExists) {
      document.getElementById("added").innerHTML = "added";
      let bckSlot = document.getElementById('bslot').checked
      // Start a transaction
      myDiagram.startTransaction('checkIndex');

      shelfTypeSlot.slot = addSlotIndex;
      shelfTypeSlot.indexOnSlot = addIndexOnSlot;

      let slot = isNaN(shelfTypeSlot.slot) ? 0 : addSlotIndex;
      let indexOnSlot = isNaN(shelfTypeSlot.indexOnSlot) ? 0 : addIndexOnSlot;
      let rearShelf = bckSlot;

      shelfTypeSlot.xPercentage = 0.0;
      shelfTypeSlot.yPercentage = 0.0;
      shelfTypeSlot.heightPercentage = 120;
      shelfTypeSlot.widthPercentage = 120;


      if (rearShelf) {
        shelfTypeSlot.rearShelf = 1;
      } else {
        shelfTypeSlot.rearShelf = 0;
      }
      shelfTypeSlot.indexOnSlot = indexOnSlot;
      shelfTypeSlot.slot = slot;

      myDiagram.model.addNodeData({
        key: addedSlotKey,
        category: "slot",
        width: shelfTypeSlot.widthPercentage,
        height: shelfTypeSlot.heightPercentage,
        text: `${shelfTypeSlot.slot}:${shelfTypeSlot.indexOnSlot}`,
        location: `${shelfTypeSlot.xPercentage} ${shelfTypeSlot.yPercentage}`,
        slot: slot,
        visible: true,
        rear: shelfTypeSlot.rearShelf,
        indexOnSlot: indexOnSlot,
      });

      shelfType.getShelfTypeSlots().add(shelfTypeSlot);
      numberSlot += 1;
      // Commit the transaction
      myDiagram.commitTransaction('checkIndex');
    } else {
      document.getElementById("added").innerHTML = "this slot index is already exist, please choose another one";

    }
    document.getElementById("added").style.color = "red";
    displayData();
  }



  function updateBoardTypePort(x, y, portWidth, portHeight, data) {
    let viewportBounds = myDiagram.viewportBounds;
    let diagramWidth = viewportBounds.width;
    let diagramHeight = viewportBounds.height;

    let xPercentage = ((parseFloat((x * 2000) / diagramWidth)));
    let yPercentage = ((parseFloat(y * 900) / diagramHeight));
    let widthPercentage = ((parseFloat(portWidth * 2000) / diagramWidth));
    let heightPercentage = ((parseFloat(portHeight * 900) / diagramHeight));

    let location = `${xPercentage} ${yPercentage}`;
    myDiagram.model.setDataProperty(data, "location", location);
    myDiagram.model.setDataProperty(data, "width", widthPercentage);
    myDiagram.model.setDataProperty(data, "height", heightPercentage);

    shelfTypeSlot.heightPercentage = heightPercentage;
    shelfTypeSlot.widthPercentage = widthPercentage;
    shelfTypeSlot.xPercentage = xPercentage;
    shelfTypeSlot.yPercentage = yPercentage;

    displayData();
  }
  function applyChanges(rows, left, right, horizontal, vertical, distribution, startPoint, top, bottom) {
    let viewportBounds = myDiagram.viewportBounds;
    let diagramWidth = viewportBounds.width;
    let diagramHeight = viewportBounds.height;
    if (numberSlot > 0) {
      let nbRows = parseInt(rows), nbColumns = parseInt(Math.ceil(parseFloat(numberSlot) / nbRows));
      let portWidth = parseInt((diagramWidth - (left + right + (horizontal * (nbColumns - 1)))) / nbColumns);
      let portHeight = parseInt((diagramHeight - (top + bottom + (vertical * (nbRows - 1)))) / nbRows);
      let i = 0;
      // Iterate over all nodes
      myDiagram.nodes.each(function (node) {

        let key = node.key;
        let data = myDiagram.model.findNodeDataForKey(key);

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

      let key = node.key;
      let data = myDiagram.model.findNodeDataForKey(key);

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

      displayData();

    },
    )
    return;
  }
  displayBackMode(false);



  function nodeMoved(e) {
    let node = e.subject.first();

    // If a node is selected
    if (node instanceof go.Node) {
      let type = node.data.category;
      if (type === "slot") {
        // Get the node's location, width, and height
        //let key = node.data.key;
        let text = node.data.text;
        let parts = text.split(':');
        let slotIndex = parts[0];
        let indexOnSlot = parts[1];


        let loc = node.data.location;
        let locPart = loc.split(' ');
        let width = node.data.width;
        let height = node.data.height;
        let x = locPart[0];
        let y = locPart[1];

        let bacKslotChecked = node.data.rear;


        document.getElementById('slotIndex').value = slotIndex;
        document.getElementById('indexOnSlot').value = indexOnSlot;
        document.getElementById('X').value = x;
        document.getElementById('Y').value = y;
        document.getElementById('width').value = width;
        document.getElementById('height').value = height;
        document.getElementById('backSLotChB').checked = bacKslotChecked;


        myDiagram.model.setDataProperty(node.data, "width", width);
        myDiagram.model.setDataProperty(node.data, "height", height);
        myDiagram.model.setDataProperty(node.data, "location", loc);

        let slotText;
        for (let slot of shelfType.getShelfTypeSlots()) {
          slotText = `${slot.slot}:${slot.indexOnSlot}`;
          if (slotText === text) {
            shelfTypeSlot.xPercentage = x;
            shelfTypeSlot.yPercentage = y;
            shelfTypeSlot.widthPercentage = width;
            shelfTypeSlot.heightPercentage = height;
          }
        }


      }
      displayData();
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

  function displayData() {
    myDiagram.nodes.each(function (node) {
      console.log(node.data)
    });
  }




}



document.getElementById("putSlotOnShelf").addEventListener("click", init);


export { shelf, shelfTypeSlot, shelfType }
