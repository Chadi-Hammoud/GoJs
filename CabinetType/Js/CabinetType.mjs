class CabinetType {
    static id = 1;
    constructor() {
        this._id = CabinetType.id++;
        this._caption;
        this._height;
        this._width;
        this._realHeight;
        this._realWidth;
        this._numberRu;
        this._startRuIndex;
        this._cabinetTypeSpaces = new Set(); // Set to store CabinetTypeSpace instances
    }

    // Getters and setters for caption

    get id() {
        return this._id;
    }

    get caption() {
        return this._caption;
    }

    set caption(value) {
        this._caption = value;
    }

    // Getters and setters for height
    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    // Getters and setters for width
    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    // Getters and setters for realHeight
    get realHeight() {
        return this._realHeight;
    }

    set realHeight(value) {
        this._realHeight = value;
    }

    // Getters and setters for realWidth
    get realWidth() {
        return this._realWidth;
    }

    set realWidth(value) {
        this._realWidth = value;
    }

    // Getters and setters for numberRu
    get numberRu() {
        return this._numberRu; Ru
    }

    set numberRu(value) {
        this._numberRu = value;
    }

    // Getters and setters for startRuIndex
    get startRuIndex() {
        return this._startRuIndex;
    }

    set startRuIndex(value) {
        this._startRuIndex = value;
    }

    // Getter for CabinetTypeSpaces
    getCabinetTypeSpaces() {
        return this._cabinetTypeSpaces;
    }

    // Setter for CabinetTypeSpaces
    setCabinetTypeSpaces(cabinetTypeSpaces) {
        if (cabinetTypeSpaces instanceof Set) {
            this._cabinetTypeSpaces = cabinetTypeSpaces;
        } else {
            throw new Error('Invalid argument. Expected a Set of CabinetTypeSpace instances.');
        }
    }
}

export { CabinetType };
