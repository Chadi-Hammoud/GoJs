
import * as go from "../node_modules/gojs/release/go.mjs";

let numPorts = prompt("How many ports do you need?");
let myDiagram;
let nodeDataArray = [];
let _data = [];

// Initialize the diagram
function init() {
    var $ = go.GraphObject.make;

    // Create a new diagram
    myDiagram =
        new go.Diagram("myDiagramDiv",
            {
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,

                "undoManager.isEnabled": true
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
                loc: "0 0",
                size: "50 50"
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
                resizeObjectName: "SHAPE",
                click: (e, obj) => { console.log(e, obj) }
            },
            new go.Binding("location", "loc", go.Point.parse),
            $(go.Shape, "RoundedRectangle", {
                name: "SHAPE",
                fill: "red",
                stroke: "black",
            },
                new go.Binding("fill", "color"),
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
            ),

            $(go.TextBlock,
                { margin: 5 },
                new go.Binding("text", "key"))
        );
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
//
//In this code, we initialize a GoJS diagram with a specified number of ports. Each port is represented as a node in the diagram. The diagram's model is set to the node data array. The node template is defined to create a resizable node with a rounded rectangle shape and a label. The save function converts the diagram's model to JSON and downloads it as a file..</s>