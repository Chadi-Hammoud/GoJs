
import { myDiagram } from "./Diagram.mjs";

let selectedNodes = [];
let xLast; let yNode; let last; let lastData; let partsLast; let yLast; let key;
let nodeDataKey; let xNode; let nodeLocation; let destinationData; let height; let width;
let yFirst; let xDestination; let first; let destination; let firstData; let distinationData;
let xFirst; let partsFirst; let partsDestination; let yDestination; let location;

function loop(e) {
  // Get the current selection
  let selection = e.diagram.selection;

  // Iterate over the selection
  selection.each(function (part) {
    if (part instanceof go.Node) {
      selectedNodes.push(part);

    }
  });

  return selectedNodes;
}

function getFirst() {
  first = selectedNodes[0].key;
  firstData = myDiagram.model.findNodeDataForKey(first);
  return firstData;
}

function getDestination() {
  destination = selectedNodes[1].key;
  distinationData = myDiagram.model.findNodeDataForKey(destination);
  return distinationData;
}

function alignXSelectedHandler(e) {

  selectedNodes = loop(e);


  if (selectedNodes.length === 2) {

    firstData = getFirst();
    distinationData = getDestination();

    partsFirst = firstData.location.split(' ');
    xFirst = partsFirst[0];

    partsDestination = distinationData.location.split(' ');
    yDestination = partsDestination[1];
    location = `${xFirst} ${yDestination}`;
    myDiagram.model.setDataProperty(distinationData, "location", location);


    myDiagram.clearSelection();
    selectedNodes = [];
  }

}


let alignXSelected = document.getElementById("alignXSelected");
alignXSelected.addEventListener('click', function () {
  myDiagram.addDiagramListener("ChangedSelection", alignXSelectedHandler);
});


function alignYSelectedHandler(e) {
  selectedNodes = loop(e);

  if (selectedNodes.length === 2) {
    firstData = getFirst();
    distinationData = getDestination();

    partsFirst = firstData.location.split(' ');
    yFirst = partsFirst[1];

    partsDestination = distinationData.location.split(' ');
    xDestination = partsDestination[0];


    location = `${xDestination} ${yFirst}`
    myDiagram.model.setDataProperty(distinationData, "location", location);

    myDiagram.clearSelection();
    selectedNodes = [];
  }

}

let alignYSelected = document.getElementById("alignYSelected");
alignYSelected.addEventListener('click', function () {
  myDiagram.addDiagramListener("ChangedSelection", alignYSelectedHandler);
});

// Define the revertSelected function
function revertSelectedHandler(e) {
  // Get the current selection
  var node = e.subject.first();

  // If a node is selected
  if (node instanceof go.Node) {
    var type = node.data.category;
    if (type === "board") {
      destination = node.data.key;

      destinationData = myDiagram.model.findNodeDataForKey(destination);

      var viewportBounds = myDiagram.viewportBounds;
      var diagramWidth = viewportBounds.width;
      var diagramHeight = viewportBounds.height;

      partsDestination = destinationData.location.split(' ');
      xDestination = partsDestination[0];
      yDestination = partsDestination[1];

      location = `${(yDestination * diagramWidth) / diagramHeight} ${(xDestination * diagramHeight) / diagramWidth}`;
      width = (destinationData.height * diagramWidth) / diagramHeight;
      height = (destinationData.width * diagramHeight) / diagramWidth;

      myDiagram.model.setDataProperty(destinationData, "location", location);
      myDiagram.model.setDataProperty(destinationData, "width", width);
      myDiagram.model.setDataProperty(destinationData, "height", height);

      myDiagram.clearSelection();
      selectedNodes = [];
    }
  }
}

// Add the listener using the defined function
let revertSelected = document.getElementById("revertSelected");
revertSelected.addEventListener('click', function () {
  myDiagram.addDiagramListener("ChangedSelection", revertSelectedHandler);
});


