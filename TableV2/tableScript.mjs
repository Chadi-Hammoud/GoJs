import * as go from "../node_modules/gojs/release/go.mjs";
import * as layout from "./TableLayout.js";




var $ = go.GraphObject.make;
let myDiagram;
let myPalette;
let _data = [];


// define a custom ResizingTool to limit how far one can shrink a row or column
class LaneResizingTool extends go.ResizingTool {
    computeMinSize() {
        const diagram = this.diagram;
        if (this.adornedObject === null)
            return new go.Size();
        const lane = this.adornedObject.part; // might be row or column
        if (lane === null)
            return new go.Size();
        const horiz = (lane.category === 'Column Header'); // or "Row Header"
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
        const horiz = (lane.category === 'Column Header');
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
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;

    myDiagram =
        new go.Diagram("myDiagramDiv",
            {
                layout: $(layout.TableLayout,
                    $(go.RowColumnDefinition, { row: 1, height: 22 }),  // fixed size column headers
                    $(go.RowColumnDefinition, { column: 1, width: 22 }) // fixed size row headers
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
                resizable: true,
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
                resizable: true,
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

    myDiagram.nodeTemplate =  // for regular nodes within cells (groups); you'll want to extend this
        $(go.Node, "Auto",
            { width: 100, height: 50, margin: 4 },  // assume uniform Margin, all around
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
            new go.Binding("row"),
            new go.Binding("column", "col"),
            // the group is normally unseen -- it is completely transparent except when given a color or when highlighted
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

    myDiagram.model = new go.GraphLinksModel([
        // headers
        { key: "Header", text: "Cabinet 001", category: "Header" },
        { key: "Sider", text: "Shelves", category: "Sider" },
        // column and row headers
        // { key: "Request", text: "Request", col: 2, category: "Column Header" },
        // { key: "Approval", text: "Approval", col: 3, category: "Column Header" },

        //Shelves rows
        { key: "Employee", text: "Shelf_001", row: 2, category: "Row Sider" },
        { key: "Manager", text: "Shelf_002", row: 3, category: "Row Sider" },
        { key: "Administrator", text: "Shelf_003", row: 4, category: "Row Sider" },
        // cells, each a group assigned to a row and column
        { key: "EmpReq", row: 2, col: 2, isGroup: true, color: "black" },
        // { key: "EmpApp", row: 2, col: 3, isGroup: true, color: "lightgreen" },
        // { key: "ManReq", row: 3, col: 2, isGroup: true, color: "blue" },
        // { key: "ManApp", row: 3, col: 3, isGroup: true, color: "lightyellow" },
        // { key: "AdmReq", row: 4, col: 2, isGroup: true, color: "yellow" },
        // { key: "AdmApp", row: 4, col: 3, isGroup: true, color: "black" },
    ]);





    myPalette =
        new go.Palette("myPaletteDiv",
            {
                nodeTemplateMap: myDiagram.nodeTemplateMap,
                "model.nodeDataArray": [
                    // { key: "Alpha", color: "orange" },
                    // { key: "Beta", color: "tomato" },
                    // { key: "Gamma", color: "goldenrod" }
                    { isGroup: true, text: "Cabinet", horiz: false },
                    { isGroup: true, text: "Shelf", horiz: false },
                    { isGroup: true, text: "Board", horiz: true },
                    { type: "Serial Port", text: "Port", source: "../images/serial-port.svg", width: 100, height: 120 },
                    { type: "Serial Port", text: "Port", source: "../images/serial.svg", width: 100, height: 120 },
                    { type: "Serial Port", text: "Port", source: "../images/port001.svg", width: 100, height: 120 },
                    { type: "Serial Port", text: "Port", source: "../images/port001.svg", width: 100, height: 120 },
                    { type: "Serial Port", text: "Port", source: "../images/port002.svg", width: 100, height: 120 },
                    { type: "Serial Port", text: "Port", source: "../images/port003.svg", width: 100, height: 120 },

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
