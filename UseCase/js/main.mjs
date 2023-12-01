// Import GoJS library
import * as go from "../../node_modules/gojs/release/go.mjs";

let numPorts = prompt("How many ports do you need?");
// let numPorts
let myDiagram;
let nodeDataArray = [];
let _data;
let portSpacing = 20;
let selectedNode;



window.addEventListener('message', function (event) {
    var data = event.data;

    
    console.log('Received data from the popup:', data);
    switch (data.type) {
        case "autoResize":
            autoResize(data);
            break;
        case "adjustNodeCoordinates":
            adjustNodeCoordinates(data);
            break;
        case "autoDistribute":
            autoDistribute(data)
            break;

        default:
            alert(`Unknown message type ${data.type}`);

    }
});

// Initialize the diagram
function init() {




    // Convert the input to a number
    numPorts = parseInt(numPorts);

    var $ = go.GraphObject.make;

    // Create a new diagram
    myDiagram = new go.Diagram("myDiagramDiv", {
        layout: $(go.GridLayout, {}),
        "undoManager.isEnabled": true,
        "grid.visible": false,
        "toolManager.hoverDelay": 100,
        "draggingTool.isGridSnapEnabled": false,
        "fixedBounds": new go.Rect(0, 0, 800, 400), // Set fixedBounds to a specific rectangular area
    });

    //myDiagram.toolManager.resizingTool.computeReshape = function () { return true; }


    // Check if the input is a valid number
    if (isNaN(numPorts)) {
        alert("Invalid input. Please enter a number.");
    } else {
        // Create a node data object for each port
        for (let i = 1; i <= numPorts; i++) {
            let port = {
                key: "Port " + i,
                text: i + ": Port Caption ",
                loc: i * portSpacing + " 50",
                // size: "120 120",
                tooltip: getRandomNumber(),
                source: "../images/port.svg",
                width: 120,
                height: 120
            };
            nodeDataArray.push(port);
        }
        // Set the diagram's model to the node data array
        myDiagram.model = new go.GraphLinksModel(nodeDataArray);
    }

    // Define the node template
    myDiagram.nodeTemplate =
        $(go.Node, "Auto",
            {
                resizable: true,
                resizeObjectName: "PANEL", // Set resizeObjectName to the name of the panel
                layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
                click: (e, obj) => {
                    selectedNode = obj.part.data;
                    sendDataToPanel(selectedNode);
                    console.log(e, obj)
                },
                mouseDrop: (e, node) => {
                    sendDataToPanel(node.part.data);
                    console.log(node.part.data)
                },
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("width", "width", null, null),
            new go.Binding("height", "height", null, null),
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
                                margin: 5, // Add some margin to position the text inside the rectangle
                                editable: true, // Make the text editable
                                stroke: "black", // Set the text color to white
                                alignment: go.Spot.Center, // Center the text within the shape
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
                $(go.Picture, {
                    background: "white",
                    name: "PANEL",
                    stretch: go.GraphObject.Fill, // Make the picture fill its parent panel
                },
                    new go.Binding("source", "source"),
                    new go.Binding("fill", "color"),
                    new go.Binding("width", "width").makeTwoWay(),
                    new go.Binding("height", "height").makeTwoWay(),
                )


            )
        );


    myDiagram.addDiagramListener("Modified", function (e) {

        if (e && e.subject) {
            // Start the transaction
            myDiagram.startTransaction("Modified Layout");

            myDiagram.layout = null; // Set layout to null for free editing mode
            e.subject.each(function (part) {
                // Check if the modified part is a node
                if (part instanceof go.Node) {
                    let data = part.data;
                    let index = nodeDataArray.findIndex(n => n.key === data.key);
                    if (index !== -1) {
                        nodeDataArray[index].loc = go.Point.stringify(part.location);

                        // Calculate the fixed spacing based on the resized port's position
                        let fixedSpacingX = part.actualBounds.width + portSpacing;
                        let fixedSpacingY = part.actualBounds.height + portSpacing;

                        // Adjust the positions of other ports based on the fixed spacing
                        for (let i = 0; i < numPorts; i++) {
                            if (i !== index) {
                                let newX = i * fixedSpacingX;
                                let newY = i * fixedSpacingY;
                                nodeDataArray[i].loc = newX + " " + newY;
                            }
                        }
                    }
                }
            });

            // Commit the transaction
            myDiagram.commitTransaction("Modified Layout");
        }
    });
}

window.addEventListener('DOMContentLoaded', init);

// Save the diagram's model as a JSON file
function save() {
    _data.push(myDiagram.model.toJson());
    myDiagram.isModified = false;
    downloadData(_data);
    _data = [];
}

// Download the JSON data as a file
function downloadData(dataArray) {
    let jsonData = JSON.stringify(dataArray, null, 2);
    let blob = new Blob([jsonData], { type: "application/json" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.getElementById("saveModel").addEventListener("click", save);

function getRandomNumber() {
    var randomNumber = Math.random();
    var roundedNumber = Math.round(randomNumber);
    return roundedNumber;
}

function adjustNodeCoordinates(data) {
    var nodeData = myDiagram.model.findNodeDataForKey(data.selectedNodeID);
    if (nodeData) {
        myDiagram.model.startTransaction("editNode");
        // myDiagram.model.setDataProperty(nodeData, "width", data.width);
        // myDiagram.model.setDataProperty(nodeData, "loc", data.loc);
        // myDiagram.model.setDataProperty(nodeData, "height", data.height);

        // Modify the X and Y coordinates of the selected node
        selectedNode.loc = data.XCoord + " " + data.YCoord;
        selectedNode.width = parseInt(data.width);
        selectedNode.height = parseInt(data.height);

        myDiagram.model.commitTransaction("editNode");
        myDiagram.model.updateTargetBindings(selectedNode);
    }
}


function autoResize(_receivedData) {
    myDiagram.nodes.each(function (node) {

        // Start a transaction
        myDiagram.startTransaction('update properties');

        var key = node.key;
        var nodeData = myDiagram.model.findNodeDataForKey(key);


        myDiagram.model.setDataProperty(nodeData, "width", _receivedData.width)

        myDiagram.model.setDataProperty(nodeData, "height", _receivedData.height);

        // nodeData.location = new go.Point(X, Y);
        node.updateTargetBindings();
        // Commit the transaction
        myDiagram.commitTransaction('update properties');

    });
}

function autoDistribute(_receivedData){
    console.log(_receivedData);

}

function sendDataToPanel(dataToSend) {
    if (popup1) {
        popup1.postMessage(dataToSend, '*');
    } else {
        console.log("No window available to send data");
    }
}

// function receiveDataFromPopUps(_receivedData){
//     console.log(_receivedData)
// }







//In this code, we initialize a GoJS diagram with a specified number of ports. Each port is represented as a node in the diagram. The diagram's model is set to the node data array. The node template is defined to create a resizable node with a rounded rectangle shape and a label. The save function converts the diagram's model to JSON and downloads it as a file..</s>