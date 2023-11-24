
import * as go from "../node_modules/gojs/release/go.mjs";

let myDiagram;
let nodeDataArray = [];
let _data = [];

// Initialize the diagram
function init() {
    var $ = go.GraphObject.make;

    // Create a new diagram
    myDiagram = new go.Diagram("myDiagramDiv", {
        // layout: $(go.GridLayout, {
        //     comparer: go.GridLayout.smartComparer,
        //     wrappingWidth: Infinity,
        //     alignment: go.GridLayout.Position,
        //     cellSize: new go.Size(1, 1)
        // }),
        "undoManager.isEnabled": false,
        "grid.visible": false,
        "toolManager.hoverDelay": 100,
        // allowInsert: false,
        // allowDelete: false,
        // allowCopy: false,
        // allowGroup: false,
        // allowSelect: false,
        // allowZoom: false,
        // allowResize: false,
        // allowRotate: false,
        // allowClipboard: false,
    });


    // Define the node template
    myDiagram.nodeTemplate =
        $(go.Node, "Position", {
            toolTip: $(go.Adornment, "Auto",
                $(go.Shape, { fill: "#CCFFCC" }),
                $(go.TextBlock, { margin: 4 },
                    new go.Binding("text", "key", v => (v == 1) ? "it is number 1" : "" + v))
            ),
        },
            new go.Binding("position", "loc", go.Point.parse),

            $(go.Shape, "RoundedRectangle", {
                name: "SHAPE",
                fill: "gray",
                stroke: "black",
            },
                new go.Binding("fill", "color"),
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
            ),
        );
}
window.addEventListener('DOMContentLoaded', init);

function load() {
    const fileInput = document.getElementById('fileInput');

    if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];

        const reader = new FileReader();

        reader.addEventListener('load', function (e) {
            const fileContent = e.target.result;
            const jsonData = JSON.parse(fileContent);
            myDiagram.model = go.Model.fromJson(jsonData[0]);
            console.log('JSON data:', jsonData);
        });

        reader.readAsText(selectedFile);
    } else {
        console.log('No file selected.');
    }
}

window.addEventListener("click", load)