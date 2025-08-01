const e = require("express");
var registerCollectionObjref = require("../models/registerModel");
var nodemailer = require("nodemailer");

function doRegister (req,resp) {
    console.log(req.body);
    
    var registerCollectionObjrefObj = new registerCollectionObjref(req.body)

    registerCollectionObjrefObj.save()
    .then((docu)=>{
        resp.json({status : true , msg : "Record Saved Successfully" , obj : docu});
        
        console.log(req.body);

        sendMail(req.body.email);
    }).catch((err)=>{
        resp.send({status : false , msg : err.message});
    })
}

async function sendMail(userEmail){
    let transporter = nodemailer.createTransport({
        service : "gmail",
        auth: {
            user : process.env.NODEMAILER_NAME,//verifird email
            pass : process.env.NODEMAILER_APP_PASS//it is your app password of your email
        }
    })

    let mailOptions={
        from : "rohingarg36@gmail.com",//the user and the from needs to be same otherwise the mail will be sent from the auth user 
        to : userEmail,//to whom u are sending the mail
        subject : "Congratulations!",
        text: "You have Successfully registered for the online Emergency MedStore"
    }
    try{
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully" + info.response);
    }catch(err){
        console.log(err);
    }

}   

module.exports = {doRegister};