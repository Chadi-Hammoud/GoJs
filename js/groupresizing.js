import * as go from "../node_modules/gojs/release/go.mjs";

let $ = go.GraphObject.make;

// Define a custom resizing tool to handle multiple nodes
class MultiResizingTool extends go.ResizingTool {
    resize(newr) {
        const diagram = this.diagram;
        diagram.selection.each(node => {
            if (node instanceof go.Node) {
                const part = node.resizeObject;
                if (part !== null) {
                    const minWidth = this.computeMinSize();
                    const maxWidth = this.computeMaxSize();

                    // Ensure the new size is within the computed min and max sizes
                    newr.width = Math.max(minWidth.width, Math.min(newr.width, maxWidth.width));
                    newr.height = Math.max(minWidth.height, Math.min(newr.height, maxWidth.height));
                }
            }
        });
        super.resize(newr);
    }

    computeMinSize() {
        const diagram = this.diagram;
        let minX = Infinity;
        let minY = Infinity;

        // Iterate over all selected parts
        diagram.selection.each(node => {
            if (node instanceof go.Node) {
                const nodePos = node.position;
                minX = Math.min(minX, nodePos.x);
                minY = Math.min(minY, nodePos.y);
            }
        });

        // Calculate the minimum size based on the minimum position
        const minSize = super.computeMinSize();
        minSize.width += minX;
        minSize.height += minY;

        return minSize;
    }

    computeMaxSize() {
        const diagram = this.diagram;
        let maxX = -Infinity;
        let maxY = -Infinity;

        // Iterate over all selected parts
        diagram.selection.each(node => {
            if (node instanceof go.Node) {
                const nodePos = node.position;
                maxX = Math.max(maxX, nodePos.x + node.actualBounds.width);
                maxY = Math.max(maxY, nodePos.y + node.actualBounds.height);
            }
        });

        // Calculate the maximum size based on the maximum position and size
        const maxSize = super.computeMaxSize();
        maxSize.width += maxX;
        maxSize.height += maxY;

        return maxSize;
    }
}


// Create a diagram with a custom resizing tool for multiple nodes
const myDiagram = $(go.Diagram, "myDiagramDiv", {
    // other diagram settings...
    initialContentAlignment: go.Spot.Center,
    "undoManager.isEnabled": true,
    "toolManager.resizingTool": new MultiResizingTool()
});

// Define a group template
myDiagram.groupTemplate =
    $(go.Group, "Auto",
        {
            resizable: true,
            click: (e, obj) => { console.log(e, obj); }
        }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "Rectangle", { name: "SHAPE", fill: "rgba(128,128,128,0.2)", stroke: "gray", strokeWidth: 2 }),
        $(go.Placeholder, { padding: 10 })
    );

// Define a simple node template
myDiagram.nodeTemplate =
    $(go.Node, "Auto",
        {
            resizable: true,
            click: (e, obj) => { console.log(e, obj); }
        },
        $(go.Shape, "Rectangle", { fill: "lightblue", width: 100, height: 60 }),
        $(go.TextBlock, { margin: 8 },
            new go.Binding("text", "key"))
    );

// Add some nodes and a group to the diagram
myDiagram.model = new go.GraphLinksModel(
    [
        { key: "Alpha", group: "Group", loc: "0 0" },
        { key: "Beta", group: "Group", loc: "150 0" },
        { key: "Gamma", group: "Group", loc: "0 150" },
        { key: "Group", isGroup: true }
    ]
);
