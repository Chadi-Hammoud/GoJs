
class MotherBoardTypeSlot {
    static MotherBoardTypeSlotId = 1;

    constructor() {
        this.MotherBoardTypeSlotId++;
        this.boardKey;
        this.indexOnSlot;
        this.XPercentage;
        this.YPercentage;
        this.WidthPercentage;
        this.HeightPercentage;

    }

    getBoardTypeId(){
        return this.boardKey;
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


    getXPercentage() {
       return this.XPercentage;
    }
    getYPercentage() {
        return this.YPercentage ;
    }
    getWidthPercentage() {
        return  this.WidthPercentage ;
    }
    getHeightPercentage() {
        return this.HeightPercentage ;
    }

}


let motherBoard = new MotherBoardTypeSlot();

export { motherBoard };