function setWidthSelectedHandler(e) {
  selectedNodes = loop(e);



  if (selectedNodes.length === 2) {
    firstData = getFirst();
    distinationData = getDestination();

    width = firstData.width;
    height = destinationData.height;
    myDiagram.model.setDataProperty(destinationData, "width", width);
    myDiagram.model.setDataProperty(destinationData, "height", height);


    myDiagram.clearSelection();
    selectedNodes = [];
  }
}

let setWidthSelected = document.getElementById("setWidthSelected");
setWidthSelected.addEventListener('click', function () {
  myDiagram.addDiagramListener("ChangedSelection", setWidthSelectedHandler);
});


function setHeightSelectedHandler(e) {
  selectedNodes = loop(e);


  if (selectedNodes.length === 2) {
    firstData = getFirst();
    distinationData = getDestination();

    width = destinationData.width;
    height = firstData.height;
    myDiagram.model.setDataProperty(destinationData, "width", width);
    myDiagram.model.setDataProperty(destinationData, "height", height);


    myDiagram.clearSelection();
    selectedNodes = [];
  }
}

let setHeightSelected = document.getElementById("setHeightSelected");
setHeightSelected.addEventListener('click', function () {
  myDiagram.addDiagramListener("ChangedSelection", setHeightSelectedHandler);
});





function setNextVerticalSelectedHandler(e) {
  selectedNodes = loop(e);


  if (selectedNodes.length === 2) {
    firstData = getFirst();
    distinationData = getDestination();

    partsDestination = destinationData.location.split(' ');
    xDestination = partsDestination[0];

    partsFirst = firstData.location.split(' ');
    yFirst = partsFirst[1];
    height = firstData.height;

    location = `${xDestination} ${yFirst + height}`;

    myDiagram.model.setDataProperty(destinationData, "location", location);



    myDiagram.clearSelection();
    selectedNodes = [];
  }
}

let setNextVerticalSelected = document.getElementById("setNextVerticalSelected");
setNextVerticalSelected.addEventListener('click', function () {
  myDiagram.addDiagramListener("ChangedSelection", setNextVerticalSelectedHandler);
});



function setNextHorizontalSelectedHandler(e) {
  selectedNodes = loop(e);


  if (selectedNodes.length === 2) {
    firstData = getFirst();
    distinationData = getDestination();

    partsDestination = destinationData.location.split(' ');
    yDestination = partsDestination[1];

    partsFirst = firstData.location.split(' ');
    xFirst = partsFirst[0];
    width = firstData.width;

    location = `${xFirst + width} ${yDestination}`;

    myDiagram.model.setDataProperty(destinationData, "location", location);



    myDiagram.clearSelection();
    selectedNodes = [];
  }
}

let setNextHorizontalSelected = document.getElementById("setNextHorizontalSelected");
setNextHorizontalSelected.addEventListener('click', function () {
  myDiagram.addDiagramListener("ChangedSelection", setNextHorizontalSelectedHandler);
});






function calculateHorizontalDistanceHandler(e) {
  selectedNodes = loop(e);



  if (selectedNodes.length === 2) {
    first = selectedNodes[0].key;
    last = selectedNodes[1].key;

    let portPnls = selectedNodes;
    let nbrPorts = portPnls.length;

    firstData = myDiagram.model.findNodeDataForKey(first);
    lastData = myDiagram.model.findNodeDataForKey(last);

    partsLast = lastData.location.split(' ');
    yLast = partsLast[1];

    partsFirst = firstData.location.split(' ');
    yFirst = partsFirst[1];

    let distance = parseInt(yLast - yFirst);

    let d = parseInt(firstData.height);

    for (let i = 1; i < portPnls.length; i++) {
      if (i == nbrPorts - 1)
        break;

      let boardTypePortPanel = portPnls[i];
      key = boardTypePortPanel.key;
      nodeDataKey = myDiagram.model.findNodeDataForKey(key);
      d += nodeDataKey.height;
    }

    if (distance > d) {
      let d0 = parseInt((distance - d) / nbrPorts);

      // re-arrange ports
      let y = yFirst + firstData.height + d0;
      for (let i = 1; i < portPnls.length; i++) {
        let boardTypePortPanel = portPnls[i].key;
        nodeDataKey = myDiagram.model.findNodeDataForKey(boardTypePortPanel);


        let partsNodeDataKey = nodeDataKey.location.split(' ');
        xNode = partsNodeDataKey[0];

        nodeLocation = `${xNode} ${y}`
        myDiagram.model.setDataProperty(nodeDataKey, "location", nodeLocation);
        updateBoardTypePort(xNode, y, nodeDataKey.width, nodeDataKey.height, nodeDataKey);
        y += nodeDataKey.height + d0;
      }
    }

    myDiagram.clearSelection();
    selectedNodes = [];
  }
}

