import * as go from "../node_modules/gojs/release/go.mjs";
import * as layout from "./TableLayout.js";




var $ = go.GraphObject.make;
let myDiagram;
let myPalette;
let _data = [];
let portCount = 0;
let i = 0;
let boardWidth = 500;
let boardHeight = 500;
let row = 1;
let col = 1;

let rowDef = $(go.RowColumnDefinition, { row: row, height: boardHeight, separatorStrokeWidth: 1, separatorStroke: "black" });
let colDef = $(go.RowColumnDefinition, { column: col, width: boardWidth, separatorStrokeWidth: 1, separatorStroke: "black" });

// define a custom ResizingTool to limit how far one can shrink a row or column
class LaneResizingTool extends go.ResizingTool {
    computeMinSize() {
        const diagram = this.diagram;
        if (this.adornedObject === null)
            return new go.Size();
        const lane = this.adornedObject.part; // might be row or column
        if (lane === null)
            return new go.Size();
        const horiz = (lane.category === 'Board'); // or "Row Header"
        const margin = diagram.nodeTemplate.margin;
        let bounds = new go.Rect();
        diagram.findTopLevelGroups().each((g) => {
            if (lane === null)
                return;
            if (horiz ? (g.column === lane.column) : (g.row === lane.row)) {
                const b = diagram.computePartsBounds(g.memberParts);
                if (b.isEmpty())
                    return; // nothing in there?  ignore it
                b.unionPoint(g.location); // keep any empty space on the left and top
                b.addMargin(margin); // assume the same node margin applies to all nodes
                if (bounds.isEmpty()) {
                    bounds = b;
                }
                else {
                    bounds.unionRect(b);
                }
            }
        });
        // limit the result by the standard value of computeMinSize
        const msz = super.computeMinSize();
        if (bounds.isEmpty())
            return msz;
        return new go.Size(Math.max(msz.width, bounds.width), Math.max(msz.height, bounds.height));
    }

    resize(newr) {
        const diagram = this.diagram;
        if (this.adornedObject === null)
            return;
        const lane = this.adornedObject.part;
        if (lane === null)
            return;
        const horiz = (lane.category === 'Board');
        const lay = diagram.layout; // the TableLayout
        if (horiz) {
            const col = lane.column;
            const coldef = lay.getColumnDefinition(col);
            coldef.width = newr.width;
        }
        else {
            const row = lane.row;
            const rowdef = lay.getRowDefinition(row);
            rowdef.height = newr.height;
        }
        lay.invalidateLayout();
    }
}  // end LaneResizingTool class

