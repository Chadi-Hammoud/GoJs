
import * as go from "../../node_modules/gojs/release/go.mjs";

let myDiagram;

function init() {

  let b = parseInt(prompt("boards count"));

  let $ = go.GraphObject.make;

  myDiagram = new go.Diagram("myDiagramDiv",
    {
      // when a drag-drop occurs in the Diagram's background, make it a top-level node
      // mouseDrop: e => finishDrop(e, null),
      layout: // Diagram has simple horizontal layout
        new go.GridLayout(
          { wrappingWidth: Infinity, alignment: go.GridLayout.Position, cellSize: new go.Size(1, 1) }),
      "commandHandler.archetypeGroupData": { isGroup: true, text: "Group", horiz: false },
      "undoManager.isEnabled": true
    });
  // myDiagram.toolManager.resizingTool.computeReshape = function () { return false; }

  function makeLayout(horiz) { // a Binding conversion function
    if (horiz) {
      return new go.GridLayout(
        {
          wrappingWidth: Infinity, alignment: go.GridLayout.Position,
          cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
        });
    } else {
      return new go.GridLayout(
        {
          wrappingColumn: Infinity, alignment: go.GridLayout.Position,
          cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
        });
    }
  }

  function defaultColor(horiz) { // a Binding conversion function
    return horiz ? "lightgray" : "lightgray";
  }

  function defaultFont(horiz) { // a Binding conversion function
    return horiz ? "bold 20px sans-serif" : "bold 16px sans-serif";
  }

  // myDiagram.addDiagramListener("Modified", function(e) {
  //   let board = e.subject.part;
  //   let shelf = myDiagram.findNodeForKey("shelf");
  //   if (board.actualBounds.intersects(shelf.actualBounds)) {
  //     board.visible = false;
  //   } else {
  //     board.visible = true;
  //   }
  // });

  // myDiagram.groupTemplateMap.add("shelf",
  //   new go.Group("Auto",
  //     {
  //       layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
  //       background: "gray",
  //       //ungroupable: true,
  //       resizable: false,
       
        
  //     })
  //     //.bind("layout", "horiz", makeLayout)
  //    // .bind(new go.Binding("background", "isHighlighted", h => h ? "rgba(255,0,0,0.2)" : "transparent").ofObject())
  //     .add(new go.Shape("Rectangle",
  //       { fill: null, stroke: defaultColor(false), fill: defaultColor(false), strokeWidth: 2 })
  //       .bind("stroke", "horiz", defaultColor)
  //       .bind("fill", "horiz", defaultColor))
  //     .add(
  //       new go.Panel("Vertical") // title above Placeholder
  //         .add(new go.Panel("Horizontal", // button next to TextBlock
  //           { stretch: go.GraphObject.Horizontal, background: defaultColor(false) })
  //           .bind("background", "horiz", defaultColor)
  //           .add(go.GraphObject.make("SubGraphExpanderButton", { alignment: go.Spot.Right, margin: 5 }))
  //           .add(new go.TextBlock(
  //             {
  //               //alignment: go.Spot.Left,
  //               // editable: true,
  //               margin: 5,
  //               font: defaultFont(false),
  //               opacity: 0.95, // allow some color to show through
  //               stroke: "#404040"
  //             })
  //             .bind("font", "horiz", defaultFont)
  //             .bind("text", "text", null, null)) // `null` as the fourth argument makes this a two-way binding
  //         ) // end Horizontal Panel
  //         .add(new go.Placeholder({ padding: 5, alignment: go.Spot.TopLeft }))
  //     ));



  //   myDiagram.nodeTemplateMap.add("board",
  //   $(go.Node, "Spot",
  //     {
  //       resizable: true,
  //       resizeObjectName: "SHAPE",
  //       //desiredSize: new go.Size(400, 130),
  //     },
  //     $(go.Panel, "Vertical",

  //       $(go.Panel, "Horizontal",
  //         {
  //           click: (e, obj) => {
  //             console.log("Port Clicked :", obj);
  //           },
  //           columnSizing: go.RowColumnDefinition.None,
  //           height: 20,


  //         },
  //         $(go.Shape, "rectangle",
  //           {
  //             fill: "black",
  //             alignment: go.Spot.Right,
  //             stretch: go.GraphObject.None, // Don't stretch the white section
  //             desiredSize: new go.Size(20, 20), // Set the desired size

  //             margin: 0 // Set the padding to 0

  //           },
  //         ),
  //         new go.Binding("width", "width", v => v / 4, null),

  //         $(go.Shape, "rectangle",
  //           {
  //             fill: "white",
  //             alignment: go.Spot.Center,
  //             stretch: go.GraphObject.None, // Don't stretch the white section

  //             maxSize: new go.Size(200, 20), // Set the max size
  //             minSize: new go.Size(200, 20), // Set the min size
  //             margin: 0 // Set the padding to 0
  //           },
  //           new go.Binding("width", "width", v => v / 2, null),
  //         ),

  //         $(go.Shape, "rectangle",
  //           {
  //             fill: "black",
  //             alignment: go.Spot.Left,
  //             stretch: go.GraphObject.None, // Don't stretch the white section

  //             desiredSize: new go.Size(20, 20), 
  //             margin: 0 // Set the padding to 0

  //           },
  //         ),
  //         new go.Binding("width", "width", v => v / 4, null),
  //       ),

  //       $(go.Panel, {},
  //         $(go.Shape, "rectangle",
  //           {
  //             //  name  :"SHAPE",
  //             fill: "gray",
  //             alignment: go.Spot.Left,
  //             stretch: go.GraphObject.None, // Don't stretch the white section
  //             desiredSize: new go.Size(242, 100), // Set the desired size

  //             margin: 0, // Set the padding to 0

  //           }
  //         ),
  //         new go.Binding("desiredSize", "size", null, new go.Size(200, 100)),
  //         new go.Binding("width", "width", v => v / 4, null),
  //       ),
  //       new go.Binding("width", "width", null, null),

  //     ),

  //   )
  // );

  //   go.Shape.defineFigureGenerator("headSection", function(shape, w, h) {
  //     var geo = new go.Geometry();
  //     var fig = new go.PathFigure(0, 0, true); // starting point
  //     geo.add(fig);

  //     // Top section (head)
  //     fig.add(new go.PathSegment(go.PathSegment.Line, w, 0));
  //     fig.add(new go.PathSegment(go.PathSegment.Line, w, 20));
  //     fig.add(new go.PathSegment(go.PathSegment.Line, 0, 20).close()); // height = 20px

  //     return geo;
  // });

  // go.Shape.defineFigureGenerator("BottomSection", function(shape, w, h) {
  //     var geo = new go.Geometry();
  //     var fig = new go.PathFigure(0, 0, true); // starting point
  //     geo.add(fig);

  //     // Bottom section (body)
  //     fig.add(new go.PathSegment(go.PathSegment.Line, 0, 20)); // Adjust starting point to match the ending point of the "headSection"
  //     fig.add(new go.PathSegment(go.PathSegment.Line, w, 20));
  //     fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
  //     fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close()); // height = h - 20px

  //     return geo;
  // });

  myDiagram.nodeTemplateMap.add("board",
    $(go.Node, "Auto",
      {
        resizable: true,
        resizeObjectName: "PANEL", // Set resizeObjectName to the name of the panel
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized
      },
      $(go.Panel, "Vertical",
        new go.Binding("width", "width", null, null),
        new go.Binding("height", "height", null, null),

        {
          name: "PANEL", // Give the panel a name for referencing in resizeObjectName
        },
        $(go.Panel, "Horizontal",

          { height: 20, stretch: go.GraphObject.Fill, },
          $(go.Shape, "Rectangle",
            new go.Binding("width", "width", v => v / 12, null),
            {
              fill: "black",
            }
          ),


          $(go.Shape, "Rectangle",
            new go.Binding("width", "width", v => v * 0.83, null),

            {
              fill: "white",
              stretch: go.GraphObject.Fill, // Make the shape resizable
             
            }
          ),
          $(go.Shape, "Rectangle",
            new go.Binding("width", "width", v => v / 10, null),
            {
              fill: "black",


            }
          ),

          $(go.TextBlock,"",
            {
              margin: 5, // Add some margin to position the text inside the rectangle
              editable: true, // Make the text editable
              stroke: "black", // Set the text color to white
              alignment: go.Spot.Center, // Center the text within the shape
            },
            new go.Binding("text", "text").makeTwoWay() // Bind the text to the 'text' property of the node data
          )
        ),
        new go.Binding("width", "width").makeTwoWay(),

        $(go.Shape, "Rectangle",
          new go.Binding("height", "height", null, null),
          {
            height: 100,
            fill: "gray",
            stretch: go.GraphObject.Fill, // Make the shape resizable

          }
        )
      ),
    ),

  );



  // myDiagram.model = new go.GraphLinksModel(
  //   [
  //     { key: "boardGroup", isGroup: true, category: "shelf" },
  //     { key: "port1", group: "boardGroup", category: "board", width: 120, height: 120 },
  //     { key: "port2", group: "boardGroup", category: "board", width: 120, height: 120 },
  //     { key: "port3", group: "boardGroup", category: "board", width: 120, height: 120 },
  //     //{ key: "port1", category: "board", width: 120, height: 120 }, // Initial height value, you can set it accordingly


  //   ]
  // )




  // Clear existing nodes
  myDiagram.model = new go.GraphLinksModel();
  //myDiagram.model.addNodeData({ key: "boardGroup", isGroup: true, category: "shelf" }) ;
  // Add nodes dynamically based on the user input
  let lay = prompt("is Vertical ?");
  if(lay){
    for (let i = 1; i <= b; i++) {
      // myDiagram.model.addNodeData({ key: `port${i}`, group: "boardGroup", category: "board", width: 120, height: 120  });
       myDiagram.model.addNodeData({ key: `port${i}`, category: "board", width: 120, height: 120  });
   
     }
  }else{

    for (let i = 1; i <= b; i++) {
      // myDiagram.model.addNodeData({ key: `port${i}`, group: "boardGroup", category: "board", width: 120, height: 120  });
       myDiagram.model.addNodeData({ key: `port${i}`, category: "board", width: 120, height: 120  });
   
     }
  }
 

}


window.addEventListener('DOMContentLoaded', init);
//
//In this code, we have created a custom figure for the shape of the node. The figure is a rectangle with a custom head and body. The head has a height of 20px, and the body has a height of `h - 20px`. The fill of the head is white, and the fill of the body is gray.
//
//The node template is defined with the custom shape. The width and height of the node are set to 120 and 100 respectively. The fill of the shape is set to a linear gradient brush with a white head and a gray body.
//
//The model is initialized with a single node of category "board". The width of the node is set to 2000, and the size is set to a new go.Size object with a width of 200 and a height of 100.