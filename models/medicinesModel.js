var mongoose = require("mongoose");

var medCollectionObj={
    email : String,
    medname : String,
    company : String,
    expdate : Date,
    packingtype : String,
    qty : Number,
    otherinfo : String
};
var ver={
    versionKey : false
};

var schema = new mongoose.Schema(medCollectionObj , ver);
var medCollectionObjref = mongoose.model("medCollection2025",schema);

module.exports = medCollectionObjref;