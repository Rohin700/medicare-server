var mongoose = require("mongoose");

var equipmentcollectionObj = {
    email : String,
    equipment : String, 
    company : String,
    purchasedtime : String,
    packingtype : String,
    qty : Number,
    otherinfo : String
};
var ver = {
    versionKey : false
}

var schema = new mongoose.Schema(equipmentcollectionObj,ver);
var equipmentdetailsCollectionObjref = mongoose.model("equipmentcollectionObj2025",schema);

module.exports = equipmentdetailsCollectionObjref;