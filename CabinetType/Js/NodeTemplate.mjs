
import { $, myDiagram } from "../../ShelfType/Js/Diagram.mjs";



let cabinetDesigner = myDiagram.nodeTemplateMap.add("cabinet",
  $(go.Node, "Auto",
    new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
    new go.Binding("visible", "visible", null, null),
    new go.Binding("fromRu", "fromRu", null, null),
    new go.Binding("toRu", "toRu", null, null),

    {
      resizable: true,
      resizeObjectName: "PANEL",
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
          }),
      ),


    },

    $(go.Panel, "Vertical",

      new go.Binding("width", "width", null, null),
      new go.Binding("height", "height", null, null),
      new go.Binding("marginLeft", "marginLeft").makeTwoWay(),
      new go.Binding("marginTop", "marginTop").makeTwoWay(),
      new go.Binding("marginRight", "marginRight").makeTwoWay(),
      new go.Binding("marginBottom", "marginBottom").makeTwoWay(),

      {
        name: "PANEL",
      },
      $(go.Panel, "Horizontal",
        new go.Binding("width", "width", null, null),
        { height: 14 },
        $(go.Shape, "Rectangle",
          {
            fill: "black",
            width: 10,
          }
        ),
        $(go.Panel, "Auto",
          $(go.Shape, "Rectangle",
            new go.Binding("width", "width", v => v - 20),
            {
              fill: "white",
              stretch: go.GraphObject.Fill,
            }
          ),
          $(go.TextBlock, "",
            {
              name: "boardTextblock",
              margin: 2,
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
        )
      ),

      $(go.Shape, "Rectangle",
        new go.Binding("height", "height", null, null),
        {
          height: 100,
          fill: "gray",
          stretch: go.GraphObject.Fill,
        }
      )
    ),
  ),

);


let slotDesigner = myDiagram.nodeTemplateMap.add("slot",
  $(go.Node, "Auto",
    new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
    new go.Binding("visible", "visible", null, null),
    new go.Binding("rear", "rear", null, null),
    new go.Binding("indexOnSlot", "indexOnSlot", null, null),
    new go.Binding("slot", "slot", null, null),

    {
      resizable: true,
      resizeObjectName: "PANEL",
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
          }),
      ),


    },

    $(go.Panel, "Vertical",

      new go.Binding("width", "width", null, null),
      new go.Binding("height", "height", null, null),
      new go.Binding("marginLeft", "marginLeft").makeTwoWay(),
      new go.Binding("marginTop", "marginTop").makeTwoWay(),
      new go.Binding("marginRight", "marginRight").makeTwoWay(),
      new go.Binding("marginBottom", "marginBottom").makeTwoWay(),

      {
        name: "PANEL",
      },
      $(go.Panel, "Horizontal",
        new go.Binding("width", "width", null, null),
        { height: 14 },
        $(go.Shape, "Rectangle",
          {
            fill: "black",
            width: 10,
          }
        ),
        $(go.Panel, "Auto",
          $(go.Shape, "Rectangle",
            new go.Binding("width", "width", v => v - 20),
            {
              fill: "white",
              stretch: go.GraphObject.Fill,
            }
          ),
          $(go.TextBlock, "",
            {
              name: "boardTextblock",
              margin: 2,
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
        )
      ),

      $(go.Shape, "Rectangle",
        new go.Binding("height", "height", null, null),
        {
          height: 100,
          fill: "gray",
          stretch: go.GraphObject.Fill,
        }
      )
    ),
  ),

);


let portDesigner = myDiagram.nodeTemplateMap.add("port",
  $(go.Node, "Auto",
    new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
    new go.Binding("visible", "visible", null, null),
    new go.Binding("width", "width", null, null),
    new go.Binding("height", "height", null, null),

    {
      resizable: true,
      resizeObjectName: "PANEL",
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
          }),
      ),


    },

    $(go.Panel, "Vertical",
      {
        name: "PANEL",
        position: new go.Binding("position", "height", function (h, panel) {
          return new go.Point(0, computeClippingTop(h, panel));
        }).ofObject("PANEL"),
        // padding: { top: 10, right: 0, bottom: 20, left: 0 }
        
      },
      new go.Binding("marginLeft", "marginLeft").makeTwoWay(),
      new go.Binding("marginTop", "marginTop").makeTwoWay(),
      new go.Binding("marginRight", "marginRight").makeTwoWay(),
      new go.Binding("marginBottom", "marginBottom").makeTwoWay(),

      new go.Binding("width", "width", null, null),
      new go.Binding("height", "height", null, null),

      {
        name: "PANEL",

      },
      $(go.Panel, "Horizontal",
        new go.Binding("width", "width", null, null),
        { height: 16 },
        $(go.Shape, "Rectangle",
          {
            fill: "black",
            width: 10,
          }
        ),
        $(go.Panel, "Auto",
        
          $(go.Shape, "Rectangle",
            new go.Binding("width", "width", v => v - 23),
            {
              fill: "#F0f0f0",
              //stretch: go.GraphObject.Fill,
            }
          ),
          $(go.TextBlock, "",
            // new go.Binding("height", "height", null, null),
            {
              name: "boardTextblock",
              margin: 2,
              alignment: go.Spot.Left,
              height: 16,
              font: "bold 14px Arial, sans-serif",
            },
            new go.Binding("text", "text").makeTwoWay()
          )
        ),
        $(go.Shape, "Rectangle",
          {
            fill: "black",
            width: 12,
          }
        )
      ),
      $(go.Picture,
        new go.Binding("height", "height", null, null),
        new go.Binding("width", "width", null, null),
        
        {
          background: "white",
          name: "PANEL",
          alignment: new go.Spot(0.5, 0, 0.5, 0), // Align the center horizontally and the top vertically
          stretch: go.GraphObject.UniformToFill,
          // margin: new go.Margin(10, 0, 0, 0) 
        
        },
        new go.Binding("source", "source")
      ),


    ),
  ),

);

export { slotDesigner, portDesigner, cabinetDesigner };