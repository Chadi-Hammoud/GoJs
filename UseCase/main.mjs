
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
    myDiagram =
        new go.Diagram("myDiagramDiv",
            {
                // layout: $(go.GridLayout,
                //     {
                //         comparer: go.GridLayout.smartComparer,
                //         wrappingWidth: Infinity,
                //         alignment: go.GridLayout.Position,
                //         //cellSize: new go.Size(1, 1)
                //     },
                // ),


                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,

                "undoManager.isEnabled": true,
                toolTip: $(go.Adornment, "Auto",
                    $(go.Shape, { fill: "#CCFFCC" }),
                    $(go.TextBlock, { margin: 4 },
                        "This diagram lets you control the world.")
                ),
                "grid.visible": false,  // display a background grid for the whole diagram
                "grid.gridCellSize": new go.Size(20, 20),
                "toolManager.hoverDelay": 100,  // how quickly tooltips are shown
                "draggingTool.isGridSnapEnabled": true,


            });

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
                loc: i * 10 + " " + i * 10,
                size: "50 50",
                tooltip: getRandomNumber(),
                source: "./images/OPTPort.svg",
            };
            nodeDataArray.push(port);
        }



        // Set the diagram's model to the node data array
        myDiagram.model = new go.GraphLinksModel(nodeDataArray);
    }




    // Define the node template
    myDiagram.nodeTemplate =
        $(go.Node, "Auto",  // changed "Position" to "Auto"
            {
                resizable: true,
                resizeObjectName: "SHAPE",
                click: (e, obj) => { console.log(e, obj) }
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),  // changed "Position" to "location"
            $(go.Shape, "RoundedRectangle", {
                name: "SHAPE",
                fill: "gray",
                stroke: "black",
                minSize: new go.Size(50, 50)
            },
                new go.Binding("fill", "color"),
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
            ),

            // $(go.Picture, {
            //     name: "SHAPE",
            //     stroke: "black",
            //     minSize: new go.Size(50, 50)
            // },
            //     new go.Binding("source", "source"),
            //     new go.Binding("fill", "color"),
            //     new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
            // ),
        );

    myDiagram.addDiagramListener("Modified", function (e) {
        if (e && e.subject) {
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





//
//In this code, we initialize a GoJS diagram with a specified number of ports. Each port is represented as a node in the diagram. The diagram's model is set to the node data array. The node template is defined to create a resizable node with a rounded rectangle shape and a label. The save function converts the diagram's model to JSON and downloads it as a file..</s>