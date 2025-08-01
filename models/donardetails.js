var mongoose = require("mongoose");

let donarDetailsCollectionobj = {
    email : {type : String, required : true, index : true , unique : true},
    name : String,
    age : Number, //use number for integers
    gender : String,
    curraddress : String,
    currcity : String,
    contact : String,
    qualification : String,
    occupation : String,
    aadharpicpath : String,
    profilepicpath : String,
    status : {type : Number , default : 1 , immutable : true}//once set cennot be changed
};
var ver = {
    versionKey : false
};

var schema = new mongoose.Schema(donarDetailsCollectionobj , ver);
var donarDetailsCollectionobjref = mongoose.model("donarDetailsCollection2025",schema);

module.exports = donarDetailsCollectionobjref;