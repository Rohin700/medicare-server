var express = require("express");
var router = express.Router();
var objDonarController = require("../controllers/donarController");
var {doValidateToken} = require("../config/validate");

router.use(doValidateToken);// All routes below this will validate token
//if any of the following below routes should be accessible without login, you should move them above the line router.use(); 

router.post("/dosavedeatils", objDonarController.doSaveDetails);
router.post("/doupdatedetails" , objDonarController.doUpdateDetails);
router.post("/dofetch" ,  objDonarController.doFetchData)


router.post("/doavailmed" , objDonarController.doAvailMed);
router.post("/doupdatemed" , objDonarController.doUpdateMed);


router.post("/dofetchallmed",objDonarController.doFetchAllMedicines);
router.post("/doupdatemedtodo" , objDonarController.doUpdateMedFromTodo);
router.post("/dodeletemed",objDonarController.doDeleteMed);


router.post("/doavailequipment" , objDonarController.doAvailEquipment);
router.post("/doupdateequipment" , objDonarController.doUpdateEquipment);


router.post("/dofetchallequip",objDonarController.doFetchAllEquipments);
router.post("/dodeleteequip", objDonarController.doDeleteEquip)
router.post("/doupdateequiptodo",objDonarController.doUpdatEequipTodo);



module.exports = router;