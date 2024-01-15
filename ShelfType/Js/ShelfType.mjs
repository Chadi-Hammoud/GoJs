import { Shelf } from "./Shelf.mjs";

class ShelfType extends Shelf {

    constructor() {
        super();
        this._id = super._id
        this._shelfTypeSlots = new Set();
    }

    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }

    getShelfTypeSlots() {
        return this._shelfTypeSlots;

    }

    setShelfTypeSlots(shelfTypeSlots) {
        this._shelfTypeSlots = shelfTypeSlots;
    }
}

export { ShelfType };