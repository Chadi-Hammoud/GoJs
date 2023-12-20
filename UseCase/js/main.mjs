// Import GoJS library
import * as go from "../../node_modules/gojs/release/go.mjs";

let numPorts = prompt("How many ports do you need?");
let isVertical = prompt("is vertical?, v ");
// let numPorts
let myDiagram;
let $ = go.GraphObject.make;

let nodeDataArray = [];
let _data = [];
let portSpacing = 20;
let selectedNode;
let currentLayout = makeLayout(isVertical === 'v');


// window.addEventListener('message', function (event) {
//     var data = event.data;


//     console.log('Received data from the popup:', data);
//     switch (data.type) {
//         case "autoResize":
//             autoResize(data);
//             break;
//         case "adjustNodeCoordinates":
//             adjustNodeCoordinates(data);
//             break;
//         case "autoDistribute":
//             autoDistribute(data)
//             break;

//         default:
//             alert(`Unknown message type ${data.type}`);

//     }
// });


// Initialize the diagram
function init() {
    // Convert the input to a number
    numPorts = parseInt(numPorts);

    // Create a new diagram
    myDiagram = new go.Diagram("myDiagramDiv", {
        layout: $(go.GridLayout, {}),
        //     "grid.visible": false,
        //     "toolManager.hoverDelay": 100,
        "draggingTool.isGridSnapEnabled": false,
        "fixedBounds": new go.Rect(0, 0, 500, 400), // Set fixedBounds to a specific rectangular area,
        "undoManager.isEnabled": true,
        "PartResized": (e) => {
            var obj = e.subject;
            console.log(obj.desiredSize.toString());
        },
        // "resizingTool.computeMinSize": function () {  // method override
        //     const group = this.adornedObject.part;
        //     console.log(group);  // Debugging line
        //     if (group && group.diagram && group.category == "board") {
        //         const membnds = group.diagram.computePartsBounds(group.memberParts);
        //         membnds.addMargin(new go.Margin(5));
        //         membnds.unionPoint(group.location);
        //         return membnds.size;
        //     }else{
        //         return null;
        //     }
        // },




    });

    //myDiagram.toolManager.resizingTool.computeReshape = function () { return true; }

    // myDiagram.addDiagramListener("PartResized", (e) => {
    //     const group = e.subject.part;
    //     console.log(group);  // Debugging line
    //     if (group && group.category === "board") {
    //         group.diagram.model.startTransaction("resize group");

    //         const membnds = group.diagram.computePartsBounds(group.memberParts);
    //         membnds.addMargin(new go.Margin(5));

    //         // Ensure that the group's desired size is set based on the computed bounds
    //         group.desiredSize = membnds.size;

    //         // Make sure the group's location is also considered
    //         membnds.unionRect(group.actualBounds);

    //         // Update the group's actualBounds to ensure it reflects the new size
    //         // Note: actualBounds is read-only, so use desiredSize to set the new size
    //         group.diagram.model.setDataProperty(group.data, "width", membnds.width);
    //         group.diagram.model.setDataProperty(group.data, "height", membnds.height);

    //         // Commit the transaction to apply the changes
    //         group.diagram.model.commitTransaction("resize group");
    //     }
    // });


    // Clear existing nodes
    myDiagram.model = new go.GraphLinksModel();
    //myDiagram.model.addNodeData({ key: "boardGroup", isGroup: true, category: "board", width: 600, height: 300 });
    // let groupBoardData = { key: "boardGroup", isGroup: true, category: "board", width: 600, height: 300 }
    // nodeDataArray.push(groupBoardData);
    // myDiagram.model = new go.GraphLinksModel(nodeDataArray);


    function addBoardsFromUserPrompt() {

        // Get the boardGroup data
        var boardGroupData = myDiagram.model.findNodeDataForKey("boardGroup");
        // Now you can use boardGroupBounds.width and boardGroupBounds.height
        var groupWidth = 450;
        var groupHeight = 300;

        if (isVertical == 'v') {
            currentLayout = makeLayout(isVertical === 'v');

        } else {
            currentLayout = makeLayout(!isVertical === 'v');

        }

        if (boardGroupData) {
            boardGroupData.layout = currentLayout;
        }

        for (let i = 1; i <= numPorts; i++) {
            if (isVertical === 'v') {

                nodeDataArray.push(
                    {
                        key: "Port " + i,
                        // group: "boardGroup",
                        category: "port",
                        width: (groupWidth / numPorts) - 5,
                        height: groupHeight - 5,
                        text: i + ": Port Caption ",
                        source: "../images/port.svg",
                    });

            } else {
                nodeDataArray.push({
                    key: "Port " + i,
                    // group: "boardGroup",
                    category: "port",
                    width: groupWidth - 5,
                    height: (groupHeight / numPorts) - 5,
                    text: i + ": Port Caption ",
                    source: "../images/port.svg",
                });

            }
        }

    }
    addBoardsFromUserPrompt();
    myDiagram.model = new go.GraphLinksModel(nodeDataArray);

    // Check if the input is a valid number
    // if (isNaN(numPorts)) {
    //     alert("Invalid input. Please enter a number.");
    // } else {
    //     // Create a node data object for each port
    //     for (let i = 1; i <= numPorts; i++) {
    //         let port = {
    //             key: "Port " + i,
    //             text: i + ": Port Caption ",
    //             loc: i * portSpacing + " 50",
    //             // size: "120 120",
    //             tooltip: getRandomNumber(),
    //             source: "../images/port.svg",
    //             width: 120,
    //             height: 120
    //         };
    //     };
    //     nodeDataArray.push(port);
    // }
    // Set the diagram's model to the node data array



    // Define the GROUP template
    // myDiagram.groupTemplateMap.add("board",
    //     $(go.Group, "Auto",
    //         {
    //             resizable: true,
    //             resizeObjectName: "BOARD",
    //             layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
    //             dragComputation: function (group, pt, gridpt) {
    //                 var groupWidth = group.actualBounds.width;
    //                 var groupHeight = group.actualBounds.height;
    //                 var data, key;

    //                 group.memberParts.each(function (node) {
    //                     if (node instanceof go.Node) {
    //                         key = node.key;
    //                         data = myDiagram.model.findNodeDataForKey(key);

    //                         // Calculate new location based on group size
    //                         var x = (groupWidth / numPorts) * (key.slice(-1) - 1);
    //                         var y = (groupHeight / numPorts) * (key.slice(-1) - 1);

    //                         // Update the location and size of the node
    //                         myDiagram.model.setDataProperty(data, "loc", go.Point.stringify(new go.Point(x, y)));
    //                         myDiagram.model.setDataProperty(data, "width", (groupWidth / numPorts) - 5);
    //                         myDiagram.model.setDataProperty(data, "height", (groupHeight / numPorts) - 5);

    //                         node.updateTargetBindings();
    //                     }
    //                 });
    //                 return pt;
    //             },
    //         },
    //         $(go.Placeholder,
    //             { padding: 10 },
    //             new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    //         ),
    //         $(go.Panel, "Auto", { name: "BOARD" },

    //             $(go.Shape, "Rectangle",
    //                 {
    //                     //name: "BOARD",
    //                     fill: "gray",

    //                 }
    //             ),
    //             new go.Binding("width", "width", null, null),
    //             new go.Binding("height", "height", null, null),
    //         ),
    //         new go.Binding("width", "width", null, null),
    //         new go.Binding("height", "height", null, null),
    //     )
    // );

    // Define the node template
    myDiagram.nodeTemplate =
        $(go.Node, "Auto",
            {
                resizable: true,
                resizeObjectName: "PANEL", // Set resizeObjectName to the name of the panel
                layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
                selectionAdorned: false,
                resizeAdornmentTemplate: $(go.Adornment, "Spot",
                    $(go.Placeholder),
                    $(go.Shape, // the handle
                        {
                            alignment: go.Spot.TopLeft,
                            cursor: "nw-resize",
                            desiredSize: new go.Size(6, 6),
                            fill: "transparent",
                            stroke: "transparent",

                        }),
                    $(go.Shape, // the handle
                        {
                            alignment: go.Spot.TopRight,
                            cursor: "ne-resize",
                            desiredSize: new go.Size(6, 6),
                            fill: "transparent",
                            stroke: "transparent"
                        })
                ),
                click: (e, obj) => {
                    selectedNode = obj.part.data;
                    sendDataToPanel(selectedNode);
                    console.log(e, obj)
                },
                mouseDrop: (e, node) => {
                    sendDataToPanel(node.part.data);
                    console.log(node.part.data)
                },

                // dragComputation: (node, pt, gridpt) => {
                //     // get the board group
                //     var boardGroup = node.containingGroup;
                //     if (boardGroup !== null) {
                //         // get the board group's bounds
                //         var boardBounds = boardGroup.actualBounds;
                //         // get the node's bounds
                //         var nodeBounds = node.actualBounds;
                //         // check if the new location is outside the board group
                //         if (pt.x < boardBounds.x || pt.y < boardBounds.y ||
                //             pt.x + nodeBounds.width > boardBounds.x + boardBounds.width ||
                //             pt.y + nodeBounds.height > boardBounds.y + boardBounds.height) {
                //             // adjust the new location to keep the node inside the board group
                //             pt.x = Math.max(boardBounds.x, Math.min(pt.x, boardBounds.x + boardBounds.width - nodeBounds.width));
                //             pt.y = Math.max(boardBounds.y, Math.min(pt.y, boardBounds.y + boardBounds.height - nodeBounds.height));
                //         }
                //     }
                //     return pt;
                // },
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("width", "width", w => w, null),
            new go.Binding("height", "height", w => w, null),


            $(go.Panel, "Vertical",
                new go.Binding("width", "width", w => w, null),
                new go.Binding("height", "height", w => w, null),
                // new go.Binding("marginLeft", "marginLeft").makeTwoWay(),
                // new go.Binding("marginTop", "marginTop").makeTwoWay(),
                // new go.Binding("marginRight", "marginRight").makeTwoWay(),
                // new go.Binding("marginBottom", "marginBottom").makeTwoWay(),
                {
                    name: "PANEL",
                },
                $(go.Panel, "Horizontal",
                    { height: 20 },
                    $(go.Shape, "Rectangle",
                        {
                            fill: "black",
                            width: 10,
                        }
                    ),
                    $(go.Panel, "Auto",
                        $(go.Shape, "Rectangle",
                            new go.Binding("width", "width", v => (v) - 20),
                            {
                                fill: "white",
                                stretch: go.GraphObject.Fill,
                            }
                        ),
                        $(go.TextBlock, "",
                            {
                                margin: 5,
                                editable: true,
                                alignment: go.Spot.Left,
                            },
                            new go.Binding("text", "text").makeTwoWay()
                        )
                    ),
                    $(go.Shape, "Rectangle",
                        {
                            fill: "black",
                            width: 10,
                        }
                    ),
                ),
                $(go.Picture, {
                    background: "white",
                    name: "PANEL",
                    stretch: go.GraphObject.Fill,
                },
                    new go.Binding("source", "source"),
                    new go.Binding("fill", "color"),
                    new go.Binding("width", "width", w => w).makeTwoWay(),
                    new go.Binding("height", "height", w => w).makeTwoWay(),
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

function makeLayout(isVertical, columns, rows) {
    let layout = null;
    if (isVertical) {
        layout = $(go.GridLayout, {
            wrappingColumn: Infinity, alignment: go.GridLayout.Position,
            wrappingWidth: rows,
            cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4),

        });
    } else {
        layout = $(go.GridLayout, {
            wrappingWidth: Infinity, alignment: go.GridLayout.Position,
            wrappingColumn: columns || 1,
            cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
        });
    }
    return layout;
}

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

// document.getElementById("saveModel").addEventListener("click", save);

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

function autoDistribute(_receivedData) {
    console.log(_receivedData);

}

function sendDataToPanel(_data) {
    // if (popup1) {
    //     popup1.postMessage(dataToSend, '*');
    // } else {
    //     console.log("No window available to send data");
    // }

    console.log('Received data from the GoJS file:', _data);
    if (_data.type == "autoDistribute") {
        return
    } else {

        let locArray = _data.loc.split(" ");
        let xCoordinate = locArray[0];
        let yCoordinate = locArray[1];

        // Fill the form inputs with the received data
        document.getElementById("XCoord").value = xCoordinate || 'undefined';
        document.getElementById("YCoord").value = yCoordinate || 'undefined';
        document.getElementById("width").value = _data.width || 'undefined';
        document.getElementById("height").value = _data.height || 'undefined';
        document.getElementById("resizedWidth").value = _data.height || 'undefined';
        document.getElementById("resizedHeight").value = _data.height || 'undefined';
    }
}

export function receiveDataFromPopUps(_receivedData) {
    console.log("_receivedData", _receivedData)
        switch (_receivedData.type) {
        case "autoResizeForm":
            autoResize(_receivedData);
            break;
        case "adjustNodeCoordinates":
            adjustNodeCoordinates(_receivedData);
            break;
        case "autoDistributeForm":
            autoDistribute(_receivedData)
            break;

        default:
            alert(`Unknown message type ${_receivedData.type}`);

    }

}







//In this code, we initialize a GoJS diagram with a specified number of ports. Each port is represented as a node in the diagram. The diagram's model is set to the node data array. The node template is defined to create a resizable node with a rounded rectangle shape and a label. The save function converts the diagram's model to JSON and downloads it as a file..</s>