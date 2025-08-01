var mongoose = require("mongoose");

var registerCollectionObj = {
    fname : String,
    lname : String, 
    email : {type : String , required : true , index : true , unique : true},
    phoneno : String,
    pwd : String,
    utype : String
};
var ver = {
    versionKey : false
};

var schema = new mongoose.Schema(registerCollectionObj,ver);
var registerCollectionObjref = mongoose.model("registerColeection2025",schema);//this will return the ref of 

module.exports = registerCollectionObjref;