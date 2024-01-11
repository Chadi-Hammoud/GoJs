class CabinetTypeSpace {

    constructor() {
        this._cabinetTypeId;
        this._xPercentage;
        this._yPercentage;
        this._heightPercentage;
        this._widthPercentage;
        this._fromRu;
        this._toRu;
        this._caption;
    }

    // Getter and Setter for cabinetTypeId


    get cabinetTypeId() {
        return this._cabinetTypeId;
    }

    set cabinetTypeId(value) {
        this._cabinetTypeId = value;
    }

    // Getter and Setter for xPercentage
    get xPercentage() {
        return this._xPercentage;
    }

    set xPercentage(value) {
        this._xPercentage = value;
    }

    // Getter and Setter for yPercentage
    get yPercentage() {
        return this._yPercentage;
    }

    set yPercentage(value) {
        this._yPercentage = value;
    }

    // Getter and Setter for heightPercentage
    get heightPercentage() {
        return this._heightPercentage;
    }

    set heightPercentage(value) {
        this._heightPercentage = value;
    }

    // Getter and Setter for widthPercentage
    get widthPercentage() {
        return this._widthPercentage;
    }

    set widthPercentage(value) {
        this._widthPercentage = value;
    }

    // Getter and Setter for fromRu
    get fromRu() {
        return this._fromRu;
    }

    set fromRu(value) {
        this._fromRu = value;
    }

    // Getter and Setter for toRu
    get toRu() {
        return this._toRu;
    }

    set toRu(value) {
        this._toRu = value;
    }

    // Getter and Setter for caption
    get caption() {
        return this._caption;
    }

    set caption(value) {
        this._caption = value;
    }
}

export { CabinetTypeSpace };
