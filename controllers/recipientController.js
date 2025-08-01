var medCollectionObjref = require("../models/medicinesModel");
var donarDetailsCollectionobjref = require("../models/donardetails");


//=====================//====== Common func for MedFinder and EquipFinder Form =========//====================//
async function doFetchDonarDetails(req,resp){
    var donarDetails = await donarDetailsCollectionobjref.find();
    if(donarDetails.length == 0){
        return resp.json([]);
    }
    
    resp.json(donarDetails);//This directly sends the raw array as the JSON response. ["Delhi", "Mumbai", "Kolkata"]
    // resp.json({obj : cities});//This sends the array wrapped inside an object, under the key "obj".{obj: ["Delhi", "Mumbai", "Kolkata"]}
}


//=========================//===================== Med Finder Form =========================//====================//
async function doFetchMed(req,resp){
    try{
        var emails = await donarDetailsCollectionobjref.distinct("email" , {currcity : req.body.city});
        
        if(emails.length === 0){
            resp.json({status : false, msg: "Sorry this med is not available in your city"});
            return;
        }
        var medname = req.body.medname;

        var meds = await medCollectionObjref.find({
            email : {$in : emails} , 
            medname : {$regex:`^${medname}$`,$options:"i"}
        })

        resp.json(meds);
    }catch(err){
        resp.json(err.message)
    }
}


//=========================//===================== Equip Finder Form =========================//====================//

var equipmentdetailsCollectionObjref = require("../models/equipmentsModel");

async function doFetchEquip(req,resp){
    try{
        let emails = await donarDetailsCollectionobjref.distinct("email" , {currcity : req.body.city});
        console.log(emails);

        if(emails.length == 0){
            return resp.json({status : false , msg : "Sorry no equipment is available in your city"});
        }

        var equipmentName = req.body.equipment;
        var equips = await equipmentdetailsCollectionObjref.find({
            email : {$in : emails} ,
            equipment : {$regex:`^${equipmentName}$`,$options:"i"}
        })

        resp.json(equips);

    }catch(err){
        resp.json(err.message);
    }
}


module.exports = {doFetchMed , doFetchDonarDetails , doFetchEquip};