
import { shelf, shelfType, shelfTypeSlot } from "./index.mjs";

document.getElementById("dsiplayJsonData").addEventListener("click", function (e) {
let dataToSave = {
    shelf: {
        id: shelf.id,
        slotStartingIndex: shelf.slotStartingIndex,
        numberOfSlot: shelf.getNumberOfSlot(),
    },
    shelfType: {
        id: shelfType.id,
        shelfTypeSlots: Array.from(shelfType.getShelfTypeSlots()).map(slot => {
            return {
                shelfTypeId: slot.shelfTypeId,
                xPercentage: slot.xPercentage,
                yPercentage: slot.yPercentage,
                heightPercentage: slot.heightPercentage,
                widthPercentage: slot.widthPercentage,
                rearShelf: slot.rearShelf,
                indexOnSlot: slot.indexOnSlot,
                slot: slot.slot,
            };
        }),
    },

};


let jsonString = JSON.stringify(dataToSave, null, 2);



    console.log(jsonString);
})






// // Create a Blob containing the JSON data
// let blob = new Blob([jsonString], { type: "application/json" });

// // Create a link element
// let a = document.createElement("a");

// // Set the download attribute with the filename
// a.download = "shelf_data.json";

// // Create a URL for the Blob and set it as the href attribute
// a.href = URL.createObjectURL(blob);

// // Append the link to the body
// document.body.appendChild(a);

// // Trigger a click on the link to start the download
// a.click();

// // Remove the link from the body
// document.body.removeChild(a);