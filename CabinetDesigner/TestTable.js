import * as go from "../node_modules/gojs/release/go.mjs";

import * as layout from "./TableLayout.js";

var $ = go.GraphObject.make;  // for conciseness in defining templates

var diagram = $(go.Diagram, "myDiagramDiv");  // create a Diagram for the DIV HTML element

function init() {
    // create a simple table
    diagram.add(
        $(go.Part,
            $(go.Panel, "Table",
                $(go.TextBlock, "row 0, col 0",
                    { row: 0, column: 0, margin: 2, background: "lightgray" })
            )
        )
    );

    // Define the context menu
    var contextMenu = $(go.Adornment, "Vertical",
        $("ContextMenuButton",
            $(go.TextBlock, "Add Row"),
            { click: function (e, obj) { addRow(obj); } }),
        $("ContextMenuButton",
            $(go.TextBlock, "Add Column"),
            { click: function (e, obj) { addColumn(obj); } })
    );

    diagram.nodeTemplate =
        $(go.Node, "Auto",
            { contextMenu: contextMenu },
            // other node properties here
        );

    function addRow(obj) {
        // get the context menu that holds the button
        var contextmenu = obj.part;
        // get the node data to which the context menu belongs
        var node = contextmenu.adornedPart;
        // increment the row property
        node.data.row += 1;
        // update the node data
        diagram.model.updateTargetBindings(node.data);
    }

    function addColumn(obj) {
        // get the context menu that holds the button
        var contextmenu = obj.part;
        // get the node data to which the context menu belongs
        var node = contextmenu.adornedPart;
        // increment the column property
        node.data.column += 1;
        // update the node data
        diagram.model.updateTargetBindings(node.data);
    }
}

document.addEventListener('DOMContentLoaded', init);
