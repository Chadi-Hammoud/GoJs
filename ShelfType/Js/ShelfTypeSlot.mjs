class ShelfTypeSlot {

    constructor() {
        this._shelfTypeId;
        this._x;
        this._y;
        this._height;
        this._width;
        this._rearShelf;
        this._indexOnSlot;
        this._slot;

    }


    get shelfTypeId() {
        return this._shelfTypeId;
    }

    /**
     * @param {any} shelfTypeId
     */
    set shelfTypeId(shelfTypeId) {
        this._shelfTypeId = shelfTypeId;
    }

    get rearShelf() {
        return this._rearShelf;
    }

    set rearShelf(rearShelf) {
        this._rearShelf = rearShelf;
    }

    get indexOnSlot() {
        return this._indexOnSlot;
    }

    set indexOnSlot(indexOnSlot) {
        this._indexOnSlot = indexOnSlot;
    }

    get slot() {
        return this._slot;
    }

    set slot(slot) {
        this._slot = slot;
    }

    // Getter and Setter for xPercentage
    get xPercentage() {
        return this._x;
    }

    set xPercentage(value) {
        this._x = value;
    }

    // Getter and Setter for yPercentage
    get yPercentage() {
        return this._y;
    }

    set yPercentage(value) {
        this._y = value;
    }

    // Getter and Setter for heightPercentage
    get heightPercentage() {
        return this._height;
    }

    set heightPercentage(value) {
        this._height = value;
    }

    // Getter and Setter for widthPercentage
    get widthPercentage() {
        return this._width;
    }

    set widthPercentage(value) {
        this._width = value;
    }
}

export { ShelfTypeSlot }