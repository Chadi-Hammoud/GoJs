import * as go from "../node_modules/gojs/release/go.mjs";
import { GraphObject } from '../node_modules/gojs/release/go.mjs';
import * as layout from "./TableLayout.js";

var $ = go.GraphObject.make;
let myDiagram;
let myPalette;
let contextMenu;

let _data = [];
let portCount = 0;
let i = 0;
let cabinetWidth = 200;
let cabinetHeight = 200;
let row = 1;
let col = 1;

let rowDef = $(go.RowColumnDefinition, { row: row, height: cabinetHeight });
let colDef = $(go.RowColumnDefinition, { column: col, width: cabinetWidth });

function init() {
    var $ = go.GraphObject.make;

    myDiagram =
        new go.Diagram("myDiagramDiv",
            {
                layout: $(layout.TableLayout,
                    rowDef,  // fixed size column headers
                    colDef,// fixed size row headers
                ),
                "SelectionMoved": e => e.diagram.layoutDiagram(true),
                //"resizingTool": new LaneResizingTool(),
                // feedback that dropping in the background is not allowed
                mouseDragOver: e => e.diagram.currentCursor = "not-allowed",
                // when dropped in the background, not on a Node or a Group, cancel the drop
                mouseDrop: e => e.diagram.currentTool.doCancel(),
                "animationManager.isInitial": false,
                "undoManager.isEnabled": true,
            });

    contextMenu =
        $("ContextMenu",  // that has one button
            $("ContextMenuButton",
                {
                    "ButtonBorder.fill": "white",
                    "_buttonFillOver": "skyblue"
                },
                $(go.TextBlock, "Change Color"),
                { click: () => console.log("Clicked") }),
            $("ContextMenuButton",
                {
                    "ButtonBorder.fill": "white",
                    "_buttonFillOver": "skyblue"
                },
                $(go.TextBlock, "Add Row"),
                { click: function (e, obj) { addRow(obj); } }),
            $("ContextMenuButton",
                {
                    "ButtonBorder.fill": "white",
                    "_buttonFillOver": "skyblue"
                },
                $(go.TextBlock, "Add Column"),
                { click: function (e, obj) { addColumn(obj); } })
        );



    myDiagram.nodeTemplateMap.add("Header",  // an overall table header, at the top
        $(go.Part, "Auto",
            {
                row: 0, column: 1, columnSpan: 9999,
                stretch: go.GraphObject.Horizontal,
                selectable: false, pickable: false
            },
            $(go.Shape, {
                contextMenu: contextMenu,
                fill: "transparent",
                strokeWidth: 0,
            }),
            $(go.TextBlock, { alignment: go.Spot.Center, font: "bold 12pt sans-serif" },
                new go.Binding("text"))
        ));

    myDiagram.nodeTemplateMap.add("Sider",  // an overall table header, on the left side
        $(go.Part, "Auto",
            {

                contextMenu: contextMenu,
                row: 1, rowSpan: 9999, column: 0,
                minSize: new go.Size(NaN, 100),
                stretch: go.GraphObject.Fill,
                movable: false,
                // pickable: false,
                // resizable: false,
            },
            $(go.Shape, { fill: "transparent", strokeWidth: 0 }),
            $(go.TextBlock, { alignment: go.Spot.Center, font: "bold 12pt sans-serif", angle: 270 },
                new go.Binding("text"))
        ));

    // myDiagram.nodeTemplateMap.add("Column Header",  // for each column header
    //     $(go.Part, "Spot",
    //         {
    //             row: 1, rowSpan: 9999, column: 0,
    //             minSize: new go.Size(100, 100),
    //             stretch: go.GraphObject.Fill,
    //             movable: false,
    //             resizable: false,
    //             resizeAdornmentTemplate:
    //                 $(go.Adornment, "Spot",
    //                     $(go.Placeholder),
    //                     $(go.Shape,  // for changing the length of a lane
    //                         {
    //                             alignment: go.Spot.Right,
    //                             desiredSize: new go.Size(7, 50),
    //                             fill: "lightblue", stroke: "dodgerblue",
    //                             cursor: "col-resize"
    //                         })
    //                 )
    //         },
    //         new go.Binding("column", "col"),
    //         $(go.Shape, { fill: null },
    //             new go.Binding("fill", "color")),
    //         $(go.Panel, "Auto",
    //             { // this is positioned above the Shape, in row 1
    //                 alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom,
    //                 stretch: go.GraphObject.Horizontal,
    //                 height: myDiagram.layout.getRowDefinition(1).height
    //             },
    //             $(go.Shape, { fill: "transparent", strokeWidth: 0 }),
    //             $(go.TextBlock,
    //                 {
    //                     font: "bold 10pt sans-serif", isMultiline: false,
    //                     wrap: go.TextBlock.None, overflow: go.TextBlock.OverflowEllipsis
    //                 },
    //                 new go.Binding("text"))
    //         )
    //     ));



    myDiagram.nodeTemplateMap.add("Row Sider",  // for each row header
        $(go.Part, "Spot",
            {
                contextMenu: contextMenu,
                row: 2, column: 1, columnSpan: 9999,
                minSize: new go.Size(100, 100),
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
                // layerName: "Background",
                stretch: go.GraphObject.Fill,
                selectable: true,
                computesBoundsAfterDrag: true,
                computesBoundsIncludingLocation: false,  // set this property to false
                handlesDragDropForMembers: true,
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
                },
                click: (e, obj) => {
                    console.log("Node Clicked :" + obj.data.key);
                    console.log(obj);
                },
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


    myDiagram.groupTemplateMap.add("Row Sider",
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
                computesBoundsIncludingLocation: false,
                // when the selection is dropped into a Group, add the selected Parts into that Group;
                // if it fails, cancel the tool, rolling back any changes
                mouseDrop: finishDrop,
                handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
                // Groups containing Groups lay out their members horizontally
                layout: new go.ForceDirectedLayout(),//makeLayout(false),
                click: (e, obj) => console.log("Group Clicked on " + obj.part.data.key),
                selectionObjectName: "PH",
                locationObjectName: "PH",
                resizable: false,
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
                            contextMenu: contextMenu,
                            selectionObjectName: "GROUPE",
                            stretch: go.GraphObject.Horizontal,
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
                    resizable: false, // make the Shape resizable
                    resizeObjectName: "SHAPE",
                })
                .bind("background", "color")
                .bind("stroke", "horiz", defaultColor)
                // .bind("fill", "horiz", defaultColor)
                .bind("width", "width", null, null) // bind the width property of the Shape to the width property of the data
                .bind("height", "height", null, null)) // bind the height property of the Shape to the height property of the data

    )

    myDiagram.groupTemplateMap.add("Gamma",
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
                computesBoundsIncludingLocation: false,
                // when the selection is dropped into a Group, add the selected Parts into that Group;
                // if it fails, cancel the tool, rolling back any changes
                mouseDrop: finishDrop,
                handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
                // Groups containing Groups lay out their members horizontally
                layout: new go.ForceDirectedLayout(),//makeLayout(false),
                click: (e, obj) => console.log("Group Clicked on " + obj.part.data.key),
                selectionObjectName: "PH",
                locationObjectName: "PH",
                resizable: false,
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
                            stretch: go.GraphObject.Horizontal,
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
            .add(new go.Placeholder({ padding: 5, alignment: go.Spot.TopLeft }))
            .add(new go.Shape("Rectangle",
                {
                    fill: null,
                    resizable: false, // make the Shape resizable
                    resizeObjectName: "SHAPE",
                })
                .bind("background", "color")
                .bind("stroke", "horiz", defaultColor)
                .bind("width", "width", v => v / 3, null) // bind the width property of the Shape to the width property of the data
                .bind("height", "height", null, null)) // bind the height property of the Shape to the height property of the data

    )



    myDiagram.model = new go.GraphLinksModel([
        // headers
        { key: "Header", text: "Cabinet 001", category: "Header" },
        { key: "Sider", text: "Shelves", category: "Sider" },
        // column and row headers
        // { key: "Request", text: "Request", col: 2, category: "Column Header" },
        // { key: "Approval", text: "Approval", col: 3, category: "Column Header" },

        //Shelves rows
        // { key: "Employee", text: "Shelf_001", row: 2, category: "Row Sider" },
        // { key: "Manager", text: "Shelf_002", row: 3, category: "Row Sider" },
        // { key: "Administrator", text: "Shelf_003", row: 4, category: "Row Sider" },

        // cells, each a group assigned to a row and column
        { key: "EmpReq", row: 1, col: 1, isGroup: true, color: "blue", width: 100, height: 100 },
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
                    { category: "Gamma", isGroup: true, text: "Cabinet", horiz: false, row: 0, column: 0 },
                    { category: "Gamma", isGroup: true, text: "Shelf", horiz: false },
                    { category: "Gamma", isGroup: true, text: "Board", horiz: true },
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
                mouseDrop: (e, node) => finishDrop(e, node.containingGroup),
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




    myPalette.groupTemplate =
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
                computesBoundsIncludingLocation: false,
                // when the selection is dropped into a Group, add the selected Parts into that Group;
                // if it fails, cancel the tool, rolling back any changes
                // mouseDrop: finishDrop,
                handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
                // Groups containing Groups lay out their members horizontally
                layout: new go.GridLayout({
                    wrappingWidth: Infinity,
                    alignment: go.GridLayout.Position,
                    cellSize: new go.Size(1, 1)
                }),
                click: (e, obj) => console.log("Group Clicked on " + obj.part.data.key),
            },
            new go.Binding("layout", "horiz", makeLayout)
        )
            .bind(new go.Binding("background", "isHighlighted", h => h ? "red" : "transparent").ofObject())

            .add(
                $(go.Panel, "Vertical")
                    .add(new go.Panel("Horizontal", // button next to TextBlock
                        {
                            selectionObjectName: "GROUPE",
                            stretch: go.GraphObject.Horizontal,
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
            .add(new go.Placeholder({ padding: 5, alignment: go.Spot.TopLeft }))
            .add(new go.Shape("Rectangle",
                {
                    fill: null,
                    resizable: false, // make the Shape resizable
                    resizeObjectName: "SHAPE",
                })
                .bind("background", "color")
                .bind("stroke", "horiz", defaultColor)
                // .bind("fill", "horiz", defaultColor)
                .bind("width", "width", null, null) // bind the width property of the Shape to the width property of the data
                .bind("height", "height", null, null)) // bind the height property of the Shape to the height property of the data



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


function addRow(obj) {
    // get the context menu that holds the button
    var contextmenu = obj.part;
    // get the node data to which the context menu belongs
    var node = contextmenu.adornedPart;

    // increment the row property
    var newRow = node.data.row + 1;

    // add new row to the nodeDataArray
    myDiagram.model.addNodeData({
        key: `NewRow${newRow}`,
        text: `Shelf_${newRow}`,
        row: newRow,
        category: "Row Sider"
    });


    myDiagram.model.updateTargetBindings(node.data);
    // update the diagram layout
    myDiagram.layoutDiagram(true);
}


function addColumn(obj) {
    // get the context menu that holds the button
    var contextmenu = obj.part;
    // get the node data to which the context menu belongs
    var node = contextmenu.adornedPart;
    // increment the column property
    node.data.column += 1;
    // update the node data
    myDiagram.model.updateTargetBindings(node.data);
    // update the diagram layout
    myDiagram.layoutDiagram(true);
}