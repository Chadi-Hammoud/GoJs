

import { $, myDiagram } from "../../ShelfType/Js/Diagram.mjs"

import { cabinetDesigner } from "../../CabinetType/Js/NodeTemplate.mjs";
import { CabinetType } from "./CabinetType.mjs";
import { CabinetTypeSpace } from "./CabinetTypeSpace.mjs";

myDiagram.nodeTemplateMap.add(cabinetDesigner);

let caption; let fromRu; let toRu;
let shelfCount;
let numberRu;
let startedRuIndex;
let cabinetType;

let ct = new CabinetType();
let spaces = new CabinetTypeSpace();
function init() {

    shelfCount = parseInt(prompt("number of shelves"));
    numberRu = parseInt(prompt("number RU"));
    startedRuIndex = parseInt(prompt("started Ru index"));


    function removeAll(mySet, elementsToRemove) {
        elementsToRemove.forEach(element => {
            mySet.delete(element);
        });
    }
    // Clear existing nodes
    myDiagram.model = new go.GraphLinksModel();


    let addSpacesForm = document.getElementById("addSpacesForm");


    addSpacesForm.addEventListener("submit", e => {
        e.preventDefault();
        AddSpacesToCabinet(e);
    });

    function AddSpacesToCabinet(e) {
        ct.startRuIndex = startedRuIndex
        ct.numberRu = numberRu;
        let fr = parseInt(ct.startRuIndex);
        let tr = parseInt(ct.numberRu);

        let TORU = parseInt(fr + tr);

        cabinetType = ct;
        caption = document.getElementById("captionn").value;
        fromRu = parseInt(document.getElementById("fromRuu").value) === null ? 0 : parseInt(document.getElementById("fromRuu").value);
        toRu = parseInt(document.getElementById("toRuu").value) === null ? 0 : parseInt(document.getElementById("toRuu").value);


        if (!checkRUs(fromRu, toRu, ct, null)) {
            alert("choose the from and to Ru between the convenable one, and be sure it is exist into one space only");
            return;
        }
        addSpaces(cabinetType, fromRu, toRu, caption);

        document.getElementById("addSpacesSideBar").style.display = "none";

    }

    let s = new Set();
    let listOfSpaces;
    function checkRUs(fromRU, toRU, cabinetType, sps) {
        myDiagram.nodes.each(function (node) {
            s.add(node);
        });

        for (let spaces of cabinetType.getCabinetTypeSpaces()) {
            if (spaces === sps || (spaces.key == null && (spaces === sps)))
                continue;
            if ((fromRU <= spaces.toRu && fromRU >= spaces.fromRu) || (toRU <= spaces.toRu && toRU >= spaces.fromRu))
                return false;
            if (numberRu < toRU)
                return false;
        }
        return true;
    }

    function addSpaces(cabinetType, fromRu, toRu, caption) {

        let cabType = cabinetType._id;
        spaces.cabinetTypeId = cabType !== null ? cabType : null;
        spaces.fromRu = fromRu
        spaces.toRu = toRu;
        spaces.xPercentage = 0.0;
        spaces.yPercentage = 0.0;
        spaces.widthPercentage = 300.0;
        spaces.heightPercentage = 300.0;
        spaces.caption = caption;
        cabinetType.getCabinetTypeSpaces().add(spaces);

        if (spaces.fromRu > ct.numberRu || spaces.toRu > ct.numberRu) {
            alert("The number entered is bigger than the number of RU!!");
            return;
        }
        myDiagram.model.addNodeData({
            key: `slot${spaces.cabinetTypeId}`,
            category: "cabinet",
            width: spaces.widthPercentage,
            height: spaces.heightPercentage,
            text: `${spaces.caption}`,
            location: `${spaces.xPercentage} ${spaces.yPercentage}`,
            visible: true,
            fromRu: spaces.fromRu,
            toRu: spaces.toRu,
        });


        listItems();
        return spaces;
    };

    function removeSpacesFromCabinet() {
        let space = myDiagram.selection.first();
        if (space === null) {
            return;
        }
        let toRemove = [];
        for (let spaces of cabinetType.getCabinetTypeSpaces()) {

            if (spaces.fromRU === space.data.fromRU) {
                toRemove.push(spaces);
            }
        }

        let cabinetSpaces = cabinetType.getCabinetTypeSpaces();
        removeAll(cabinetSpaces, toRemove);

        myDiagram.startTransaction("delete space");
        myDiagram.model.removeNodeData(space.data);
        myDiagram.commitTransaction("delete space");
    }


    function listItems() {
        listOfSpaces = "";  // Reset the content
        myDiagram.nodes.each(function (node) {

            listOfSpaces += `${node.data.fromRu} : ${node.data.text}<br>`;
        });
    
        // Update the content of the "listOfSpaces" element
        document.getElementById("listOfSpaces").innerHTML = listOfSpaces;
    }

   

    document.getElementById("removeSpaceLink").addEventListener("click", function (e) {
        e.preventDefault();
        removeSpacesFromCabinet();
    });



    function nodeMoved(e) {
        let node = e.subject.first();

        // If a node is selected
        if (node instanceof go.Node) {
            let type = node.data.category;
            if (type === "cabinet") {
                // Get the node's location, width, and height
                //let key = node.data.key;
                let caption = node.data.text;
                let fromRU = node.data.fromRu;
                let toRu = node.data.toRu;

                let loc = node.location;
                let widthPercentage = node.data.width;
                let heightPercentage = node.data.height;
                let XPercentage = loc.x;
                let YPercentage = loc.y;




                document.getElementById('caption').value = caption;
                document.getElementById('fromRu').value = fromRU;
                document.getElementById('toRu').value = toRu;
                document.getElementById('XPercentage').value = XPercentage;
                document.getElementById('YPercentage').value = YPercentage;
                document.getElementById('widthPercentage').value = widthPercentage;
                document.getElementById('heightPercentage').value = heightPercentage;


            }
        }
    }

    // Add a listener for the ChangedSelection event
    myDiagram.addDiagramListener("ChangedSelection", function (e) {
        nodeMoved(e);
    });


    // Add a listener for the SelectionChanged event
    myDiagram.addDiagramListener("SelectionMoved", function (e) {
        nodeMoved(e);
    });


}



document.getElementById("putSpaceOnCabinet").addEventListener("click", init);


