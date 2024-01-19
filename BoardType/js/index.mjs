
import { $, myDiagram } from "../../ShelfType/Js/Diagram.mjs";

import { BoardType } from "./BoardType.mjs";
import { MotherBoardTypeSlot } from "./MotherBoardTypeSlot.mjs";
import { BoardTypePort } from "./BoardTypePort.mjs";

import { slotDesigner, portDesigner } from "../../CabinetType/Js/NodeTemplate.mjs";


let boardType = new BoardType();

let boardTypePort;

let XSCALE = 5.0;
let YSCALE = 2.5;



myDiagram.nodeTemplateMap.add(slotDesigner);
myDiagram.nodeTemplateMap.add(portDesigner);



let diagramWidth = 434;
let diagramHeight = 261;


let motherSlots;

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


function autoDiPanel() {
  top = parseInt(document.getElementById("marginTop").value);
  right = parseInt(document.getElementById("marginRight").value);
  bottom = parseInt(document.getElementById("marginBottom").value);
  left = parseInt(document.getElementById("marginLeft").value);

  horizontal = parseInt(document.getElementById("horizontal").value);
  vertical = parseInt(document.getElementById("vertical").value);
  rows = parseInt(document.getElementById("rowsCount").value);

  distribution = document.getElementById("direction").value;
  startPoint = document.getElementById("startPoint").value;

}

function autoRPanel() {
  width1 = parseFloat(document.getElementById("width1").value, 10);
  height1 = parseFloat(document.getElementById("height1").value, 10);
}

function configPanel() {
  slotIndex = parseInt(document.getElementById("slotIndex").value);
  indexOnSlot = parseInt(document.getElementById("indexOnSlot").value);
  X = parseFloat(document.getElementById("X").value, 10);
  Y = parseFloat(document.getElementById("Y").value, 10);
  width = parseFloat(document.getElementById("width").value, 10);
  height = parseFloat(document.getElementById("height").value, 10);
}


let parts = [];

