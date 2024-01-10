import { myDiagram } from "../../ShelfType/Js/Diagram.mjs";
import { MotherBoardTypeSlot } from "./MotherBoardTypeSlot.mjs";

class BoardType {
    static nextId = 1;

    constructor() {
        this.board = {
            id: BoardType.nextId++,
            ports: this.getPorts()
        };

        this.motherBoardTypeSlots = new Set();
    }

    getBoardKey() {
        return this.board.id;
    }

    getPorts() {
        let ports = [];
        let boardCategory = "board";
        let allNodes = myDiagram.findNodesByExample({ category: boardCategory });

        allNodes.each(function (node) {
            ports.push(node);
        });

        return ports;
    }

    getMotherBoardTypeSlots(){
        return this.motherBoardTypeSlots;
    }

    setMotherBoardTypeSlots(motherBoardTypeSlots){
        this.motherBoardTypeSlots = motherBoardTypeSlots;
    }
}

let boardType = new BoardType();

export {boardType};
