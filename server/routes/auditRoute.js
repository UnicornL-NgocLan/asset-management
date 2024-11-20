import express from "express";
import {auditCtrl} from "../controllers/auditController.js";
import {authenticateUser} from '../middleWare.js'


const router = express.Router();

router.get("/get-audit-list",authenticateUser,auditCtrl.getAuditList);
router.get("/get-audit/:id",authenticateUser,auditCtrl.getAudit);
router.get("/get-offices",authenticateUser,auditCtrl.getOffices);
router.get("/get-departments",authenticateUser,auditCtrl.getDepartments);
router.get("/get-asset-inventory-commitee/:id",authenticateUser,auditCtrl.getAssetInventoryCommitee);
router.get("/get-asset-inventoried-dept/:id",authenticateUser,auditCtrl.getAssetInventoriedDept);
router.get("/get-asset-inventory/:id",authenticateUser,auditCtrl.getAssetInventory);
router.get("/get-asset-inventory-line/:id",authenticateUser,auditCtrl.getAssetInventoryLine);
router.get("/get-employee-temporary",authenticateUser,auditCtrl.getEmployeeTemporary);

router.patch("/update-inventory-line/:id",authenticateUser,auditCtrl.updateInventoryLine)


export default router.stack;