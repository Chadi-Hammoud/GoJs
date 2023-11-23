import * as go from "../node_modules/gojs/release/go.mjs";

let myDiagram;


const init = () => {
    var $ = go.GraphObject.make;
    myDiagram =
        new go.Diagram("myDiagramDiv",  // must be the ID or reference to div
            {
                layout: $(go.GridLayout,
                    { comparer: go.GridLayout.smartComparer }),
                "SelectionMoved": e => e.diagram.layoutDiagram(true),
                "undoManager.isEnabled": true,
                "commandHandler.archetypeGroupData": { isGroup: true, text: "Group", horiz: false },
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,

                mouseDrop: e => console.log(e),
            });


    // define the Node template
    myDiagram.nodeTemplate =
        $(go.Node, "Spot",
            // make sure the Node.location is different from the Node.position
            { locationSpot: go.Spot.Center },
            new go.Binding("text", "text"),  // for sorting
            $(go.Shape, "Ellipse",
                {
                    fill: "lightgray",
                    stroke: null,
                    desiredSize: new go.Size(30, 30)
                },
                new go.Binding("fill", "fill"),
                new go.Binding("desiredSize", "size")),
            $(go.TextBlock,
                // the default alignment is go.Spot.Center
                new go.Binding("text", "text"))
        );


    var nodeDataArray = [];
    for (var i = 0; i < 100; i++) {
        nodeDataArray.push({
            key: i,
            text: i.toString(),
            fill: go.Brush.randomColor(),
            size: new go.Size(30 + Math.floor(Math.random() * 50), 30 + Math.floor(Math.random() * 50))
        });
    }

    // randomize the data
    for (i = 0; i < nodeDataArray.length; i++) {
        var swap = Math.floor(Math.random() * nodeDataArray.length);
        var temp = nodeDataArray[swap];
        nodeDataArray[swap] = nodeDataArray[i];
        nodeDataArray[i] = temp;
    }


    // create a Model that does not know about link or group relationships
    myDiagram.model = new go.Model(nodeDataArray);

    // layout using the latest parameters
    layout();

}
window.addEventListener('DOMContentLoaded', init);

function layout() {
    myDiagram.startTransaction("change Layout");
    var lay = myDiagram.layout;

    var wrappingColumn = document.getElementById("wrappingColumn").value;
    lay.wrappingColumn = parseFloat(wrappingColumn, 10);

    var wrappingWidth = document.getElementById("wrappingWidth").value;
    lay.wrappingWidth = parseFloat(wrappingWidth, 10);

    var cellSize = document.getElementById("cellSize").value;
    lay.cellSize = go.Size.parse(cellSize);

    var spacing = document.getElementById("spacing").value;
    lay.spacing = go.Size.parse(spacing);

    var alignment = getRadioValue("alignment");
    if (alignment === "Position") {
        lay.alignment = go.GridLayout.Position;
    } else {
        lay.alignment = go.GridLayout.Location;
    }

    var arrangement = getRadioValue("arrangement");
    if (arrangement === "LeftToRight") {
        lay.arrangement = go.GridLayout.LeftToRight;
    } else {
        lay.arrangement = go.GridLayout.RightToLeft;
    }

    var sorting = document.getElementById("sorting").value;
    switch (sorting) {
        default:
        case "Forward": lay.sorting = go.GridLayout.Forward; break;
        case "Reverse": lay.sorting = go.GridLayout.Reverse; break;
        case "Ascending": lay.sorting = go.GridLayout.Ascending; break;
        case "Descending": lay.sorting = go.GridLayout.Descending; break;
    }

    myDiagram.commitTransaction("change Layout");
}


function getRadioValue(name) {
    var radio = document.getElementsByName(name);
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) return radio[i].value;
    }
}


window.layout = layout;