let calculateHorizontalDistance = document.getElementById("calculateHorizontalDistance");
calculateHorizontalDistance.addEventListener('click', function () {
  myDiagram.addDiagramListener("ChangedSelection", calculateHorizontalDistanceHandler);
});







function calculateVerticalDistanceHandler(e) {
  selectedNodes = loop(e);

  if (selectedNodes.length === 2) {
    first = selectedNodes[0].key;
    last = selectedNodes[1].key;

    let portPnls = selectedNodes;
    let nbrPorts = portPnls.length;

    firstData = myDiagram.model.findNodeDataForKey(first);
    lastData = myDiagram.model.findNodeDataForKey(last);

    partsLast = lastData.location.split(' ');
    xLast = partsLast[1];

    partsFirst = firstData.location.split(' ');
    xFirst = partsFirst[1];

    let distance = parseInt(xLast - xFirst);

    let d = parseInt(firstData.width);

    for (let i = 1; i < portPnls.length; i++) {
      if (i == nbrPorts - 1)
        break;

      let boardTypePortPanel = portPnls[i];
      key = boardTypePortPanel.key;
      nodeDataKey = myDiagram.model.findNodeDataForKey(key);
      d += nodeDataKey.width;
    }

    if (distance > d) {
      let d0 = parseInt((distance - d) / nbrPorts);

      // re-arrange ports
      let x = xFirst + firstData.width + d0;
      for (let i = 1; i < portPnls.length; i++) {
        let boardTypePortPanel = portPnls[i].key;
        nodeDataKey = myDiagram.model.findNodeDataForKey(boardTypePortPanel);


        let partsNodeDataKey = nodeDataKey.location.split(' ');
        yNode = partsNodeDataKey[1];

        nodeLocation = `${x} ${yNode}`;
        myDiagram.model.setDataProperty(nodeDataKey, "location", nodeLocation);
        updateBoardTypePort(x, yNode, nodeDataKey.width, nodeDataKey.height, nodeDataKey);
        x += nodeDataKey.width + d0;
      }
    }
    myDiagram.clearSelection();
    selectedNodes = [];
  }
}

let calculateVerticalDistance = document.getElementById("calculateVerticalDistance");
calculateVerticalDistance.addEventListener('click', function () {
  myDiagram.addDiagramListener("ChangedSelection", calculateVerticalDistanceHandler);
});

// Remove the listener using the same function reference
let removeAction = document.getElementById("removeAction");
removeAction.addEventListener('click', function () {
  myDiagram.removeDiagramListener("ChangedSelection", revertSelectedHandler);
  myDiagram.removeDiagramListener("ChangedSelection", alignYSelectedHandler);
  myDiagram.removeDiagramListener("ChangedSelection", alignXSelectedHandler);
  myDiagram.removeDiagramListener("ChangedSelection", setWidthSelectedHandler);
  myDiagram.removeDiagramListener("ChangedSelection", setHeightSelectedHandler);
  myDiagram.removeDiagramListener("ChangedSelection", setNextVerticalSelectedHandler);
  myDiagram.removeDiagramListener("ChangedSelection", setNextHorizontalSelectedHandler);
  myDiagram.removeDiagramListener("ChangedSelection", calculateHorizontalDistanceHandler);
  myDiagram.removeDiagramListener("ChangedSelection", calculateVerticalDistanceHandler);
  myDiagram.clearSelection();
  selectedNodes = [];
});