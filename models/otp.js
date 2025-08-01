var mongoose = require("mongoose");

var otpCollectionObj = {
    email: String,
    otp: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300  // auto-expire after 5 mins
    }
};

var ver={
    versionKey : false
}

var schema = new mongoose.Schema(otpCollectionObj,ver);
var otpCollectionObjref = mongoose.model("otpCollection2025",schema);

module.exports =  otpCollectionObjref;