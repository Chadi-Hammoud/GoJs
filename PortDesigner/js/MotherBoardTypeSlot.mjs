
class MotherBoardTypeSlot {
    static nextId = 1;

    constructor() {
        this.boardKey;
        this.indexOnSlot;
        this.XPercentage;
        this.YPercentage;
        this.WidthPercentage;
        this.HeightPercentage;

    }

    setBoardTypeId(boardTypeId) {
        this.boardKey = boardTypeId;
    }

    setIndexOnSlot(indexOnSlot) {
        this.indexOnSlot = indexOnSlot;
    }

    getIndexOnSlot() {
        return this.indexOnSlot;
    }

    setXPercentage(XPercentage) {
        this.XPercentage = XPercentage;
    }
    setYPercentage(YPercentage) {
        this.YPercentage = YPercentage;
    }
    setWidthPercentage(WidthPercentage) {
        this.WidthPercentage = WidthPercentage;
    }
    setHeightPercentage(HeightPercentage) {
        this.HeightPercentage = HeightPercentage;
    }

}


let motherBoard = new MotherBoardTypeSlot();

export { motherBoard };

