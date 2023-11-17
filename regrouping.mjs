import * as go from "./node_modules/gojs/release/go.mjs";
import { GraphObject, Diagram, Palette } from './node_modules/gojs/release/go.mjs';
import { RescalingTool } from "./RescalingTool.js";


let _data = [];
let myDiagram;
let myPalette;
var $ = go.GraphObject.make;



function init() {
    myDiagram = new Diagram("myDiagramDiv", {
        mouseDrop: e => finishDrop(e, null),

        layout: new go.GridLayout({
            wrappingWidth: Infinity,
            alignment: go.GridLayout.Position,
            cellSize: new go.Size(1, 1)
        }),
        "commandHandler.archetypeGroupData": { isGroup: true, text: "Group", horiz: false },
        "undoManager.isEnabled": true,
        "allowReshape": true,
        // "clickCreatingTool.archetypeNodeData": { text: "new node" },
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,

    });

    myDiagram.addDiagramListener("ObjectSingleClicked",
        e => {
            var part = e.subject.part;
            if (!(part instanceof go.Link)) showMessage(e);
        });

    myDiagram.addDiagramListener("PartResized", function (e) {
        // var adorn = e.subject.findAdornment("Resizing");
        // if (adorn !== null) {
        //     var tool = myDiagram.toolManager.resizingTool;
        //     tool.handle = adorn.elt(0); // 0 for top handle
        //     myDiagram.currentTool = tool; // starts the ResizingTool
        //     tool.doActivate();            // activates the ResizingTool
        // }
        var part = e.subject.part;
        if (part instanceof go.Group) {
            var newSize = part.actualBounds;
            e.subject.data.height = newSize.height;
            e.subject.data.width = newSize.width;

            e.subject.background = "rgba(51,211,229)";
            e.isSelected = false;
            e.isHighlighted = false;
            console.log(e.parameter.height)
            console.log("New size of the group: ", newSize);
        }
    });

    // myDiagram.toolManager.clickCreatingTool.isDoubleClick = false;



    // myDiagram.addDiagramListener("BackgroundDoubleClicked",
    //   e => showMessage("Double-clicked at " + e.diagram.lastInput.documentPoint));

    // myDiagram.addDiagramListener("ClipboardPasted",
    //   e => showMessage("Pasted " + e.diagram.selection.count + " parts"));


    function showMessage(s) {
        console.log(s);
    }

    // The one template for Groups can be configured to be either layout out its members
    // horizontally or vertically, each with a different default color.

    function makeLayout(horiz) {  // a Binding conversion function
        if (horiz) {
            return new go.GridLayout(
                {
                    wrappingWidth: Infinity, alignment: go.GridLayout.Position,
                    // cellSize: new go.Size(1, 1), spacing: new go.Size(10, 4)
                });
        } else {
            return new go.GridLayout(
                {
                    wrappingColumn: 1, alignment: go.GridLayout.Position,
                    cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
                });
        }
    }

    function defaultColor(horiz) {  // a Binding conversion function
        return horiz ? "#c7fcf6" : "rgba(51,211,229, 0.5)";
    }

    // this function is used to highlight a Group that the selection may be dropped into
    function highlightGroup(e, grp, show) {
        if (!grp) return;
        e.handled = true;
        if (show) {
            // cannot depend on the grp.diagram.selection in the case of external drag-and-drops;
            // instead depend on the DraggingTool.draggedParts or .copiedParts
            var tool = grp.diagram.toolManager.draggingTool;
            var map = tool.draggedParts || tool.copiedParts;  // this is a Map
            // now we can check to see if the Group will accept membership of the dragged Parts
            if (grp.canAddMembers(map.toKeySet())) {
                grp.isHighlighted = true;
                return;
            }
        }
        grp.isHighlighted = false;
    }


    function finishDrop(e, grp) {
        var ok;
        if (grp !== null) {
            // Check if the target group is a Shelf group and the dropped part is a Cabinet
            if (grp.data.text === 'Shelf' && e.diagram.selection.first().data.text === 'Cabinet') {
                // If these conditions are met, cancel the operation
                ok = false;
                if (!ok) e.diagram.currentTool.doCancel();
            } else {
                // Otherwise, add the selection as members of the Group
                ok = grp.addMembers(grp.diagram.selection, true);
            }
        } else {
            // If the target is not a group, make the selection top-level
            ok = e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true);
        }
        if (!ok) e.diagram.currentTool.doCancel();
    }




    myDiagram.groupTemplate =
        $(go.Group, "Vertical",
            {
                //background: "#000",
                ungroupable: true,
                // highlight when dragging into the Group
                mouseDragEnter: (e, grp, prev) => highlightGroup(e, grp, true),
                mouseDragLeave: (e, grp, next) => {
                    highlightGroup(e, grp, false);
                    console.log(next)
                },
                computesBoundsAfterDrag: true,
                computesBoundsIncludingLocation: true,
                // when the selection is dropped into a Group, add the selected Parts into that Group;
                // if it fails, cancel the tool, rolling back any changes
                mouseDrop: finishDrop,
                handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
                // Groups containing Groups lay out their members horizontally
                layout: new go.ForceDirectedLayout(),//makeLayout(false),
                click: (e, obj) => showMessage("Group Clicked on " + obj.part.data.key),
                selectionObjectName: "PH",
                locationObjectName: "PH",
                resizable: true,
                resizeObjectName: "PH"
            },
            // new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("layout", "horiz", makeLayout)
        )
            .bind(new go.Binding("background", "isHighlighted", h => h ? "black" : "transparent").ofObject())

            .add(
                $(go.Panel, "Vertical")
                    .add(new go.Panel("Horizontal", // button next to TextBlock
                        {
                            selectionObjectName: "GROUPE",
                            stretch: GraphObject.Horizontal,
                            background: defaultColor(false)
                        })
                        .bind("background", "horiz", defaultColor)
                        .add(GraphObject.make("SubGraphExpanderButton", { alignment: go.Spot.Left, margin: 5 }))
                        .add(new go.TextBlock(
                            {
                                alignment: go.Spot.Top,
                                // margin: 7,
                                editable: true,
                                font: "bold 13px sans-serif",
                                opacity: 0.90,

                            })
                            .bind("font", "horiz")
                            .bind("text", "text", null, null)) // `null` as the fourth argument makes this a two-way binding
                        .bind("width", "width", null, null)))
                    // end Horizontal Panel
                    // .add(new go.Placeholder({ padding: 5, alignment: go.Spot.TopLeft }))
                    .add(new go.Shape("Rectangle",
                        {
                            fill: null,
                            // stroke: defaultColor(false),
                            // fill: defaultColor(false),
                            // strokeWidth: 2,
                            resizable: true, // make the Shape resizable
                            resizeObjectName: "SHAPE",
                        })
                        .bind("background", "color")
                        .bind("stroke", "horiz", defaultColor)
                        // .bind("fill", "horiz", defaultColor)
                        .bind("width", "width", null, null) // bind the width property of the Shape to the width property of the data
                        .bind("height", "height", null, null)) // bind the height property of the Shape to the height property of the data



    // end Vertical Panel


    // myDiagram.toolManager.mouseDownTools.add(new RescalingTool());




    myDiagram.nodeTemplate =
        new go.Node("Auto",
            { // dropping on a Node is the same as dropping on its containing Group, even if it's top-level
                mouseDrop: (e, node) => finishDrop(e, node.containingGroup),
                resizable: true,
                resizeObjectName: "NODE",
                click: (e, obj) => {
                    showMessage("Node Clicked :" + obj.data.type),
                        console.log(obj);
                },
                selectionChanged: part => {
                    var NODE = part.elt(0);
                    NODE.fill = part.isSelected ? "red" : "white";
                }
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify))
            .add(new go.Picture(
                {
                    margin: 0,
                    name: "NODE",
                    height: 100,
                    width: 100,
                    resized: (e, node) => {

                        // Update the width and height properties of the node data when the node is resized
                        var width = node.findObject("NODE").width;
                        var height = node.findObject("NODE").height;
                        node.width = width;
                        node.height = height;
                    },
                })
                .bind("source", "source")
                .bind("width", "width", e => {
                    e.actualBounds.width;
                    console.log(e)
                }, null)
                .bind("height", "height", e => e.actualBounds.height, null))
    // .add(new go.TextBlock(
    //     {
    //         margin: 7,
    //         editable: true,
    //         font: "bold 13px sans-serif",
    //         opacity: 0.90,
    //         innerHeight: 100,
    //         innerWidth: 100,
    //         name: "NODE",
    //         resized: (e, obj) => {
    //             // Adjust the font size of the text
    //             obj.font = "bold 13px sans-serif";
    //         }
    //     })
    // )



    // initialize the Palette and its contents
    myPalette =
        new Palette("myPaletteDiv",
            {
                nodeTemplateMap: myDiagram.nodeTemplateMap,
                groupTemplateMap: myDiagram.groupTemplateMap
            });

    myPalette.model = new go.GraphLinksModel([
        { color:"rgba(51,211,229)", isGroup: true, text: "Cabinet", horiz: false, width: 120, height: 100, loc: "0 0", size: "100 120" },
        { color:"rgba(51,211,229)", isGroup: true, text: "Shelf", horiz: false, width: 120, height: 100, loc: "0 0", size: "100 120" },
        { color:"rgba(51,211,229)", isGroup: true, text: "Board", horiz: true, width: 120, height: 100, loc: "0 0", size: "100 120" },
        { type: "Serial Port", text: "Port", color: "#fff", source: "./images/serial-port.svg", width: 100, height: 120, loc: "0 0" },
        { type: "Serial Port", text: "Port", color: "#fff", source: "./images/serial.svg", width: 100, height: 120, loc: "0 0" },
        { type: "Serial Port", text: "Port", color: "#fff", source: "./images/port001.svg", width: 100, height: 120, loc: "0 0" },
        { type: "Serial Port", text: "Port", color: "#fff", source: "./images/port001.svg", width: 100, height: 120, loc: "0 0" },
        { type: "Serial Port", text: "Port", color: "#fff", source: "./images/port002.svg", width: 100, height: 120, loc: "0 0" },
        { type: "Serial Port", text: "Port", color: "#fff", source: "./images/port003.svg", width: 100, height: 120, loc: "0 0" },
    ]);
}

// function changeWidth(e) {
//     var part = e.subject.part;
//     if (!(part instanceof go.Link)) showMessage("Clicked on " + part.data.text);
//     showMessage("e: " + e);

// }

// function txtHeight() {
//     e = e / 3;
// }

function save() {
    _data.push(myDiagram.model.toJson());
    myDiagram.isModified = false;
    downloadData(_data);
    _data = [];
}

function downloadData(dataArray) {
    let jsonData = JSON.stringify(dataArray, null, 2);
    // Create a Blob with the JSON data
    let blob = new Blob([jsonData], { type: "application/json" });
    // Create a link element
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    // Set the file name
    a.download = "data.json";
    // Append the link to the body
    document.body.appendChild(a);
    // Trigger a click on the link to start the download
    a.click();
    // Remove the link from the DOM
    document.body.removeChild(a);
}

// Function to generate a new fill color based on the size of the group
function newFillColor(width, height) {
    // You can replace this with your own logic to generate a new fill color
    // This example generates a new color based on the size of the group
    return `rgba(${width % 256}, ${height % 256}, 128, 0.5)`;
}


window.addEventListener('DOMContentLoaded', init);


document.getElementById("saveModel").addEventListener("click", save);

