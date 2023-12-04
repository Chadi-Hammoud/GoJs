// Import GoJS library
import * as go from "../../node_modules/gojs/release/go.mjs";

let numPorts = prompt("How many ports do you need?");
// let numPorts
let myDiagram;
let nodeDataArray = [];
let _data = [];
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
            // let port = {
            //     key: "Port " + i,
            //     text: i + ": Port Caption ",
            //     loc: i * portSpacing + " 50",
            //     // size: "120 120",
            //     tooltip: getRandomNumber(),
            //     source: "../images/port.svg",
            //     width: 12000,
            //     height: 12000
            // };

            let port = {
                loc: i * portSpacing + " 50",
                source: "../images/port.svg",
                BOARDTYPECODE: "Board Type # ByChadi",
                DESCRIPTION: "Test001",
                NODETYPE: "",
                DISPLAYDESCRIPTION: "",
                CATALOGID: 1,
                INSERTDATE: "",
                CHANGEDATE: "",
                INSERTEDBY: "",
                CHANGEDBY: "global-admin",
                EXTERNAL_CODE: "",
                NET_STATUS: "",
                STARTINGINDEX: "",
                BOARDTYPEID: "BB7B837FE33E432881B002139973150A",
                STATUS: 1,
                POWER: 0,
                NOISEFIGURE: 0,
                DEPTH: 2000,
                height: 30000,
                width: 20000,
                PARTNUMBER: 25732,
                PHYSICALROLE: "",
                ISPMP: 0,
                HASXPIC: 0,
                MAXINSERTIONLOSS: "",
                POWERCONSUMPTION: "",
                CONNECTORTYPE: "",
                FIBERTYPE: "",
                FIBERLENGTH: "",
                LOSS: "",
                DISPERSIONCOMPENSATION: "",
                CHROMATICDISPERSIONSLOPE: "",
                ZERODISPERSIONSLOPE: "",
                ATTENUATION: "",
                CAPACITY: "",
                SUPPORTEDCONFIGURATIO: "",
                OPTICALREGENERATIONABILITY: "",
                MAXLINECAPACITY: "",
                MINLINEWAVELENGTH: "",
                MAXLINEWAVELENGTH: "",
                MINOUTPUTPOWER: "",
                MAXOUTPUTPOWER: "",
                OUTPUTPOWER: "",
                OSNRTOLERANCE: "",
                MININPUTPOWER: "",
                MAXINPUTPOWER: "",
                RXSENSITIVITY: "",
                SPECTRALWIDTH: "",
                CHROMATICDISPERSION: "",
                GAIN: "",
                RXPOWER: "",
                TXPOWER: "",
                POSSIBLETYPE: "",
                BANDWIDTH: "",
                DTYPE: "",
                ALARMTHRESHOLD: "",
                SWITCHINGTHRESHOLD: "",
                FAMILYID: "",
                IS2G: "",
                IS3G: "",
                IS4G: "",
                EOSUPPORT: "",
                EOSALE: "",
                IMAGEDATAPROVIDERID: "",
                SUPPORTPROTECTION: "",
                SUPPORTPROTECTEDALLNE: "",
                SUBNETSTATUS: "",
                INTERNAL_PART_NUMBER: "",
                ELEMENT_DESCRIPTION: "",
                MANUFACTURE: "",
                MANUFACTURERID: "",
                MANUFACTURE_PART_NUMBER: "",
                CATEGORY: "",
                P2P_CAPABILITY: "",
                ILL_CAPABILITY: "",
                LL_CAPABILITY: "",
                MPLS_CAPABILITY: "",
                VOICE_CAPABILITY: "",
                DATA_CAPABILITY: "",
                IPTV_CAPABILITY: ""
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
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("width", "width", w => w / 100, null),
            new go.Binding("height", "height", w => w / 100, null),


            $(go.Panel, "Vertical",
                new go.Binding("width", "width", w => w / 100, null),
                new go.Binding("height", "height", w => w / 100, null),
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
                            new go.Binding("width", "width", v => (v / 100) - 20),
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
                    new go.Binding("width", "width", w => w / 100).makeTwoWay(),
                    new go.Binding("height", "height", w => w / 100).makeTwoWay(),
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

function autoDistribute(_receivedData) {
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