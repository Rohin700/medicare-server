var express = require("express");
var router = express.Router();
var objRecipientController = require("../controllers/recipientController");
var {doValidateToken} = require("../config/validate");

router.post("/dofetchdonardetails" ,objRecipientController.doFetchDonarDetails);
//I have not sent the token here because it will run everytime we are changing th state

router.use(doValidateToken);

router.post("/dofetchmed" , objRecipientController.doFetchMed);

router.post("/dofetchequip" , objRecipientController.doFetchEquip);

module.exports = router;