var registerCollectionObjref = require("../models/registerModel");
var nodemailer = require("nodemailer");

var jwt = require("jsonwebtoken");

var otpCollectionObjref = require("../models/otp");
const optMap = new Map();//to generate otp to be verified by the user



function doLogin(req,resp){
    registerCollectionObjref.findOne({email : req.body.email , pwd : req.body.pwd})
    .then((docu)=>{
        if(docu!=null){
            let jtoken = jwt.sign({uid : req.body.email} , process.env.SEC_KEY , {expiresIn : "1h"})
            
            let mailStatus = doSendMail(req.body.email);
            if (!mailStatus) {
                  return resp.json({ status: false, msg: "Failed to send OTP email." });
            }

            resp.json({status:true ,msg:"Record Found",obj:docu , token : jtoken});  
        }else{
            resp.json({status:false ,msg:"Invalid Id and Password Found"});  
        }
    }).catch((err)=>{
        resp.json({status:false ,msg:err.message});
    })
}

async function doSendMail(userEmail){
    const otp = Math.floor(100000 + Math.random() * 900000);

    let transporter = nodemailer.createTransport({
        service : "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user : process.env.NODEMAILER_NAME, //verifird email
            pass : process.env.NODEMAILER_APP_PASS, //it is your app password of your email
        }
    })

    let mailOptions={
        from : "rohingarg36@gmail.com",
        to : userEmail,
        subject: "Your OTP for Login Verification",
        text : `Your login verification code : ${otp}`,
    }

    try {
        const otpCollectionObjrefObj = new otpCollectionObjref({email : userEmail , otp : otp.toString()});
        await otpCollectionObjrefObj.save();
        
        await transporter.sendMail(mailOptions);
        
        console.log("OTP sent to:", userEmail);

        return true;
    } catch (err) {
        console.error("Failed to send OTP:", err);
    }
}

async function doVerifyOTP(req,resp) {
    otpCollectionObjref.findOne({email : req.body.email , otp : req.body.otp})
    .then((docu)=>{
        if(!docu){
            resp.json({status : false ,msg : "OTP Expired"});
        }else{
            resp.json({status : true, msg : "OTP matched"});
        }
    }).catch((err)=>{
        resp.json({status : false , msg : err.message});
    })
}

async function doForgotPass(req,resp){
    var isExistingdocu = await registerCollectionObjref.findOne({email : req.body.email});
    if(!isExistingdocu){
        resp.json({status : false , msg : "User Doesn't Exist witht his email"});
        return;
    }

    await isExistingdocu.updateOne({$set:{pwd : req.body.password}})
    .then((docu)=>{
        resp.json({status : true , msg : "Password Updated!" , obj : docu});
    }).catch((err)=>{
        resp.json({status : false , msg : err.message});
    })
}


module.exports = {doLogin, doForgotPass ,doVerifyOTP};