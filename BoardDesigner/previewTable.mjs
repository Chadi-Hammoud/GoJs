import * as go from "gojs";
import * as layout from "./TableLayout.js";

var $ = go.GraphObject.make;
let myDiagram;
let _data = [];

function init() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;

    myDiagram =
        new go.Diagram("myDiagramDiv",
            {
                layout: $(layout.TableLayout,
                    $(go.RowColumnDefinition, 
                        new go.Binding("row", "row", null, null),
                        new go.Binding("height", "height", null, null),  ),  // fixed size column headers
                    $(go.RowColumnDefinition, 
                        new go.Binding("width", "width", null, null),
                        new go.Binding("height", "height", null, null), ) // fixed size row headers
                ),
                "SelectionMoved": e => e.diagram.layoutDiagram(true),
                // feedback that dropping in the background is not allowed
                mouseDragOver: e => e.diagram.currentCursor = "not-allowed",
                // when dropped in the background, not on a Node or a Group, cancel the drop
                mouseDrop: e => e.diagram.currentTool.doCancel(),
                "animationManager.isInitial": false,
                "undoManager.isEnabled": true
            });


    myDiagram.allowClipboard = false;
    myDiagram.allowLink = false;
    myDiagram.allowMove = false;
    myDiagram.allowDelete = false;
    myDiagram.allowTextEdit = false;

    myDiagram.nodeTemplateMap.add("Header",  // an overall table header, at the top
        $(go.Part, "Auto",
            {
                row: 0, column: 1, columnSpan: 9999,
                stretch: go.GraphObject.Horizontal,
                selectable: false, pickable: false
            },
            $(go.Shape, { fill: "transparent", strokeWidth: 0 }),
            $(go.TextBlock, { alignment: go.Spot.Center, font: "bold 12pt sans-serif" },
                new go.Binding("text"))
        ));

    myDiagram.nodeTemplateMap.add("Sider",  // an overall table header, on the left side
        $(go.Part, "Auto",
            {
                row: 1, rowSpan: 9999, column: 0,
                stretch: go.GraphObject.Vertical,
                selectable: false, pickable: false
            },
            $(go.Shape, { fill: "transparent", strokeWidth: 0 }),
            $(go.TextBlock, { alignment: go.Spot.Center, font: "bold 12pt sans-serif", angle: 270 },
                new go.Binding("text"))
        ));

    myDiagram.nodeTemplateMap.add("Column Header",  // for each column header
        $(go.Part, "Spot",
            {
                row: 1, rowSpan: 9999, column: 0,
                minSize: new go.Size(100, 100),
                stretch: go.GraphObject.Fill,
                movable: false,
                resizable: false,
                resizeAdornmentTemplate:
                    $(go.Adornment, "Spot",
                        $(go.Placeholder),
                        $(go.Shape,  // for changing the length of a lane
                            {
                                alignment: go.Spot.Right,
                                desiredSize: new go.Size(7, 50),
                                fill: "lightblue", stroke: "dodgerblue",
                                cursor: "col-resize"
                            })
                    )
            },
            new go.Binding("column", "col"),
            $(go.Shape, { fill: null },
                new go.Binding("fill", "color")),
            $(go.Panel, "Auto",
                { // this is positioned above the Shape, in row 1
                    alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom,
                    stretch: go.GraphObject.Horizontal,
                    height: myDiagram.layout.getRowDefinition(1).height
                },
                $(go.Shape, { fill: "transparent", strokeWidth: 0 }),
                $(go.TextBlock,
                    {
                        font: "bold 10pt sans-serif", isMultiline: false,
                        wrap: go.TextBlock.None, overflow: go.TextBlock.OverflowEllipsis
                    },
                    new go.Binding("text"))
            )
        ));

    myDiagram.nodeTemplateMap.add("Row Sider",  // for each row header
        $(go.Part, "Spot",
            {
                row: 2, column: 1, columnSpan: 9999,
                minSize: new go.Size(NaN, 100),
                stretch: go.GraphObject.Fill,
                movable: false,
                resizable: false,
                resizeAdornmentTemplate:
                    $(go.Adornment, "Spot",
                        $(go.Placeholder),
                        $(go.Shape,  // for changing the breadth of a lane
                            {
                                alignment: go.Spot.Bottom,
                                desiredSize: new go.Size(50, 7),
                                fill: "lightblue", stroke: "dodgerblue",
                                cursor: "row-resize"
                            })
                    )
            },
            new go.Binding("row"),
            $(go.Shape, { fill: null },
                new go.Binding("fill", "color")),
            $(go.Panel, "Auto",
                { // this is positioned to the left of the Shape, in column 1
                    alignment: go.Spot.Left, alignmentFocus: go.Spot.Right,
                    stretch: go.GraphObject.Vertical, angle: 270,
                    height: myDiagram.layout.getColumnDefinition(1).width
                },
                $(go.Shape, { fill: "transparent", strokeWidth: 0 }),
                $(go.TextBlock,
                    {
                        font: "bold 10pt sans-serif", isMultiline: false,
                        wrap: go.TextBlock.None, overflow: go.TextBlock.OverflowEllipsis
                    },
                    new go.Binding("text"))
            )
        ));



    myDiagram.groupTemplate =  // for cells
        $(go.Group, "Auto",
            {
                layerName: "Background",
                stretch: go.GraphObject.Fill,
                selectable: false,
                computesBoundsAfterDrag: true,
                computesBoundsIncludingLocation: true,
                handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
                mouseDragEnter: (e, group, prev) => { group.isHighlighted = true; },
                mouseDragLeave: (e, group, next) => { group.isHighlighted = false; },
                mouseDrop: (e, group) => {
                    // if any dropped part wasn't already a member of this group, we'll want to let the group's row
                    // column allow themselves to be resized automatically, in case the row height or column width
                    // had been set manually by the LaneResizingTool
                    var anynew = e.diagram.selection.any(p => p.containingGroup !== group);
                    // Don't allow headers/siders to be dropped
                    var anyHeadersSiders = e.diagram.selection.any(p => p.category === "Column Header" || p.category === "Row Sider");
                    if (!anyHeadersSiders && group.addMembers(e.diagram.selection, true)) {
                        if (anynew) {
                            e.diagram.layout.getRowDefinition(group.row).height = NaN;
                            e.diagram.layout.getColumnDefinition(group.column).width = NaN;
                        }
                    } else {  // failure upon trying to add parts to this group
                        e.diagram.currentTool.doCancel();
                    }
                }
            },
         
         
            $(go.Shape,
                {
                    fill: "transparent", stroke: "transparent",
                    strokeWidth: myDiagram.nodeTemplate.margin.left,
                    stretch: go.GraphObject.Fill
                },
                new go.Binding("fill", "color"),
                new go.Binding("stroke", "isHighlighted", h => h ? "red" : "transparent").ofObject()),
            $(go.Placeholder,
                { // leave a margin around the member nodes of the group which is the same as the member node margin
                    alignment: (m => new go.Spot(0, 0, m.top, m.left))(myDiagram.nodeTemplate.margin),
                    padding: (m => new go.Margin(0, m.right, m.bottom, 0))(myDiagram.nodeTemplate.margin)
                })
        );


    myDiagram.nodeTemplate =
        new go.Node("Auto",
            { 
                resizable: false,
                resizeObjectName: "NODE",
                click: (e, obj) => {
                    console.log("Node Clicked :" + obj.data.type),
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

            // Set the model and layout the diagram
            myDiagram.model = go.Model.fromJson(jsonData[0]);
            myDiagram.layoutDiagram(true);

            // Restore the positions of nodes
            jsonData[0].nodeDataArray.forEach(nodeData => {
                const node = myDiagram.findNodeForKey(nodeData.key);
                if (node) {
                    node.location = go.Point.parse(nodeData.loc);
                }
            });

            console.log('JSON data:', jsonData);
        });

        reader.readAsText(selectedFile);
    } else {
        console.log('No file selected.');
    }
}


function showMessage(s) {
    console.log(s);
}


window.addEventListener('DOMContentLoaded', init);
document.getElementById("loadModel").addEventListener("click", load);
