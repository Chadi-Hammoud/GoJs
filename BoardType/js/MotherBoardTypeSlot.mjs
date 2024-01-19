class MotherBoardTypeSlot {
    static MotherBoardTypeSlotId = 1;

    constructor() {
        this._boardKey;
        this._indexOnSlot;
        this._xPercentage;
        this._yPercentage;
        this._widthPercentage;
        this._heightPercentage;


        // Increment the static property using the class name
        MotherBoardTypeSlot.MotherBoardTypeSlotId++;
    }

    get boardKey() {
        return this._boardKey;
    }

    set boardKey(value) {
        this._boardKey = value;
    }


    get indexOnSlot() {
        return this._indexOnSlot;
    }

    set indexOnSlot(value) {
        this._indexOnSlot = value;
    }

    get xPercentage() {
        return this._xPercentage;
    }

    set xPercentage(value) {
        this._xPercentage = value;
    }

    get yPercentage() {
        return this._yPercentage;
    }

    set yPercentage(value) {
        this._yPercentage = value;
    }

    get widthPercentage() {
        return this._widthPercentage;
    }

    set widthPercentage(value) {
        this._widthPercentage = value;
    }

    get heightPercentage() {
        return this._heightPercentage;
    }

    set heightPercentage(value) {
        this._heightPercentage = value;
    }

    get BoardTypeId() {
        return this._boardKey;
    }

    set BoardTypeId(boardTypeId) {
        this._boardKey = boardTypeId;
    }
}

export { MotherBoardTypeSlot };
