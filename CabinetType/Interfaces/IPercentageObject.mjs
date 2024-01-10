class IPercentageObject {
    constructor() {
        // Properties
        this.xPercentage = 0.0;
        this.yPercentage = 0.0;
        this.widthPercentage = 0.0;
        this.heightPercentage = 0.0;
        this.index = null;
        this.caption = '';

        // Methods
        this.setXPercentage = function (x) {
            this.xPercentage = x;
        };

        this.getXPercentage = function () {
            return this.xPercentage;
        };

        this.setYPercentage = function (y) {
            this.yPercentage = y;
        };

        this.getYPercentage = function () {
            return this.yPercentage;
        };

        this.setWidthPercentage = function (width) {
            this.widthPercentage = width;
        };

        this.getWidthPercentage = function () {
            return this.widthPercentage;
        };

        this.setHeightPercentage = function (height) {
            this.heightPercentage = height;
        };

        this.getHeightPercentage = function () {
            return this.heightPercentage;
        };

        this.getIndex = function () {
            return this.index;
        };

        this.getCaption = function () {
            return this.caption;
        };
    }
}