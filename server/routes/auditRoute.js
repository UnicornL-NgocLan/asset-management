import express from "express";
import { auditCtrl } from "../controllers/auditController.js";
import { authenticateUser } from "../middleWare.js";

const router = express.Router();

router.get("/get-audit-list", authenticateUser, auditCtrl.getAuditList);
router.get("/get-audit/:id", authenticateUser, auditCtrl.getAudit);
router.get("/get-offices", authenticateUser, auditCtrl.getOffices);
router.get("/get-asset-types", authenticateUser, auditCtrl.getAssetTypes);
router.get("/get-departments", authenticateUser, auditCtrl.getDepartments);
router.get("/get-asset-inventory-commitee/:id", authenticateUser, auditCtrl.getAssetInventoryCommitee);
router.get("/get-asset-inventoried-dept/:id", authenticateUser, auditCtrl.getAssetInventoriedDept);
router.get("/get-asset-inventory/:id", authenticateUser, auditCtrl.getAssetInventory);
router.get("/get-asset-inventory-line/:id", authenticateUser, auditCtrl.getAssetInventoryLine);
router.get("/get-employee-temporary", authenticateUser, auditCtrl.getEmployeeTemporary);
router.get("/check-if-user-is-assigned", authenticateUser, auditCtrl.checkIfCurrentUserIsAssignedToConfirm);
router.get("/get-asset-inventory-asset-temporary-lines/:audit_id", authenticateUser, auditCtrl.getAssetInventoryAssetTemporaryLines);
router.get("/get-asset-inventory-asset-temporary-line/:id", authenticateUser, auditCtrl.getAssetInventoryAssetTemporaryLine);
router.get("/get-uoms", authenticateUser, auditCtrl.getUoms);
router.get("/get-companies", authenticateUser, auditCtrl.getCompanies);
router.get("/get-department-temporary/:id", authenticateUser, auditCtrl.getDepartmentTemporaies);

router.post("/confirm-asset-inventory/:id", authenticateUser, auditCtrl.userConfirmInventory);
router.post("/unconfirm-asset-inventory/:id", authenticateUser, auditCtrl.userUnConfirmInventory);
router.post("/change-to-verifying-state/:id", authenticateUser, auditCtrl.userSetToVerifyingState);
router.post("/change-back-to-process-state/:id", authenticateUser, auditCtrl.userBackToProcessState);
router.post("/create-asset-temporary-list", authenticateUser, auditCtrl.createAssetTemporaryLine);

router.patch("/update-inventory-line/:id", authenticateUser, auditCtrl.updateInventoryLine);
router.patch("/update-asset-temporary-inventory-line/:id", authenticateUser, auditCtrl.updateAssetTemporaryLine);

router.delete("/delete-asset-temporary-line/:id", authenticateUser, auditCtrl.deleteAssetTemporaryLine);

export default router.stack;
