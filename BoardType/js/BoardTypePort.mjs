class BoardTypePort{

    constructor(){
        this._x;
        this._y;
        this._width;
        this._height;
        this._caption;
    }

    get caption(){
        return this._caption;
    }

    set caption(caption){
        this._caption = caption;
    }
    get xPercentage(){
        return this._x;
    }
    get yPercentage(){
        return this._y;
    }
    get heightPercentage(){
        return this._height;
    }
    get widthPercentage(){
        return this._width;
    }

    set xPercentage(x){
        this._x = x;
    }
    set yPercentage(y){
        this._y = y;
    }
    set widthPercentage(width){
        this._width = width;
    }
    set heightPercentage(height){
        this._height = height;
    }
}

export {BoardTypePort}