function init() {
    // colDef.width = parseInt(prompt("width of each column"));
    // colDef.column = parseInt(prompt("how many column do u need"));

    // rowDef.height = parseInt(prompt("height of each row"));
    // rowDef.row = parseInt(prompt("how many row do u need"));

    // portCount = parseInt(prompt("how many ports do u need"));
    portCount = 2;


    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this


    myDiagram =
        new go.Diagram("myDiagramDiv",
            {
                layout: $(layout.TableLayout,
                    rowDef,  // fixed size column headers
                    colDef,// fixed size row headers

                ),

                "SelectionMoved": e => e.diagram.layoutDiagram(true),
                "resizingTool": new LaneResizingTool(),
                // feedback that dropping in the background is not allowed
                mouseDragOver: e => e.diagram.currentCursor = "not-allowed",
                // when dropped in the background, not on a Node or a Group, cancel the drop
                mouseDrop: e => e.diagram.currentTool.doCancel(),
                "animationManager.isInitial": false,
                "undoManager.isEnabled": true
            });



    myDiagram.nodeTemplateMap.add("Board",  // for each column header
        $(go.Part, "Spot",
            {
                row: 1, rowSpan: 9999, column: 0,
                minSize: new go.Size(500, 500),
                stretch: go.GraphObject.Fill,
                movable: true,
                resizable: true,
                width: 500,
                resizeAdornmentTemplate:
                    $(go.Adornment, "Spot",
                        $(go.Placeholder),
                        $(go.Shape,  // for changing the length of a lane
                            {
                                alignment: go.Spot.Right,
                                desiredSize: new go.Size(7, 50),
                                fill: "lightblue", stroke: "dodgerblue",
                                cursor: "col-resize",
                            })
                    )
            },
            new go.Binding("column", "col"),

            $(go.Shape, { fill: null, },
                new go.Binding("fill", "color")),

            $(go.Panel, "Auto",
                { // this is positioned above the Shape, in row 1
                    alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom,
                    stretch: go.GraphObject.Horizontal,
                    height: myDiagram.layout.getRowDefinition(1).height,
                    width: myDiagram.layout.getColumnDefinition(1).width
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



    myDiagram.nodeTemplate =  // for regular nodes within cells (groups); you'll want to extend this
        $(go.Node, "Auto",
            { width: 500, height: 50, margin: 4 },  // assume uniform Margin, all around
            new go.Binding("row"),
            new go.Binding("column", "col"),
            $(go.Shape, { fill: "white" },
                new go.Binding("fill", "color")),
            $(go.TextBlock,
                new go.Binding("text", "key"))
        );

    myDiagram.groupTemplate =  // for cells
        $(go.Group, "Auto",
            {
                resizable: true,
                resizeObjectName: "SHAPE", // specify the object to be resized
                layerName: "Background",
                stretch: go.GraphObject.Fill,
                selectable: false,
                computesBoundsAfterDrag: true,
                computesBoundsIncludingLocation: true,
                handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
                mouseDragEnter: (e, group, prev) => { group.isHighlighted = true; },
                mouseDragLeave: (e, group, next) => { group.isHighlighted = false; },
                mouseDrop: (e, group) => {

                    var anynew = e.diagram.selection.any(p => p.containingGroup !== group);
                    // Don't allow headers/siders to be dropped
                    var anyHeadersSiders = e.diagram.selection.any(p => p.category === "Board");
                    if (!anyHeadersSiders && group.addMembers(e.diagram.selection, true) && i <= portCount) {
                        if (anynew) {
                            if (i != portCount) {
                                e.diagram.layout.getRowDefinition(group.row).height = 500;
                                e.diagram.layout.getColumnDefinition(group.column).width;
                                i++;
                            } else {
                                e.diagram.currentTool.doCancel();
                            }

                            console.log("anyHeadersSiders", anyHeadersSiders);
                            console.log("group", group.addMembers(e.diagram.selection, true));
                            console.log(e.diagram.layout.getRowDefinition(group.row).height);
                            console.log(group);




                        }
                    } else {  // failure upon trying to add parts to this group
                        e.diagram.currentTool.doCancel();
                    }
                },
                click: (e, obj) => {
                    console.log("Node Clicked :" , obj.data);
                    // console.log(obj);
                },

   
                
            },
            new go.Binding("row"),
            new go.Binding("column", "col"),
            // the group is normally unseen -- it is completely transparent except when given a color or when highlighted
            $(go.Shape, "Rectangle", // name the object
                {
                    fill: "transparent", stroke: "transparent",
                    strokeWidth: myDiagram.nodeTemplate.margin.left,
                    stretch: go.GraphObject.Fill,
                },
                new go.Binding("height", "height", null, null),
                new go.Binding("fill", "color"),
                new go.Binding("stroke", "isHighlighted", h => h ? "green" : "transparent").ofObject()),
            $(go.Placeholder,
                { // leave a margin around the member nodes of the group which is the same as the member node margin
                    alignment: (m => new go.Spot(0, 0, m.top, m.left))(myDiagram.nodeTemplate.margin),
                    padding: (m => new go.Margin(0, m.right, m.bottom, 0))(myDiagram.nodeTemplate.margin)
                })
        );



    myDiagram.model = new go.GraphLinksModel([


        { key: "EmpReq", col: 1, isGroup: true, color: "gray", width: 500, height: 500 },


    ]);
    console.log(myDiagram.model)


    myPalette =
        new go.Palette("myPaletteDiv",
            {
                nodeTemplateMap: myDiagram.nodeTemplateMap,
                "model.nodeDataArray": [

                    { type: "Serial Port", text: "Port", source: "../images/port001.svg", width: 100, height: 120, loc: "" },
                    { type: "Serial Port", text: "Port", source: "../images/port001.svg", width: 100, height: 120, loc: "" },
                    { type: "Serial Port", text: "Port", source: "../images/port002.svg", width: 100, height: 120, loc: "" },
                    { type: "Serial Port", text: "Port", source: "../images/port003.svg", width: 100, height: 120, loc: "" },

                ]
            });

    myPalette.nodeTemplate =
        new go.Node("Auto",
            { // dropping on a Node is the same as dropping on its containing Group, even if it's top-level
                // mouseDrop: (e, node) => finishDrop(e, node.containingGroup),
                resizable: true,
                resizeObjectName: "NODE",
                click: (e, obj) => {
                    console.log("Node Clicked :" + obj.data.type),
                        console.log(obj);
                },
                selectionChanged: part => {
                    var NODE = part.elt(0);
                    NODE.fill = part.isSelected ? "green" : "white";
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

    console.log("palette", myPalette);
    console.log("diagram", myDiagram);
}


window.addEventListener('DOMContentLoaded', init);


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
document.getElementById("saveModel").addEventListener("click", save);




















