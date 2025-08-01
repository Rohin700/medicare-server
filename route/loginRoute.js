var objLoginController = require("../controllers/loginController");
var express = require("express");
var router = express.Router();

router.post("/dologin" , objLoginController.doLogin);
router.post("/forgotpass" , objLoginController.doForgotPass)
router.post("/doverify",objLoginController.doVerifyOTP);

module.exports = router;