
import { $, myDiagram } from "../../ShelfType/Js/Diagram.mjs";

import { boardType } from "./BoardType.mjs";
import { motherBoard } from "./MotherBoardTypeSlot.mjs";

import { slotDesigner, portDesigner } from "../../CabinetType/Js/NodeTemplate.mjs";


myDiagram.nodeTemplateMap.add(slotDesigner);
myDiagram.nodeTemplateMap.add(portDesigner);

function init() {
  let borderCount = parseInt(prompt("boards count"));
  let startIndex = parseInt(prompt("start Index, 0 or 1"));
  let isVertical = prompt("is vertical?, v ");

  let divWidth = 2000;
  let divHeight = 900;


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
          category: "port",
          width: divWidth,
          height: dis,
          text: `${defaultValue}:${indexSlot}`,
          location: `0 ${tempVal}`,
          visible: true,
          source: "http://127.0.0.1:5500/BoardType/images/port.svg",
        });

        backHeight += dis;

      } else {

        backHeight = divHeight;

        myDiagram.model.addNodeData({
          key: `port${startIndex}`,
          category: "port",
          width: dis,
          height: divHeight,
          text: `${defaultValue}:${indexSlot}`,
          location: `${tempVal} 0`,
          visible: true,
          source: "http://127.0.0.1:5500/BoardType/images/port.svg",
        });

        backWidth += dis;
        //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 300, height: 120, text: `${startIndex}:${indexSlot}` });
      }
      tempVal += dis;
      defaultValue++;

    }

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

  document.querySelector('#configureSlotForm').addEventListener("submit", function (event) {
    event.preventDefault();
    slotIndex = parseInt(document.getElementById("slotIndex").value);
    indexOnSlot = parseInt(document.getElementById("indexOnSlot").value);
    X = parseFloat(document.getElementById("X").value, 10);
    Y = parseFloat(document.getElementById("Y").value, 10);
    width = parseFloat(document.getElementById("width").value, 10);
    height = parseFloat(document.getElementById("height").value, 10);

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


        node.updateTargetBindings();
        // Commit the transaction
        myDiagram.commitTransaction('update properties');
      }
    });


  }

  function updateBoardTypePortFromModel(data, x, y) {
    let viewportBounds = myDiagram.viewportBounds;
    let diagramWidth = viewportBounds.width;
    let diagramHeight = viewportBounds.height;

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

      let key = node.key;
      let data = myDiagram.model.findNodeDataForKey(key);
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

  let viewportBounds = myDiagram.viewportBounds;
  let diagramWidth = viewportBounds.width;
  let diagramHeight = viewportBounds.height;

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
  // Check if the links are already appended
  if (!document.getElementById('addSlotLink') || !document.getElementById('removeSlotLink')) {
    let addSlot = document.createElement('a');
    let removeSlot = document.createElement('a');


    addSlot.textContent = 'Add Slot';
    addSlot.id = 'addSlotLink'; // Set a unique id for identification


    removeSlot.textContent = 'Remove Slot';
    removeSlot.id = 'removeSlotLink'; // Set a unique id for identification

    let sideBarDiv = document.getElementById('sidebar');

    sideBarDiv.appendChild(addSlot);
    sideBarDiv.appendChild(removeSlot);



    id = boardType.getBoardKey();
    ports = boardType.getPorts();

    myDiagram.model.nodeDataArray = [];
    myDiagram.redraw();


    console.log("Links appended.");
  } else {
    console.log("Links are already present.");
  }

  document.getElementById("addSlotLink").addEventListener("click", createPanel);
  document.getElementById("removeSlotLink").addEventListener("click", removeMotherBoardSlot);
});


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

// Function to handle form submission
function addMotherBoardSlot() {

  let retVal = document.getElementById("indexOnSlott").value;
  let indexOnSlot = null;
  try {
    indexOnSlot = parseInt(retVal.trim());
  }
  catch (e) {
    alert("enter a valid number");
  }

  for (motherBoard in boardType.getMotherBoardTypeSlots) {
    if (indexOnSlot !== null && motherBoard.getIndexOnSlot() == indexOnSlot) {
      indexOnSlot = null;
      alert("The slot already exist");
      break;
    }
    if (indexOnSlot !== null) {
      return;
    }
  }

  motherBoard.setBoardTypeId(boardType.getBoardKey != null ? boardType.getBoardKey : null);
  motherBoard.setIndexOnSlot(indexOnSlot);
  motherBoard.setXPercentage(5.0);
  motherBoard.setYPercentage(5.0);
  motherBoard.setWidthPercentage(100.0);
  motherBoard.setHeightPercentage(100.0)

  boardType.getMotherBoardTypeSlots().push(motherBoard);



  myDiagram.model.addNodeData({
    key: `slot${motherBoard.getBoardTypeId()}`,
    category: "slot",
    width: motherBoard.getWidthPercentage(),
    height: motherBoard.getHeightPercentage(),
    text: `${indexOnSlot}`,
    location: `${motherBoard.getXPercentage()} ${motherBoard.getYPercentage()}`,
    visible: true,
    rear: null || 0,
  });
  closeForm();
}


function removeMotherBoardSlot() {

  let slot = myDiagram.selection.first(); // Get the first selected node

  if (slot) {
    myDiagram.startTransaction("deleteSlot");
    myDiagram.model.removeNodeData(slot.data);
    myDiagram.commitTransaction("deleteSlot");
  }
  let index = boardType.getMotherBoardTypeSlots().findIndex(item => item === motherBoard);
  if (index !== -1) {
    boardType.getMotherBoardTypeSlots().splice(index, 1);
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












