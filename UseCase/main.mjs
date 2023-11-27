// Import GoJS library
import * as go from "../node_modules/gojs/release/go.mjs";

let numPorts = prompt("How many ports do you need?");
let myDiagram;
let nodeDataArray = [];
let _data = [];
let portSpacing = 20;

// Initialize the diagram
function init() {
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
    myDiagram.toolManager.resizingTool.computeReshape = function () { return true; }

    // Convert the input to a number
    numPorts = parseInt(numPorts);

     // Check if the input is a valid number
     if (isNaN(numPorts)) {
        alert("Invalid input. Please enter a number.");
    } else {
        // Create a node data object for each port
        for (let i = 1; i <= numPorts; i++) {
            let port = {
                key: "Port " + i,
                text: i+": Port Caption ",
                loc: i * portSpacing + " 50",
                // size: "120 120",
                tooltip: getRandomNumber(),
                source: "./images/port.svg",
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
                    console.log(e, obj)

                },
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Panel, "Vertical",
                new go.Binding("width", "width", null, null),
                new go.Binding("height", "height", null, null),

                {
                    name: "PANEL", // Give the panel a name for referencing in resizeObjectName
                    // minSize: new go.Size(100, 100),
                    // maxSize: new go.Size(300, 300)

                },
                $(go.Panel, "Horizontal",

                    { height: 20, stretch: go.GraphObject.Fill, },
                    $(go.Shape, "Rectangle",
                        new go.Binding("width", "width", v => v / 12, null),
                        {
                            fill: "black",
                        }
                    ),
                    $(go.Panel, "Auto",

                        $(go.Shape, "Rectangle",
                            new go.Binding("width", "width", v => v * 0.83, null),

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
                        new go.Binding("width", "width", v => v / 10, null),
                        {
                            fill: "black",


                        }
                    ),
                ),
                new go.Binding("width", "width").makeTwoWay(),

                $(go.Picture, {
                    background: "white",
                    name: "PANEL",
                    minSize: new go.Size(50, 50)
                },
                    new go.Binding("source", "source"),
                    new go.Binding("fill", "color"),
                    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                    new go.Binding("width", "width", null, null),
                    new go.Binding("height", "height", null, null),


                ),
            ));

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
//In this code, we initialize a GoJS diagram with a specified number of ports. Each port is represented as a node in the diagram. The diagram's model is set to the node data array. The node template is defined to create a resizable node with a rounded rectangle shape and a label. The save function converts the diagram's model to JSON and downloads it as a file..</s>