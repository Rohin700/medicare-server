/*
    npm i express;
    npm i nodemon

    npm i mongoose
    npm i mongo

    npm i express-fileupload
    npm i cors

    npm i nodemailer

    npm install dotenv
    npm i jsonwebtoken after installing this package u need to install token on the signup that as soon as the new user signs up
*/
var express = require("express");
var app = express();

const mongoose = require("mongoose");
const cors = require("cors");
const fileupload = require("express-fileupload");
var dotenv = require("dotenv");
var env = dotenv.config();
console.log(process.env.SEC_KEY);//to check that we have imported the SEC_KEY safely here

app.use(fileupload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

let MongoDBAtlasURl = process.env.MONGO_ATLAS_URL;
mongoose.connect(MongoDBAtlasURl)
.then(()=>{
    console.log("Atlas(Mongo db) Connected");
}).catch((err)=>{
    console.log(err.message);
})


var registerRoute = require("./route/registerRoute");
var loginRoute = require("./route/loginRoute");
var donarRoute = require("./route/donorRoute");
var recipientRoute = require("./route/recipientRoute");

app.listen(2004,()=>{
    console.log("Server Started at port : 2004");
})

app.use("/register", registerRoute);
app.use("/login" , loginRoute);
app.use("/donar", donarRoute);
app.use("/recipient" ,recipientRoute);


app.use("/",(req,resp)=>{
    resp.send("Welcome");
    console.log("Welcome back Sir")
})