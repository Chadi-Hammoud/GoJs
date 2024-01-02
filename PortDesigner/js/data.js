

// let network;

// export function setMyDiagram(diagram) {
//     network = diagram;
// };

// export function getMyDiagram() {
//     console.log(network);
//     return network
// };

myDiagram.nodeTemplateMap.add("board",
       
$(go.Node, "Auto",

new go.Binding("visible", "visible", null, null),
new go.Binding("rear", "rear", null, null),
    {
        resizable: true,
        resizeObjectName: "PANEL", // Set resizeObjectName to the name of the panel
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        selectionAdorned: false,
        resizeAdornmentTemplate: $(go.Adornment, "Spot",
            $(go.Placeholder),
            $(go.Shape, // the handle
                {
                    alignment: go.Spot.TopLeft,
                    cursor: "nw-resize",
                    desiredSize: new go.Size(6, 6),
                    fill: "transparent",
                    stroke: "transparent",

                }),
            $(go.Shape, // the handle
                {
                    alignment: go.Spot.TopRight,
                    cursor: "ne-resize",
                    desiredSize: new go.Size(6, 6),
                    fill: "transparent",
                    stroke: "transparent"
                })
        ),
        click: (e, obj) => {
            selectedNode = obj.part.data;
            sendDataToPanel(selectedNode);
            console.log(e, obj)
        },
        mouseDrop: (e, node) => {
            sendDataToPanel(node.part.data);
            console.log(node.part.data)
        },

    },
   
    new go.Binding("width", "width", w => w, null),
    new go.Binding("height", "height", w => w, null),


    $(go.Panel, "Vertical",
        new go.Binding("width", "width", w => w, null),
        new go.Binding("height", "height", w => w, null),
        // new go.Binding("marginLeft", "marginLeft").makeTwoWay(),
        // new go.Binding("marginTop", "marginTop").makeTwoWay(),
        // new go.Binding("marginRight", "marginRight").makeTwoWay(),
        // new go.Binding("marginBottom", "marginBottom").makeTwoWay(),
        {
            name: "PANEL",
        },
        $(go.Panel, "Horizontal",
            { height: 20 },
            $(go.Shape, "Rectangle",
                {
                    fill: "black",
                    width: 10,
                }
            ),
            $(go.Panel, "Auto",
                $(go.Shape, "Rectangle",
                    new go.Binding("width", "width", v => (v) - 20),
                    {
                        fill: "white",
                        stretch: go.GraphObject.Fill,
                    }
                ),
                $(go.TextBlock, "",
                    {
                        margin: 5,
                        editable: true,
                        alignment: go.Spot.Left,
                    },
                    new go.Binding("text", "text").makeTwoWay()
                )
            ),
            $(go.Shape, "Rectangle",
                {
                    fill: "black",
                    width: 10,
                }
            ),
        ),
        $(go.Picture, {
            background: "white",
            name: "PANEL",
            stretch: go.GraphObject.Fill,
        },
            new go.Binding("source", "source", null, null),
            new go.Binding("fill", "color"),
            new go.Binding("width", "width", w => w).makeTwoWay(),
            new go.Binding("height", "height", w => w).makeTwoWay(),
        )


    )
));
