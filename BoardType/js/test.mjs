
import { $, myDiagram } from "../../ShelfType/Js/Diagram.mjs";

import { portDesigner } from "../../CabinetType/Js/NodeTemplate.mjs";

myDiagram.nodeTemplateMap.add(portDesigner);


function init(divWidth, divHeight) {
  let borderCount = parseInt(prompt("boards count"));
  let startIndex = parseInt(prompt("start Index, 0 or 1"));
  let isVertical = prompt("is vertical?, v ");







  myDiagram.model = new go.GraphLinksModel();

  let indexSlot = 0;



  function addPort() {
    let defaultValue = isNaN(startIndex) ? startIndex : 0;
    let tempVal = 0.0;
    let backWidth = 0;
    let backHeight = 0;
    for (let i = 1; i <= borderCount; i++) {

      let dis = divHeight / borderCount
      if (isVertical !== 'v') {

        backWidth =  divWidth ;
        myDiagram.model.addNodeData({
          key: `port${defaultValue}`,
          category: "port",
          width:  divWidth ,
          height: dis,
          text: `${defaultValue}:${indexSlot}`,
          location: `0 ${tempVal}`,
          visible: true,
          source: "http://127.0.0.1:5500/BoardType/images/port.svg",
        });

        backHeight += dis;

      } else {

        backHeight = divHeight;

        myDiagram.model.addNodeData({
          key: `port${startIndex}`,
          category: "port",
          width: dis,
          height: divHeight,
          text: `${defaultValue}:${indexSlot}`,
          location: `${tempVal} 0`,
          visible: true,
          source: "http://127.0.0.1:5500/BoardType/images/port.svg",
        });

        backWidth += dis;
        //myDiagram.model.addNodeData({ key: `port${startIndex}`, group: "shelfGroup", category: "board", width: 300, height: 120, text: `${startIndex}:${indexSlot}` });
      }
      tempVal += dis;
      defaultValue++;

    }


  }

  addPort();



}
window.onload = init;






