class MotherBoardTypeSlot {
    static MotherBoardTypeSlotId = 1;

    constructor() {
        this._boardKey;
        this._indexOnSlot;
        this._XPercentage;
        this._YPercentage;
        this._WidthPercentage;
        this._HeightPercentage;

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

    get XPercentage() {
        return this._XPercentage;
    }

    set XPercentage(value) {
        this._XPercentage = value;
    }

    get YPercentage() {
        return this._YPercentage;
    }

    set YPercentage(value) {
        this._YPercentage = value;
    }

    get WidthPercentage() {
        return this._WidthPercentage;
    }

    set WidthPercentage(value) {
        this._WidthPercentage = value;
    }

    get HeightPercentage() {
        return this._HeightPercentage;
    }

    set HeightPercentage(value) {
        this._HeightPercentage = value;
    }

    get BoardTypeId() {
        return this._boardKey;
    }

    set BoardTypeId(boardTypeId) {
        this._boardKey = boardTypeId;
    }
}

export { MotherBoardTypeSlot };