function modifyPart(src, backWidth, backHeight) {
  let part = $(go.Part, {
    locationSpot: go.Spot.Center,
    layerName: "Background",
    position: new go.Point(-5, 0),
    selectable: false,
    pickable: false,
    movable: false,
  },
    $(go.Picture, src || "", {

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
  myDiagram.add(part); // Add the new part to divWidtautothe diagram
  return part;
}

function init() {
  let borderCount = parseInt(prompt("boards count"));
  let startIndex = parseInt(prompt("start Index, 0 or 1"));
  // let isVertical = prompt("is vertical?, v ");

  let compPerList = [];
  for (let i = 0; i < borderCount; i++) {
    boardTypePort = new BoardTypePort();

    boardType.getBoardTypePort().add(boardTypePort);
    compPerList.push(boardTypePort);
  }


  // window.divWidth = divWidth;
  // window.divHeight = divHeight;


  myDiagram.model = new go.GraphLinksModel();

  let indexSlot = 0;



  // function addPort() {
  //   let defaultValue = (startIndex === NaN ? startIndex : 0);
  //   let tempVal = 0.0;
  //   let backWidth = 0;
  //   let backHeight = 0;
  //   for (let i = 1; i <= borderCount; i++) {

  //     let dis = divHeight / borderCount
  //     if (isVertical !== 'v') {

  //       backWidth = divWidth;
  //       myDiagram.model.addNodeData({
  //         key: `port${defaultValue}`,
  //         category: "port",
  //         width: divWidth,
  //         height: dis,
  //         text: `${defaultValue}:${indexSlot}`,
  //         location: `0 ${tempVal}`,
  //         visible: true,
  //         source: "http://127.0.0.1:5500/BoardType/images/port.svg",
  //       });

  //       backHeight += dis;

  //     } else {

  //       backHeight = divHeight;

  //       myDiagram.model.addNodeData({
  //         key: `port${startIndex}`,
  //         category: "port",
  //         width: dis,
  //         height: divHeight,
  //         text: `${defaultValue}:${indexSlot}`,
  //         location: `${tempVal} 0`,
  //         visible: true,
  //         source: "http://127.0.0.1:5500/BoardType/images/port.svg",
  //       });

  //       backWidth += dis;
  //       //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 300, height: 120, text: `${startIndex}:${indexSlot}` });
  //     }
  //     tempVal += dis;
  //     defaultValue++;

  //   }

  //   let src;

  //   let back = document.getElementById("back1");
  //   let back1 = document.getElementById("back2");
  //   let back2 = document.getElementById("back3");

  //   back.addEventListener("click", event => {

  //     src = back.currentSrc;

  //     let part = modifyPart(src, backWidth, backHeight);
  //     myDiagram.redraw(part);
  //   });

  //   back1.addEventListener("click", event => {

  //     src = back1.currentSrc;

  //     let part = modifyPart(src, backWidth, backHeight);
  //     myDiagram.redraw(part);
  //   });

  //   back2.addEventListener("click", event => {

  //     let part = modifyPart(src, backWidth, backHeight);
  //     myDiagram.remove(part);
  //   });





  //   let part = modifyPart(src, backWidth, backHeight);
  //   myDiagram.redraw(part);


  // }

  let x = 0.0;
  let dis = 1.0;
  let backWidth = 0;
  let backHeight = 0;
  let length = (compPerList.length - 1);
  let comWidth = 5 * ((100.0 - length) / (length === 0 ? 1 : length));

  for (let compPer of compPerList) {
    if (compPer.xPercentage === undefined || compPer.yPercentage === undefined) {
      x += dis;
      compPer.widthPercentage = comWidth;
      compPer.xPercentage = x;
      compPer.yPercentage = 10.0;
      compPer.heightPercentage = 208;
      compPer.caption = `${startIndex}:${0}`;
      x += comWidth;
      startIndex++;
      if (backHeight < compPer.heightPercentage) {
        backHeight = compPer.heightPercentage;
      }

      backWidth += compPer.widthPercentage;
    }
    addBoardTypePort(compPer);

  }



  function addBoardTypePort(boardTypePort) {
    boardTypePort.widthPercentage = (isNaN(boardTypePort.widthPercentage) ? 10 : boardTypePort.widthPercentage);
    boardTypePort.heightPercentage = (isNaN(boardTypePort.heightPercentage) ? 10 : boardTypePort.heightPercentage);
    boardTypePort.xPercentage = (isNaN(boardTypePort.xPercentage) ? 10 : boardTypePort.xPercentage);
    boardTypePort.yPercentage = (isNaN(boardTypePort.yPercentage) ? 10 : boardTypePort.yPercentage);

    myDiagram.model.addNodeData({
      key: `port${startIndex}`,
      category: "port",
      width: boardTypePort.widthPercentage,
      height: boardTypePort.heightPercentage,
      text: `${boardTypePort.caption}`,
      location: `${boardTypePort.xPercentage} ${boardTypePort.yPercentage}`,
      visible: true,
      source: "http://127.0.0.1:5500/BoardType/images/port00.svg",

    });

    let src;

    let back = document.getElementById("back1");
    let back1 = document.getElementById("back2");
    let back2 = document.getElementById("back3");

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

    back2.addEventListener("click", event => {

      let part = modifyPart(src, backWidth, backHeight);
      myDiagram.remove(part);
    });





    let part = modifyPart(src, backWidth, backHeight);
    myDiagram.redraw(part);

  }







  document.querySelector('#autoDistributionForm').addEventListener('submit', function (event) {
    event.preventDefault();

    autoDiPanel();
    autoDistributionNodes(rows, left, right, horizontal, vertical, distribution, startPoint, top, bottom);
  });


  document.querySelector('#autoResizeForm').addEventListener('submit', function (event) {
    event.preventDefault();
    autoRPanel();
    autoResizePorts();
  });

  document.querySelector('#configureSlotForm').addEventListener("submit", function (event) {
    event.preventDefault();
    configPanel();
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

        updateBoardTypePortFromModel(data, width, height, X, Y)

        node.updateTargetBindings();
        // Commit the transaction
        myDiagram.commitTransaction('update properties');
      }
    });


  }

  function updateBoardTypePortFromModel(data, newWidth, newHeight, x, y) {

    let location = `${ parseInt(x * diagramWidth / 100)} ${ parseInt(y * diagramHeight / 100)}`;
    let width =  parseInt(newWidth * diagramWidth / 100);
    let height =  parseInt(newHeight * diagramWidth / 100);

    myDiagram.model.setDataProperty(data, "width", width);
    myDiagram.model.setDataProperty(data, "height", height);
    myDiagram.model.setDataProperty(data, "location", location);

    for (let comper of compPerList) {
      if (comper.caption === data.text) {
        comper.widthPercentage = width;
        comper.heightPercentage = height;
        comper.xPercentage = location.split(' ')[0];
        comper.yPercentage = location.split(' ')[1];
      }
    }
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

      updateBoardTypePortFromModel(data, width1, height1, x, y);

      console.log(data);
      node.updateTargetBindings();
      // Commit the transaction
      myDiagram.commitTransaction('update size');

    });

  }



  let flag = false;
  document.getElementById("scale").addEventListener("click", function (e) {
    let zoomFactor = myDiagram.scale;
    console.log("Current Zoom Factor: " + zoomFactor);


    if (flag) {
      myDiagram.scale = 1.490455443789063;
      flag = false;
    } else {

      let totalBounds = myDiagram.computePartsBounds(myDiagram.nodes);
      let targetBounds = myDiagram.viewportBounds;
      // Step 2: Get the dimensions of the target bounds
      let targetWidth = targetBounds.width;
      let targetHeight = targetBounds.height;

      // Step 3: Calculate scale factors for x and y directions
      let xScale = targetWidth / totalBounds.width;
      let yScale = targetHeight / totalBounds.height;

      // Use the minimum of the two scale factors to maintain aspect ratio
      let scale = Math.max(xScale, yScale);

      myDiagram.scale = scale;

      flag = true;
    }
  });





  function updateBoardTypePort(x, y, portWidth, portHeight, data) {

    let xPercentage = XSCALE * ((parseFloat((x * 100) / diagramWidth)));
    let yPercentage = YSCALE * ((parseFloat(y * 100) / diagramHeight));
    let widthPercentage = XSCALE * ((parseFloat(portWidth * 100) / diagramWidth));
    let heightPercentage = YSCALE * ((parseFloat(portHeight * 100) / diagramHeight));

    let location = `${xPercentage} ${yPercentage}`;

    myDiagram.model.setDataProperty(data, "location", location);
    myDiagram.model.setDataProperty(data, "width", widthPercentage);
    myDiagram.model.setDataProperty(data, "height", heightPercentage);


    for (let comper of compPerList) {
      if (comper.caption === data.text) {
        comper.widthPercentage = widthPercentage;
        comper.heightPercentage = heightPercentage;
        comper.xPercentage = xPercentage;
        comper.yPercentage = heightPercentage;
        break;
      }
    }


  }

  function applyChanges(rows, left, right, horizontal, vertical, distribution, startPoint, top, bottom) {

    if (compPerList.length - 1 > 0) {
      let nbRows = parseInt(rows), nbColumns = parseInt(Math.ceil(parseFloat(compPerList.length) / nbRows));
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





  function nodeMoved(e) {
    let node = e.subject.first();

    // If a node is selected
    if (node instanceof go.Node) {
      let type = node.data.category;
      if (type === "port") {
        // Get the node's location, width, and height
        //let key = node.data.key;
        let text = node.data.text;
        let parts = text.split(':');
        let slotIndex = parts[0];
        let indexOnSlot = parts[1];

        let loc = node.data.location;
        let width = node.data.width;
        let height = node.data.height;
        let locaPrt = loc.split(' ');
        let x = parseFloat(locaPrt[0]);
        let y = parseFloat(locaPrt[1]);


        let xPercentage = ((parseFloat((x * 100) / diagramWidth)));
        let yPercentage = ((parseFloat(y * 100) / diagramHeight));
        let widthPercentage = ((parseFloat(width * 100) / diagramWidth));
        let heightPercentage = ((parseFloat(height * 100) / diagramHeight));

        document.getElementById("slotIndex").style.display = 'block';
        document.getElementById("indexOnSlot").style.display = 'block';
        document.getElementById("forSlotIndex").style.display = 'block';
        document.getElementById("forIndexOnSlot").style.display = 'block';

        document.getElementById('slotIndex').value = slotIndex;
        document.getElementById('indexOnSlot').value = indexOnSlot;
        document.getElementById('X').value = xPercentage;
        document.getElementById('Y').value = yPercentage;
        document.getElementById('width').value = widthPercentage;
        document.getElementById('height').value = heightPercentage;



        for (let comper of compPerList) {
          if (comper.caption === node.data.text) {
            comper.widthPercentage = widthPercentage;
            comper.heightPercentage = heightPercentage;
            comper.xPercentage = xPercentage;
            comper.yPercentage = heightPercentage;
          }
        }



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


document.getElementById("putPortOnBoard").addEventListener("click", function (event) {
  document.getElementById("addBackgroundLink").style.display = "block";
  init();
  let sideBar = document.getElementById('sidebar');
  let addSlotLink = document.getElementById('addSlotLink');
  let removeSlotLink = document.getElementById('removeSlotLink');

  if (addSlotLink && removeSlotLink) {
    sideBar.removeChild(addSlotLink);
    sideBar.removeChild(removeSlotLink);
  }


});


let id;
let ports;
document.getElementById("putSlotOnMotherBoard").addEventListener("click", function (event) {

  document.getElementById("addBackgroundLink").style.display = "none";

  if (!document.getElementById('addSlotLink') || !document.getElementById('removeSlotLink')) {
    let addSlot = document.createElement('a');
    let removeSlot = document.createElement('a');
    addSlot.textContent = 'Add Slot';
    addSlot.id = 'addSlotLink';


    removeSlot.textContent = 'Remove Slot';
    removeSlot.id = 'removeSlotLink';

    let sideBarDiv = document.getElementById('sidebar');

    sideBarDiv.appendChild(addSlot);
    sideBarDiv.appendChild(removeSlot);

    id = boardType.boardKey;
    ports = boardType.getPorts();

    myDiagram.model.nodeDataArray = [];
    myDiagram.redraw();


    console.log("Links appended.");
  } else {
    console.log("Links are already present.");
  }

  document.getElementById("addSlotLink").addEventListener("click", createPanel);
  document.getElementById("removeSlotLink").addEventListener("click", removeMotherBoardSlot);

  let part = modifyPart("", 0, 0);
  myDiagram.remove(part);


  function createPanel() {

    if (!document.getElementById('IndexOnSlotForm')) {
      // <div id="autoDistributionSidebar" style="display: none;">
      let indexOnSlotSidebar = document.createElement('div');
      indexOnSlotSidebar.id = 'indexOnSlotSidebar';
      indexOnSlotSidebar.style.display = 'block';



      let form = document.createElement('form');
      form.id = 'IndexOnSlotForm';
      form.className = 'mt-4';
      form.style.position = 'fixed';
      form.style.top = '50%';
      form.style.left = '50%';
      form.style.transform = 'translate(-50%, -50%)';
      form.style.zIndex = '9999';
      form.style.backgroundColor = 'white';
      form.style.padding = '20px';
      form.style.border = '1px solid #ccc';
      form.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

      // Create global div
      let globalDiv = document.createElement('div');

      // Create title div
      let titleDiv = document.createElement('div');
      titleDiv.className = 'mb-3';

      // Create h4 element for the title
      let h4 = document.createElement('h4');
      h4.textContent = 'Index On Slot';

      // Create hr element
      let hr = document.createElement('hr');
      hr.className = 'my-2';

      titleDiv.appendChild(h4);
      titleDiv.appendChild(hr);

      // Create inputs div
      let inputsDiv = document.createElement('div');
      inputsDiv.className = 'row mb-3';

      // Create col div
      let colDiv = document.createElement('div');
      colDiv.className = 'col';

      // Create input field for index on slot
      let indexOnSlotInput = document.createElement('input');
      indexOnSlotInput.type = 'number';
      indexOnSlotInput.id = 'indexOnSlott';
      indexOnSlotInput.placeholder = 'Enter Index On Slot';
      indexOnSlotInput.className = 'form-control';
      indexOnSlotInput.setAttribute('required', 'required');
      colDiv.appendChild(indexOnSlotInput);
      indexOnSlotInput.required = true;

      inputsDiv.append(colDiv);
      globalDiv.appendChild(titleDiv);
      globalDiv.appendChild(inputsDiv);

      // Create button group div
      let buttonGroupDiv = document.createElement('div');
      buttonGroupDiv.className = 'mb-3';

      // Create Apply button
      let applyButton = document.createElement('input');
      applyButton.type = 'submit';
      applyButton.className = 'btn btn-success';
      applyButton.textContent = 'Apply';
      buttonGroupDiv.appendChild(applyButton);

      // Create Close button
      let closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.id = 'closeIndext';
      closeButton.className = 'btn btn-secondary';
      closeButton.textContent = 'Close';
      buttonGroupDiv.appendChild(closeButton);

      globalDiv.appendChild(buttonGroupDiv);

      form.appendChild(globalDiv);

      // Append the div to the document body or another desired location
      document.body.appendChild(indexOnSlotSidebar);
      indexOnSlotSidebar.appendChild(form);

      // Create Apply button event listener
      applyButton.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent the default form submission
        addMotherBoardSlot();

      });

      closeButton.addEventListener('click', function (event) {
        event.preventDefault();
        closeForm();
      });

      console.log('Form appended.');
      return;
    } else {
      console.log('Form is already present.');
    }
  }

  // Function to handle form submission\
  let slots = new Set();
  let compPerList = [];
  function addMotherBoardSlot() {
    let motherBoard = new MotherBoardTypeSlot();
    let retVal = document.getElementById("indexOnSlott").value;
    let indexOnSlot = null;

    indexOnSlot = parseInt(retVal.trim());
    if (isNaN(indexOnSlot)) {
      alert("enter a valid number");
      return;
    }


    for (let motherBoardTypeSlot of boardType.motherBoardTypeSlots) {
      if (indexOnSlot !== null && motherBoardTypeSlot.indexOnSlot === indexOnSlot) {
        indexOnSlot = null;
        alert("The slot already exist");
        closeForm();
        break;
      }

    }
    if (indexOnSlot === null) {
      return;
    }


    motherBoard.BoardTypeId = (boardType.boardKey != null ? boardType.boardKey : null);
    motherBoard.indexOnSlot = `${indexOnSlot}`;
    motherBoard.xPercentage = (5.0);
    motherBoard.yPercentage = (5.0);
    motherBoard.widthPercentage = (100.0);
    motherBoard.heightPercentage = (100.0);


    compPerList.push(motherBoard);

    slots.add(motherBoard);
    boardType.motherBoardTypeSlots = (slots);

    motherSlots = boardType.motherBoardTypeSlots.size;
    window.motherSlots = motherSlots;





    myDiagram.model.addNodeData({
      key: `slot${motherBoard.BoardTypeId}`,
      category: "slot",
      width: motherBoard.widthPercentage,
      height: motherBoard.heightPercentage,
      text: `${indexOnSlot}`,
      location: `${motherBoard.xPercentage} ${motherBoard.yPercentage}`,
      vsible: true,
      rear: null || 0,
    });
    closeForm();
  }


  function removeMotherBoardSlot() {
    let slot = myDiagram.selection.first(); // Get the first selected node

    for (let motherBoardTypeSlot of boardType.motherBoardTypeSlots) {
      if (indexOnSlot !== null && slot) {
        motherBoardTypeSlot.indexOnSlot = null;
        boardType.motherBoardTypeSlots.delete(slot);

        closeForm();
        break;
      }

    }

    if (slot) {
      myDiagram.startTransaction("deleteSlot");
      myDiagram.model.removeNodeData(slot.data);
      myDiagram.commitTransaction("deleteSlot");
    }



  }
  // Function to close the form
  function closeForm() {
    let form = document.getElementById('IndexOnSlotForm');
    if (form) {
      form.remove(); // Remove the form from the DOM
      console.log('Form closed.');
    }
  }



  document.querySelector('#autoDistributionForm').addEventListener('submit', function (event) {
    event.preventDefault();
    autoDiPanel();
    autoDistributionNodes(rows, left, right, horizontal, vertical, distribution, startPoint, top, bottom);
  });

  document.querySelector('#autoResizeForm').addEventListener('submit', function (event) {
    event.preventDefault();
    autoRPanel();
    autoResizePorts();
  });





  myDiagram.addDiagramListener("ChangedSelection", function (e) {
    nodeMoved(e);
  });


  // Add a listener for the SelectionChanged event
  myDiagram.addDiagramListener("SelectionMoved", function (e) {
    nodeMoved(e);
  });

  let flag = false;
  document.getElementById("scale").addEventListener("click", function (e) {
    let zoomFactor = myDiagram.scale;
    console.log("Current Zoom Factor: " + zoomFactor);


    if (flag) {
      myDiagram.scale = 1.490455443789063;
      flag = false;
    } else {

      let totalBounds = myDiagram.computePartsBounds(myDiagram.nodes);
      let targetBounds = myDiagram.viewportBounds;
      // Step 2: Get the dimensions of the target bounds
      let targetWidth = targetBounds.width;
      let targetHeight = targetBounds.height;

      // Step 3: Calculate scale factors for x and y directions
      let xScale = targetWidth / totalBounds.width;
      let yScale = targetHeight / totalBounds.height;

      // Use the minimum of the two scale factors to maintain aspect ratio
      let scale = Math.min(xScale, yScale);

      myDiagram.scale = scale;

      flag = true;
    }
  });


  function applyChanges(rows, left, right, horizontal, vertical, distribution, startPoint, top, bottom) {


    if (compPerList.length - 1 > 0) {
      let nbRows = parseInt(rows), nbColumns = parseInt(Math.ceil(parseFloat(compPerList.length) / nbRows));
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

  function updateBoardTypePort(x, y, portWidth, portHeight, data) {
    let xPercentage = XSCALE * ((parseFloat((x * 100) / diagramWidth)));
    let yPercentage = YSCALE * ((parseFloat(y * 100) / diagramHeight));
    let widthPercentage = XSCALE * ((parseFloat(portWidth * 100) / diagramWidth));
    let heightPercentage = YSCALE * ((parseFloat(portHeight * 100) / diagramHeight));

    let location = `${xPercentage} ${yPercentage}`;
    myDiagram.model.setDataProperty(data, "location", location);
    myDiagram.model.setDataProperty(data, "width", widthPercentage);
    myDiagram.model.setDataProperty(data, "height", heightPercentage);


    for (let comper of compPerList) {
      if (comper.indexOnSlot === data.text) {
        comper.widthPercentage = widthPercentage;
        comper.heightPercentage = heightPercentage;
        comper.xPercentage = xPercentage;
        comper.yPercentage = heightPercentage;
        break;
      }
    }

    console.log(compPerList);
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

      updateBoardTypePortFromModel(data, width1, height1, x, y);

      console.log(data);
      node.updateTargetBindings();
      // Commit the transaction
      myDiagram.commitTransaction('update size');

    });

  }

  function updateBoardTypePortFromModel(data, newWidth, newHeight, x, y) {

    let location = `${ parseInt(x * diagramWidth / 100)} ${ parseInt(y * diagramHeight / 100)}`;
    let width =  parseInt(newWidth * diagramWidth / 100);
    let height =  parseInt(newHeight * diagramWidth / 100);

    myDiagram.model.setDataProperty(data, "width", width);
    myDiagram.model.setDataProperty(data, "height", height);
    myDiagram.model.setDataProperty(data, "location", location);

    for (let comper of compPerList) {
      if (comper.indexOnSlot === data.text) {
        comper.widthPercentage = width;
        comper.heightPercentage = height;
        comper.xPercentage = location.split(' ')[0];
        comper.yPercentage = location.split(' ')[1];
        break;
      }
    }

    // document.getElementById("height1").value = height;
    // document.getElementById("width1").value = width;
    console.log(compPerList);

  }


  function nodeMoved(e) {
    let node = e.subject.first();

    // If a node is selected
    if (node instanceof go.Node) {
      let type = node.data.category;
      if (type === "slot") {

        let loc = node.data.location;
        let width = node.data.width;
        let height = node.data.height;
        let locaPrt = loc.split(' ');
        let x = parseFloat(locaPrt[0]);
        let y = parseFloat(locaPrt[1]);

        let xPercentage = ((parseFloat((x * 100) / diagramWidth)));
        let yPercentage = ((parseFloat(y * 100) / diagramHeight));
        let widthPercentage = ((parseFloat(width * 100) / diagramWidth));
        let heightPercentage = ((parseFloat(height * 100) / diagramHeight));


        document.getElementById("slotIndex").style.display = 'none';
        document.getElementById("indexOnSlot").style.display = 'none';
        document.getElementById("forSlotIndex").style.display = 'none';
        document.getElementById("forIndexOnSlot").style.display = 'none';
        document.getElementById('X').value = xPercentage;
        document.getElementById('Y').value = yPercentage;
        document.getElementById('width').value = widthPercentage;
        document.getElementById('height').value = heightPercentage;



        for (let comper of boardType.motherBoardTypeSlots) {
          if (comper.caption === node.data.text) {
            comper.widthPercentage = widthPercentage;
            comper.heightPercentage = heightPercentage;
            comper.xPercentage = xPercentage;
            comper.yPercentage = heightPercentage;
          }
        }


      }
    }
  }



});







