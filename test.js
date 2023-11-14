// import * as go from './node_modules/gojs/release/go.js';
// import * as RescalingTool from './RescalingTool.js';
function init() {
    let myPalette;
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    // var $ = go.GraphObject.make;  // for conciseness in defining templates

    const $ = go.GraphObject.make;
    const myDiagram =
        $(go.Diagram, "myDiagramDiv", {
            "undoManager.isEnabled": true
        });
    // install the RescalingTool as a mouse-down tool
    // myDiagram.toolManager.mouseDownTools.add(new RescalingTool());

    myDiagram.nodeTemplate =
        $(go.Node, "Vertical",
            {
                locationSpot: go.Spot.Center,
                resizable: true,
                resizeObject: "NODE"
            },
            new go.Binding("scale").makeTwoWay(),
            $(go.Shape, "RoundedRectangle",
                {
                    strokeWidth: 0,
                    name: "NODE"
                },
                new go.Binding("fill", "color")),
            $(go.TextBlock,
                { margin: 8 },
                new go.Binding("text"))
        );

    myDiagram.groupTemplate =
        new go.Group("Auto",
            {
                // mouseDragEnter: (e, grp, prev) => highlightGroup(e, grp, true),
                // mouseDragLeave: (e, grp, next) => highlightGroup(e, grp, true),
                computesBoundsAfterDrag: true,
                computesBoundsIncludingLocation: true,
                // mouseDrop: finishDrop,
                handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
                layout: new go.GridLayout(
                    {
                        // wrappingWidth: Infinity, alignment: go.GridLayout.Position,
                        // cellSize: new go.Size(1, 1), spacing: new go.Size(10, 4)
                    }),
                click: (e, obj) => showMessage("Group Clicked on " + obj.part.data.key)
            }
        )

    // but use the default Link template, by not setting Diagram.linkTemplate


    myPalette =
        new go.Palette("myPaletteDiv",
            {
                nodeTemplateMap: myDiagram.nodeTemplateMap,
                groupTemplateMap: myDiagram.groupTemplateMap
            });

    myPalette.model = new go.GraphLinksModel([
        { isGroup: true, text: "Cabinet", horiz: false },
        { isGroup: true, text: "Shelf", horiz: false },
        { isGroup: true, text: "Board", horiz: true },
        // { type: "Serial Port", text: "Port", color: "#fff", source: "./images/serial-port.svg", width: 100, height: 120 },
        // { type: "Serial Port", text: "Port", color: "#fff", source: "./images/serial.svg", width: 100, height: 120 },
        // { type: "Serial Port", text: "Port", color: "#fff", source: "./images/port001.svg", width: 100, height: 120 },
        // { type: "Serial Port", text: "Port", color: "#fff", source: "./images/port001.svg", width: 100, height: 120 },
        // { type: "Serial Port", text: "Port", color: "#fff", source: "./images/port002.svg", width: 100, height: 120 },
        // { type: "Serial Port", text: "Port", color: "#fff", source: "./images/port003.svg", width: 100, height: 120 },
    ]);



    // create the model data that will be represented by Nodes and Links
    // myDiagram.model = new go.GraphLinksModel(
    //     [
    //         { key: 1, text: "Alpha", color: "lightblue" },
    //         { key: 2, text: "Beta", color: "orange" },
    //         { key: 3, text: "Gamma", color: "lightgreen" },
    //         { key: 4, text: "Delta", color: "pink" }
    //     ],
    //     [
    //         { from: 1, to: 2 },
    //         { from: 1, to: 3 },
    //         { from: 3, to: 4 }
    //     ]);
}
window.addEventListener('DOMContentLoaded', init);

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
        ok = e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true);
    }
    if (!ok) e.diagram.currentTool.doCancel();
}


