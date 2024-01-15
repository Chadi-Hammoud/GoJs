class Shelf{
static id = 1;
    constructor(){
        this._id = Shelf.id++;
        this._slotStartingIndex;
        this._numberOfSlot;
    }

    get id(){
        return this._id
    }

    set id(id){
        this._id = id;
    }

    get slotStartingIndex(){
        return this._slotStartingIndex;
    }

    set slotStartingIndex(slotStartingIndex){
        this._slotStartingIndex = slotStartingIndex;
    }

    getNumberOfSlot(){
        return this._numberOfSlot;
    }

    setNumberOfSlot(numberOfSlot){
        this._numberOfSlot = numberOfSlot;
    }

}

export {Shelf};