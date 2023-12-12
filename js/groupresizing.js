import * as go from "../node_modules/gojs/release/go.mjs";

let $ = go.GraphObject.make;

// Create a diagram with a custom resizing tool for multiple nodes
const myDiagram = $(go.Diagram, "myDiagramDiv", {
    // other diagram settings...
    initialContentAlignment: go.Spot.Center,
    "undoManager.isEnabled": true,
    // "resizingTool.computeMinSize": function () {  // method override
    //     const group = this.adornedObject.part;
    //     console.log(group);  // Debugging line

    //     if (isNodeGroup(group) && group && group.diagram) {
    //         const membnds = group.diagram.computePartsBounds(group.memberParts);
    //         membnds.addMargin(new go.Margin(5));
    //         membnds.unionPoint(group.location);
    //         return membnds.size;
    //     } else {
    //         console.log("It is a simple node!");
    //         if (group instanceof go.Node) {
    //             // Perform actions based on the resized node, e.g., update data properties
    //             var newSize = group.actualBounds.size;
    //             myDiagram.model.setDataProperty(group.data, "width", newSize.width);
    //             myDiagram.model.setDataProperty(group.data, "height", newSize.height);
    //             console.log("New Node Data:", group)
    //         }
    //         return
    //     }
    // }
});

function isNodeGroup(node) {
    if (node && node.data) {
        return node.data.isGroup === true;
    }
    return false;
}

// Define a group template
myDiagram.groupTemplate =
    $(go.Group, "Auto",
        {
            resizable: true,
            click: (e, obj) => { console.log(e, obj); },
            dragComputation: function (group, pt, gridpt) {
                // Custom drag computation logic for resizing a group
                var data;
                var key;

                group.memberParts.each(function (node) {
                    if (node instanceof go.Node) {
                        key = node.key;
                        data = myDiagram.model.findNodeDataForKey(key);

                        if (data) {
                            var x = node.location.x;
                            var y = node.location.y;
                            let w = group.actualBounds.width / 3; // You can adjust this value
                            let z = group.actualBounds.height / 3; // You can adjust this value

                            myDiagram.model.setDataProperty(data, "width", w);
                            myDiagram.model.setDataProperty(data, "height", w);
                            var newLocation = new go.Point(x + w / 3, y + z / 3); // Adjust the calculation as needed
                            myDiagram.model.setDataProperty(data, "location", newLocation);
                            node.updateTargetBindings();
                        }
                    }
                });
                return pt;
            },

        }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "Rectangle", { name: "SHAPE", fill: "rgba(128,128,128,0.2)", stroke: "gray", strokeWidth: 2 }),
        $(go.Placeholder, { padding: 10 })
    );

// Define a simple node template
myDiagram.nodeTemplate =
    $(go.Node, "Auto",
        {
            resizable: true,
            click: (e, obj) => {
                console.log(obj);
                //console.log(myDiagram);
            }
        },
        new go.Binding("width", "width", null, null),
        new go.Binding("height", "height", null, null),
        $(go.Shape, "Rectangle", { fill: "lightblue" }),
        $(go.TextBlock, { margin: 8 },
            new go.Binding("text", "key"))
    );

// Add some nodes and a group to the diagram
myDiagram.model = new go.GraphLinksModel(
    [
        { key: "Alpha", group: "Group", loc: "0 0", width: 100, height: 100 },
        { key: "Beta", group: "Group", loc: "150 0", width: 100, height: 100 },
        { key: "Gamma", group: "Group", loc: "0 150", width: 100, height: 100 },
        { key: "Group", isGroup: true }
    ]
);
