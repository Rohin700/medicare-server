var donarDetailsCollectionobjref = require("../models/donardetails");
var cloudinary = require("cloudinary").v2;
var path = require("path");
const { ObjectId } = require('mongodb');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})

//=========================//===================== Donor Details Form =========================//====================//

async function doSaveDetails(req,resp){
    let filenameprofilepic = "" , filenameaadharpic = "";

    if(req.files){
        if(req.files.profilepic){
            let path1 = path.join(__dirname , ".." , "uploads" , req.files.profilepic.name);
            await req.files.profilepic.mv(path1);
            
            await cloudinary.uploader.upload(path1)
            .then(function(picUrlResult){
                filenameprofilepic = picUrlResult.url;
                console.log(filenameprofilepic);
            })

            console.log("File : Profilepic Successfully Uploaded on cloud");

        }if(req.files.aadharpic){
            let path2 = path.join(__dirname , ".." , "uploadsaadhar" , req.files.aadharpic.name);
            await req.files.aadharpic.mv(path2);

            await cloudinary.uploader.upload(path2)
            .then(function(picUrlResult){
                filenameaadharpic = picUrlResult.url;
                console.log(filenameaadharpic);
            })

            console.log("File : Aadharpic Successfully Uploaded on cloud");
        }if(filenameprofilepic === "" && filenameaadharpic === ""){
            filenameprofilepic = "nopic.jpg" , filenameaadharpic = "nopic.jpg";
        }
    }
    
    req.body.profilepicpath = filenameprofilepic;
    req.body.aadharpicpath = filenameaadharpic;

    console.log(req.body);

    var donarDetailsCollectionobjrefobj = new donarDetailsCollectionobjref(req.body);

    donarDetailsCollectionobjrefobj.save().then((docu)=>{
        resp.json({status:true,msg:"Record Saved",obj:docu});
    }).catch((err)=>{
        resp.json({status:false , msg:err.message});
    })
}

async function doUpdateDetails(req, resp) {
  let filenameprofilepic = "";
  let filenameaadharpic = "";

  const isExistingDocu = await donarDetailsCollectionobjref.findOne({ email: req.body.email });

  if (!isExistingDocu) {
    return resp.json({ status: false, msg: "Donor record not found for this email" });
  }

  if (req.files && req.files.profilepic) {
    const path1 = path.join(__dirname, "..", "uploads", req.files.profilepic.name);
    await req.files.profilepic.mv(path1);

    const picResult = await cloudinary.uploader.upload(path1);
    filenameprofilepic = picResult.url;
  } else if (req.body.profilepicpath) {
    filenameprofilepic = req.body.profilepicpath; // from frontend (old image)
  } else {
    filenameprofilepic = isExistingDocu.profilepicpath; // fallback from DB
  }

  if (req.files && req.files.aadharpic) {
    const path2 = path.join(__dirname, "..", "uploadsaadhar", req.files.aadharpic.name);
    await req.files.aadharpic.mv(path2);

    const picResult = await cloudinary.uploader.upload(path2);
    filenameaadharpic = picResult.url;
  } else if (req.body.aadharpicpath) {
    filenameaadharpic = req.body.aadharpicpath;
  } else {
    filenameaadharpic = isExistingDocu.aadharpicpath;
  }

  req.body.profilepicpath = filenameprofilepic;
  req.body.aadharpicpath = filenameaadharpic;

    donarDetailsCollectionobjref.updateOne({email : req.body.email} , {$set : req.body})
    .then((docu)=>{
        resp.json({status : true , msg : "Record Updated Successfully" , obj : docu});
    }).catch((err)=>{
        resp.json({status : false , msg : err.message});
    })
}

function doFetchData(req,resp){
    donarDetailsCollectionobjref.findOne({email : req.body.email})
    .then((docu)=>{
        if(docu != null){
            resp.json({status:true , msg : "Record Found" , obj:docu});
        }else{
            resp.json({ status: false, msg: "Recond Not Found"});
        }
    }).catch( (err) => {
        resp.json({status:false , msg : err.message});
    })
}

//=========================//===================== Medicine Avail Form =========================//====================//
var medCollectionObjref = require("../models/medicinesModel")

function doAvailMed(req,resp){
    var medCollectionObjrefobj = new medCollectionObjref(req.body);

    medCollectionObjrefobj.save()
    .then((docu)=>{
        resp.json({status : true , msg : "Record Saved Successully" , obj : docu});
    }).catch((err)=>{
        resp.json({status : false , msg : err.message});
    })
}

async function doUpdateMed(req,resp){

    const isExisting = await medCollectionObjref.findOne({email : req.body.email , medname : req.body.medname});
    if(!isExisting){
        resp.json({status : false, msg : "Medicine Doesn't exist with this email id"});
        return;
    }

    medCollectionObjref.updateOne({email : req.body.email , medname : req.body.medname} , {$set : req.body})//, here in mongo describes and 
    .then((docu)=>{
        if (docu.matchedCount === 0) {
            resp.json({ status: false, msg: "No matching record found with provided email and medicine name." });
        } else if (docu.modifiedCount === 0) {
            resp.json({ status: true, msg: "No changes were made. Data already up-to-date." });
        } else {
            resp.json({ status: true, msg: "Record updated successfully." });
        }
    }).catch((err)=>{
        resp.json({status : false , msg : err.message});
    })
}

