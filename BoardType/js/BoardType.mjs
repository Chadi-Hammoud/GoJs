import { myDiagram } from "../../ShelfType/Js/Diagram.mjs";


class BoardType {
    static nextId = 1;

    constructor() {
        this._board = {
            id: BoardType.nextId++,
            ports: this.getPorts()
        };

        this._motherBoardTypeSlots = new Set();
    }

    get boardKey() {
        return this._board.id;
    }

    get motherBoardTypeSlots() {
        return this._motherBoardTypeSlots;
    }

    set motherBoardTypeSlots(motherBoardTypeSlots) {
        this._motherBoardTypeSlots = motherBoardTypeSlots;
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
}


export { BoardType };
