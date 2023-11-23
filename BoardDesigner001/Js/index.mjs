import * as go from "../../node_modules/gojs/release/go.mjs";


let myDiagram;
let palette;

function init() {

  let $ = go.GraphObject.make;

  myDiagram = $(go.Diagram, "myDiagramDiv", {
    initialContentAlignment: go.Spot.Center,
    allowDrop: true  // allow nodes to be dropped onto the main diagram
  });

  palette = $(go.Palette, "myPaletteDiv", {
    layout: $(go.GridLayout, {
      cellSize: new go.Size(200, 20),
      wrappingColumn: 1
    }),
    allowDragOut: true  // allow nodes to be dragged out of the palette
  });


  myDiagram.groupTemplateMap.add("board",
    $(go.Group, "vertical",{
      
      resizable :true ,
    
    } ,
   
      $(go.Panel, "Auto",
        $(go.Shape, "RoundedRectangle",
          { fill: "beige" },
          new go.Binding("fill", "color"),
        ),
        $(go.Placeholder,
          { padding: 5 }
        )
      ),

    ),

  );

  myDiagram.nodeTemplateMap.add("port",
    $(go.Node, "Spot",
      $(go.Shape, "Rectangle",
        { fill: "transparent", stroke: "transparent" }
      ),
      $(go.Picture, { height: 150, width: 80 },
        new go.Binding("source"),
        new go.Binding("height"),
        new go.Binding("width"),
      ),
    )
  );



  palette.nodeTemplateMap.add("port",
    $(go.Node, "Spot",
      $(go.Shape, "Rectangle",
        { fill: "transparent", stroke: "transparent" }
      ),
      $(go.Picture, { height: 150, width: 80 },
        new go.Binding("source"),
        new go.Binding("height"),
        new go.Binding("width"),
      ),
    )
  );


  myDiagram.model = new go.GraphLinksModel(
    [
      { key: "boardGroup", isGroup: true, category: "board" },
      { key: "port1", group: "boardGroup", source: "../../images/port001.svg", category: "port" },
      { key: "port2", group: "boardGroup", source: "../../images/port001.svg", category: "port" },

    ]
  )


  palette.model = new go.GraphLinksModel(
    [
      { key: "pic1", text: "Port", source: "../../images/port001.svg", category: "port" },
      { key: "pic2", text: "Port", source: "../../images/port001.svg", category: "port" },
      { key: "pic3", text: "Port", source: "../../images/port002.svg", category: "port" },
      { key: "pic4", text: "Port", source: "../../images/port003.svg", category: "port" },

    ]
  )


  

}
window.addEventListener('DOMContentLoaded', init);



