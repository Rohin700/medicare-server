var express = require("express");
var router = express.Router();
var objRegisterController = require("../controllers/registerController");

router.post("/doregister" , objRegisterController.doRegister);

module.exports=router;