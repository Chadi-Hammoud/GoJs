import { Shelf } from "./Shelf.mjs";

class ShelfType extends Shelf{

    constructor(){
        this._id;
        this._shelfTypeSlots = new Set();
    }

    get id(){
        return this._id;
    }
    set id(id){
        this._id = id;
    }

    get shelfTypeSlots(){
        return this._shelfTypeSlots;

    } 

    set shelfTypeSlots(shelfTypeSlots){
        this._shelfTypeSlots = shelfTypeSlots;
    }
}

export {ShelfType};