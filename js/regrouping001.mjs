import * as go from "gojs";
import { GraphObject, Diagram, Palette } from 'gojs';
import { RescalingTool } from "./RescalingTool.js";


let _data = [];
let myDiagram;
let myPalette;

// class MyRescalingTool extends RescalingTool {
//     doResize(e) {
//       var tool = e.tool;
//       var diagram = tool.diagram;
//       if (diagram === null) return;
//       diagram.startTransaction("Rescaling");
//       var shape = tool.adornedObject;
//       if (shape !== null && shape.part !== null) {
//         var scaleX = shape.scaleX * tool.newScaleX / tool.initialScaleX;
//         var scaleY = shape.scaleY * tool.newScaleY / tool.initialScaleY;
//         shape.part.scaleX = scaleX;
//         shape.part.scaleY = scaleY;
//       }
//       diagram.commitTransaction("Rescaling");
//     }
//    }


class MyRescalingTool extends RescalingTool {
    doResize(e) {
        var tool = e.tool;
        var diagram = tool.diagram;
        if (diagram === null) return;
        diagram.startTransaction("Rescaling");
        var shape = tool.adornedObject;
        if (shape !== null && shape.part !== null) {
            var scaleX = shape.scaleX * tool.newScaleX / tool.initialScaleX;
            var scaleY = shape.scaleY * tool.newScaleY / tool.initialScaleY;

            // Get the height of the group's title
            var titleHeight = shape.part.findObject("SHAPE").height;

            // Calculate the new height of the group
            var newHeight = titleHeight + scaleY * shape.height;

            // Set the new height of the group
            shape.part.height = newHeight;

            // shape.part.scaleX = scaleX;  
            shape.part.scaleY = scaleY;
        }
        diagram.commitTransaction("Rescaling");
    }
}




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
        "clickCreatingTool.archetypeNodeData": { text: "new node" },
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,

    });

    // myDiagram.addDiagramListener("ObjectSingleClicked",
    //     e => {
    //         var part = e.subject.part;
    //         if (!(part instanceof go.Link)) showMessage("Clicked on " + part.data.text);
    //         showMessage("e: " + e);
    //     });

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
                    cellSize: new go.Size(1, 1), spacing: new go.Size(10, 4)
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
            var adorn = grp.findAdornment("Resizing");
            if (adorn !== null) {
                var tool = myDiagram.toolManager.resizingTool;
                tool.handle = adorn.elt(0); // 0 for top handle
                myDiagram.currentTool = tool; // starts the ResizingTool
                tool.doActivate();            // activates the ResizingTool
            }   
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
            // Otherwise, add the selection as members of the Group
            ok = grp.addMembers(grp.diagram.selection, true);
        } else {
            // If the target is not a group, make the selection top-level
            ok = e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true);
        }
        if (!ok) e.diagram.currentTool.doCancel();
    }



    myDiagram.groupTemplate =
        new go.Group("Auto",
            {
                background: "#000",
                ungroupable: true,
                // highlight when dragging into the Group
                mouseDragEnter: (e, grp, prev) => highlightGroup(e, grp, true),
                mouseDragLeave: (e, grp, next) => highlightGroup(e, grp, true),
                computesBoundsAfterDrag: true,
                computesBoundsIncludingLocation: true,
                mouseDrop: finishDrop,
                handlesDragDropForMembers: true,
                layout: makeLayout(false),
                resizable: true, // make the Shape resizable
                resizeObjectName: "SHAPE",
                mouseEnter: (e, node) => {
                    // var adorn = node.findAdornment("Resizing");
                    // if (adorn !== null) {
                    //     var tool = myDiagram.toolManager.resizingTool;
                    //     tool.handle = adorn.elt(0); // 0 for top handle
                    //     myDiagram.currentTool = tool; // starts the ResizingTool
                    //     tool.doActivate();            // activates the ResizingTool
                    // }
                },
                click: (e, obj) => showMessage(obj.part)
            }
        )
            .bind("layout", "horiz", makeLayout)
            // .bind(new go.Binding("background", "isHighlighted", h => h ? "#fff" : "transparent").ofObject())
            .bind("width", "width", null, null)
            .add(
                new go.Panel("Vertical")
                    .add(new go.Panel("Horizontal", // button next to TextBlock
                        {
                            stretch: GraphObject.Horizontal,
                            background: defaultColor(false),
                        })
                        .bind("background", "horiz", defaultColor)
                        .bind("width", "width", null, null)
                        .add(GraphObject.make("SubGraphExpanderButton", { alignment: go.Spot.Left, margin: 10 }))
                        .add(new go.TextBlock(
                            {
                                alignment: go.Spot.Top,
                                margin: 7,
                                editable: true,
                                font: "bold 13px sans-serif",
                                opacity: 0.90,
                                innerHeight: 100,
                                innerWidth: 100,
                            })
                            // .bind("width", "width", null, null)
                            // .bind("height", "textHeight", e => txtHeight(e), null)
                            .bind("font", "horiz")
                            .bind("text", "text", null, null)) // `null` as the fourth argument makes this a two-way binding
                    ) // end Horizontal Panel
                    .add(new go.Placeholder({ padding: 5, alignment: go.Spot.TopLeft }))
            ) // end Vertical Panel
            .add(new go.Shape("Rectangle",
                {
                    fill: null,
                    stroke: defaultColor(false),
                    fill: defaultColor(false),
                    strokeWidth: 2,
                    resizable: true, // make the Shape resizable
                    resizeObjectName: "SHAPE",
                    resized: (e, shape) => {
                        var adorn = node.findAdornment("Resizing");
                        if (adorn !== null) {
                            var tool = myDiagram.toolManager.resizingTool;
                            tool.handle = adorn.elt(0); // 0 for top handle
                            myDiagram.currentTool = tool; // starts the ResizingTool
                            tool.doActivate();            // activates the ResizingTool
                        }
                        var width = shape.width;
                        var height = shape.height;
                        shape.part.width = width;
                        shape.part.height = height;
                        shape.fill = "red"; // change the color of the Shape when the Group is resized
                        console.log("Shape resized. New width: " + width + ", new height: " + height);
                    }
                })
                .bind("stroke", "horiz", defaultColor)
                .bind("fill", "horiz", defaultColor)
                .bind("width", "width", null, null)
                .bind("height", "height", null, null))





    // myDiagram.toolManager.mouseDownTools.add(new MyRescalingTool());




    myDiagram.nodeTemplate =
        new go.Node("Auto",
            { // dropping on a Node is the same as dropping on its containing Group, even if it's top-level
                mouseDrop: (e, node) => finishDrop(e, node.containingGroup),
                resizable: true, resizeObjectName: "SHAPE",
                resized: (e, node) => {
                    // // Update the width and height properties of the node data when the node is resized
                    // var width = node.findObject("SHAPE").width;
                    // var height = node.findObject("SHAPE").height;
                    // node.width = width;
                    // node.height = height;
                },
                click: (e, obj) => {
                    showMessage("Node Clicked :" + e),
                        console.log(obj);
                },
                selectionChanged: part => {
                    var shape = part.elt(0);
                    shape.fill = part.isSelected ? "red" : "white";
                }
            })

            .add(new go.Picture(
                {
                    margin: 0,
                    name: "SHAPE",
                })
                .bind("source", "source")
                .bind("width", "width", e => e.data.width, null)
                .bind("height", "height", e => e.data.height, null))
            .add(new go.TextBlock(
                {
                    margin: 7,
                    editable: true,
                    font: "bold 13px sans-serif",
                    opacity: 0.90,
                    innerHeight: 100,
                    innerWidth: 100,
                    name: "SHAPE",
                    resized: (e, obj) => {
                        // Adjust the font size of the text
                        obj.font = "bold 13px sans-serif";
                    }
                })
            )



    // initialize the Palette and its contents
    myPalette =
        new Palette("myPaletteDiv",
            {
                nodeTemplateMap: myDiagram.nodeTemplateMap,
                groupTemplateMap: myDiagram.groupTemplateMap
            });

    myPalette.model = new go.GraphLinksModel([
        { isGroup: true, text: "Cabinet", horiz: false, width: "", height: "" },
        { isGroup: true, text: "Shelf", horiz: false },
        { isGroup: true, text: "Board", horiz: true },
        { type: "Serial Port", text: "Port", color: "#fff", source: "./images/serial-port.svg", width: 100, height: 120 },
        { type: "Serial Port", text: "Port", color: "#fff", source: "./images/serial.svg", width: 100, height: 120 },
        { type: "Serial Port", text: "Port", color: "#fff", source: "./images/port001.svg", width: 100, height: 120 },
        { type: "Serial Port", text: "Port", color: "#fff", source: "./images/port001.svg", width: 100, height: 120 },
        { type: "Serial Port", text: "Port", color: "#fff", source: "./images/port002.svg", width: 100, height: 120 },
        { type: "Serial Port", text: "Port", color: "#fff", source: "./images/port003.svg", width: 100, height: 120 },
    ]);
}

function changeWidth(e) {
    var part = e.subject.part;
    if (!(part instanceof go.Link)) showMessage("Clicked on " + part.data.text);
    showMessage("e: " + e);

}

function txtHeight() {
    e = e / 3;
}

function save() {
    _data.push(myDiagram.model.toJson());
    // _viewport = myDiagram.position;
    // console.log(_viewport);
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


window.addEventListener('DOMContentLoaded', init);


document.getElementById("saveModel").addEventListener("click", save);

