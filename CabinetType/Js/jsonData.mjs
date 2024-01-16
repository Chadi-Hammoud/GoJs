import { ct, spaces } from "./index.mjs";
let jsonString;
document.getElementById("dsiplayJsonData").addEventListener("click", function (e) {
    let dataToSave = {

        ct: {
            id: ct.id,
            caption: ct.caption,
            height: ct.height,
            width: ct.width,
            numberRu: ct.numberRu,
            startRuIndex: ct.startRuIndex,
            realHeight: ct.realHeight,
            realWidth: ct.realWidth,
        },

        spaces: {
            cabinetTypeSpace: Array.from(ct.getCabinetTypeSpaces()).map(space => {
                return {
                    id: ct.id,
                    xPercentage: space.xPercentage,
                    yPercentage: space.yPercentage,
                    widthPercentage: space.widthPercentage,
                    heightPercentage: space.heightPercentage,
                    fromRu: space.fromRu,
                    toRu: space.toRu,
                    caption: space.caption,
                };
            }),
        },




    }
    jsonString = JSON.stringify(dataToSave, null, 2);
    console.log(jsonString);

});


