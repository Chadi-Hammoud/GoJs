import * as go from "../../node_modules/gojs/release/go.mjs";


let myDiagram;


function init() {


  let $ = go.GraphObject.make;



  myDiagram = new go.Diagram("myDiagramDiv",
    {
      // when a drag-drop occurs in the Diagram's background, make it a top-level node
      // mouseDrop: e => finishDrop(e, null),
      layout:  // Diagram has simple horizontal layout
        new go.GridLayout(
          { wrappingWidth: Infinity, alignment: go.GridLayout.Position, cellSize: new go.Size(1, 1) }),
      "commandHandler.archetypeGroupData": { isGroup: true, text: "Group", horiz: false },
      "undoManager.isEnabled": true
    });
  myDiagram.toolManager.resizingTool.computeReshape = function () { return false; }


  function makeLayout(horiz) {  // a Binding conversion function
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

  function defaultColor(horiz) {  // a Binding conversion function
    return horiz ? "lightgray" : "lightgray";
  }

  function defaultFont(horiz) {  // a Binding conversion function
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
  //       background: "gray",
  //       //ungroupable: true,
  //       resizable: false,
  //       //computesBoundsAfterDrag: true,
  //       //computesBoundsIncludingLocation: true,


  //       // handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
  //       // Groups containing Groups lay out their members horizontally
  //       layout: makeLayout(false)
  //     })
  //     .bind("layout", "horiz", makeLayout)
  //     .bind(new go.Binding("background", "isHighlighted", h => h ? "rgba(255,0,0,0.2)" : "transparent").ofObject())
  //     .add(new go.Shape("Rectangle",
  //       { fill: null, stroke: defaultColor(false), fill: defaultColor(false), strokeWidth: 2 })
  //       .bind("stroke", "horiz", defaultColor)
  //       .bind("fill", "horiz", defaultColor))
  //     .add(
  //       new go.Panel("Vertical")  // title above Placeholder
  //         .add(new go.Panel("Horizontal",  // button next to TextBlock
  //           { stretch: go.GraphObject.Horizontal, background: defaultColor(false) })
  //           .bind("background", "horiz", defaultColor)
  //           .add(go.GraphObject.make("SubGraphExpanderButton", { alignment: go.Spot.Right, margin: 5 }))
  //           .add(new go.TextBlock(
  //             {
  //               //alignment: go.Spot.Left,
  //               // editable: true,
  //               margin: 5,
  //               font: defaultFont(false),
  //               opacity: 0.95,  // allow some color to show through
  //               stroke: "#404040"
  //             })
  //             .bind("font", "horiz", defaultFont)
  //             .bind("text", "text", null, null)) // `null` as the fourth argument makes this a two-way binding
  //         )  // end Horizontal Panel
  //         .add(new go.Placeholder({ padding: 5, alignment: go.Spot.TopLeft }))
  //     ));


  myDiagram.nodeTemplateMap.add("board",
    $(go.Node, "Spot",
      {
        resizable: true,
        resizeObjectName: "SHAPE",
        //desiredSize: new go.Size(400, 130),
      },
      $(go.Panel, "Vertical",
      
        $(go.Panel, "Horizontal",
          {
            click: (e, obj) => {
              console.log("Port Clicked :", obj);
            },
            columnSizing: go.RowColumnDefinition.None,
            height: 20,


          },
          $(go.Shape, "rectangle",
            {
              fill: "black",
              alignment: go.Spot.Right,
              stretch: go.GraphObject.None, // Don't stretch the white section
              desiredSize: new go.Size(20, 20), // Set the desired size

              margin: 0 // Set the padding to 0

            },
          ),
          new go.Binding("width", "width", v => v / 4, null),

          $(go.Shape, "rectangle",
            {
              fill: "white",
              alignment: go.Spot.Center,
              stretch: go.GraphObject.None, // Don't stretch the white section

              maxSize: new go.Size(200, 20), // Set the max size
              minSize: new go.Size(200, 20), // Set the min size
              margin: 0 // Set the padding to 0
            },
            new go.Binding("width", "width", v => v / 2, null),
          ),

          $(go.Shape, "rectangle",
            {
              fill: "black",
              alignment: go.Spot.Left,
              stretch: go.GraphObject.None, // Don't stretch the white section

              desiredSize: new go.Size(20, 20), 
              margin: 0 // Set the padding to 0

            },
          ),
          new go.Binding("width", "width", v => v / 4, null),
        ),

        $(go.Panel, {},
          $(go.Shape, "rectangle",
            {
              //  name  :"SHAPE",
              fill: "gray",
              alignment: go.Spot.Left,
              stretch: go.GraphObject.None, // Don't stretch the white section
              desiredSize: new go.Size(242, 100), // Set the desired size

              margin: 0, // Set the padding to 0

            }
          ),
          new go.Binding("desiredSize", "size", null, new go.Size(200, 100)),
          new go.Binding("width", "width", v => v / 4, null),
        ),
        new go.Binding("width", "width", null, null),

      ),

    )
  );







  myDiagram.model = new go.GraphLinksModel(
    [
      // { key: "boardGroup", isGroup: true, category: "shelf" },
      // { key: "port1", group: "boardGroup", category: "board" },
      // { key: "port2", group: "boardGroup", category: "board" },
      // { key: "port3", group: "boardGroup", category: "board" },
      { key: "port1", category: "board", width: 2000, size: new go.Size(200, 100) },

    ]
  )







}
window.addEventListener('DOMContentLoaded', init);



