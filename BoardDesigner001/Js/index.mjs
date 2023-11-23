import * as go from "../../node_modules/gojs/release/go.mjs";


let myDiagram;
let palette;

function init() {

  let $ = go.GraphObject.make;

  myDiagram = $(go.Diagram, "myDiagramDiv", {
    initialContentAlignment: go.Spot.Center,
    allowDrop: true  // allow nodes to be dropped onto the main diagram
  });
//  myDiagram.toolManager.resizingTool.computeReshape = function () { return false; }

 


  myDiagram.groupTemplateMap.add("board",
    $(go.Group, "vertical", {

     // resizable: true,
      resizeObjectName: "shape", // Specify the name of the object to resize
      
      click: (e, obj) => {
        console.log("Node Clicked :", obj.data);

      },
    },
       new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), // This line ensures that the group's location is bound and can be moved
      $(go.Panel, "Auto",
        $(go.Shape, "RoundedRectangle", {
          name: "shape",
          fill: "gray",
          width: 500, height: 500,
        },
          new go.Binding("fill", "color"),
          new go.Binding("width", "width"),
          new go.Binding("height", "height"),
        ),
        $(go.Placeholder, {
          padding: 5
        })
      ),

    ),
  );


  myDiagram.nodeTemplateMap.add("port",
    $(go.Node, "Spot",
      {
        resizable: true,
        resizeObjectName: "PICTURE",

        click: (e, obj) => {
          console.log("Port Clicked :", obj.data);
        },
      },
      $(go.Picture,
        {
          height: 150,
          width: 80,
          name: "PICTURE"
        },
        new go.Binding("source"),
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
      ),
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), // This line ensures that the group's location is bound and can be moved
    ),
  
  );










 

  myDiagram.model = new go.GraphLinksModel(
    [
      { key: "boardGroup", isGroup: true, category: "board" },
      { key: "port1", group: "boardGroup", source: "../../images/port001.svg", category: "port" },
      { key: "port2", group: "boardGroup", source: "../../images/port001.svg", category: "port" },

    ]
  )







}
window.addEventListener('DOMContentLoaded', init);