//==================//=============== Displaying Listed Medicines ================//================//
function doFetchAllMedicines(req,resp){
    medCollectionObjref.find({email : req.body.email})
    .then((docu)=>{
        if(docu != null){
        resp.json({status : true , msg : "Record Found" , obj : docu});
        }else{
            resp.json({status : false , msg : "No Listed Medicine found at this email"});
        }
    }).catch((err)=>{
        resp.json({status : false , msg : err.message});
    })
}

function doDeleteMed(req,resp){
    medCollectionObjref.findOneAndDelete({_id : req.body._id})
    .then((docu)=>{
        resp.json({status : true, msg:"Record Deleted Successfully"});//if i will be passing the 'docu' from here it will carry the details of the deleted document
    }).catch((err)=>{
        resp.json({status : false , msg : err.message});
    })
}


function doUpdateMedFromTodo(req,resp){
    if (!req.body.id) {
        return resp.json({ status: false, msg: "Missing id for update" });
    }

    const _id = new ObjectId(req.body.id);//converts string or plane object into objectID
    //_id in MongoDB is typically of type ObjectId, not a string or plain object


    medCollectionObjref.updateOne({_id : _id} , {$set : req.body})//, here in mongo describes and 
    .then((docu)=>{
        if (docu.matchedCount === 0) {
            return resp.json({ status: false, msg: "Missing medicine ID (id) for update." });
        } else if (docu.modifiedCount === 0) {
            resp.json({ status: true, msg: "No changes were made. Data already up-to-date." });
        } else {
            resp.json({ status: true, msg: "Record updated successfully." });
        }
    }).catch((err)=>{
        resp.json({status : false , msg : err.message});
    })
}

//=========================//===================== Equipment Avail Form =========================//====================//
var equipmentdetailsCollectionObjref = require("../models/equipmentsModel");

function doAvailEquipment(req,resp){
    var equipmentdetailsCollectionObjrefObj = new equipmentdetailsCollectionObjref(req.body);
    
    equipmentdetailsCollectionObjrefObj.save()
    .then((docu)=>{
        resp.json({status : true , msg : "Record added successfully" , obj : docu})
    }).catch((err=>{
        resp.json({status : false , msg : err.message});
    }))
}

async function doUpdateEquipment(req,resp){

    const isExisting = await equipmentdetailsCollectionObjref.findOne({email : req.body.email , medname : req.body.medname});
    if(!isExisting){
        resp.json({status : false, msg : "Equipment Doesn't exist with this email id"});
        return;
    }

    equipmentdetailsCollectionObjref.updateOne({email : req.body.email , company : req.body.company},{$set : req.body})
    .then((docu)=>{
        if (docu.matchedCount === 0) {
            resp.json({ status: false, msg: "No matching record found with provided email and equipment name." });
        } else if (docu.modifiedCount === 0) {
            resp.json({ status: true, msg: "No changes were made. Data already up-to-date." });
        } else {
            resp.json({ status: true, msg: "Record updated successfully." });
        }
    }).catch((err)=>{
        resp.json({status : false , msg : err.message});
    })
}



//==================//=============== Displaying Listed Equipments================//================//
function doFetchAllEquipments(req,resp){
    equipmentdetailsCollectionObjref.find({email : req.body.email})
    .then((docu)=>{
        if(docu != null){
            resp.json({status : true , msg : "Record Found" , obj: docu});
        }else{
            resp.json({status : false , msg : "No Listed Equipments found at this email"});
        }
    }).catch((err) => {
        resp.json({status : false , msg : err.message});
    })
}

function doDeleteEquip(req,resp){  
    equipmentdetailsCollectionObjref.findOneAndDelete({_id : req.body._id})
    .then((docu)=>{
        resp.json({status : true, msg:"Record Deleted Successfully"});//if i will be passing the 'docu' from here it will carry the details of the deleted document
    }).catch((err)=>{
        resp.json({status : false , msg : err.message});
    })
}

function doUpdatEequipTodo(req,resp){
    if (!req.body.id) {
        return resp.json({ status: false, msg: "Missing id for update" });
    }

    const _id = new ObjectId(req.body.id);
    //_id in MongoDB is typically of type ObjectId, not a string or plain objec


    equipmentdetailsCollectionObjref.updateOne({_id : _id} , {$set : req.body})//, here in mongo describes and 
    .then((docu)=>{
        if (docu.matchedCount === 0) {
            return resp.json({ status: false, msg: "Missing equipment ID (id) for update." });
        } else if (docu.modifiedCount === 0) {
            resp.json({ status: true, msg: "No changes were made. Data already up-to-date." });
        } else {
            resp.json({ status: true, msg: "Record updated successfully." });
        }
    }).catch((err)=>{
        resp.json({status : false , msg : err.message});
    })
}


module.exports = {doSaveDetails , doUpdateDetails , doFetchData , doAvailMed , 
    doUpdateMed , doFetchAllMedicines , doUpdateMedFromTodo ,doDeleteMed , doAvailEquipment, doUpdateEquipment, 
    doFetchAllEquipments , doDeleteEquip , doUpdatEequipTodo};


    