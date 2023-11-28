
import * as go from "gojs";

let myDiagram;
let nodeDataArray = [];
let _data = [];

// Initialize the diagram
function init() {
    var $ = go.GraphObject.make;

    // Create a new diagram
    myDiagram = new go.Diagram("myDiagramDiv", {
        "undoManager.isEnabled": false,
        "grid.visible": false,
        "toolManager.hoverDelay": 100,
        click: null 
    });
    myDiagram.startTransaction("Initial Layout");
    myDiagram.isReadOnly = true;

    myDiagram.toolManager.panningTool.isEnabled = false;
    myDiagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;




    // Define the node template
    myDiagram.nodeTemplate =
        $(go.Node, "Position", {
            toolTip: $(go.Adornment, "Auto",
                $(go.Shape, { fill: "#CCFFCC" }),
                $(go.TextBlock, { margin: 4 },
                    new go.Binding("text", "key", v => (v == 1) ? "it is number 1" : "" + v))
            ),

            // click: (e, obj) => {
            //     console.log(e, obj)

            // },
            click: null 
        },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Panel, "Vertical",
                new go.Binding("width", "width", null, null),
                new go.Binding("height", "height", null, null),

                {
                    name: "PANEL", // Give the panel a name for referencing in resizeObjectName
                    minSize: new go.Size(100, 100),
                    maxSize: new go.Size(300, 300)

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
                            new go.Binding("text", "key").makeTwoWay() // Bind the text to the 'text' property of the node data
                        )),
                    $(go.Shape, "Rectangle",
                        new go.Binding("width", "width", v => v / 10, null),
                        {
                            fill: "black",


                        }
                    ),


                ),
                new go.Binding("width", "width").makeTwoWay(),

                $(go.Picture, {
                    name: "SHAPE",
                    minSize: new go.Size(50, 50)
                },
                    new go.Binding("source", "source"),
                    new go.Binding("fill", "color"),
                    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
                )
            )
            // new go.Binding("position", "loc", go.Point.parse),

        );
    myDiagram.commitTransaction("Initial Layout");
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