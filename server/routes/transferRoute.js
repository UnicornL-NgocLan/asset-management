import express from "express";
import { transferCtrl } from "../controllers/transferController.js";
import { authenticateUser } from "../middleWare.js";

const router = express.Router();

router.get("/get-asset-transfer-list", authenticateUser, transferCtrl.getAssetTransfers);
router.get("/get-asset-transfer-by-id/:id", authenticateUser, transferCtrl.getTransferById);
router.get("/get-asset-transfer-line/:id", authenticateUser, transferCtrl.getTransferLine);
router.get("/check-userid-by-hr-temp-id", authenticateUser, transferCtrl.checkUserIdByHrTempId);
router.post("/transfer-handover-confirm", authenticateUser, transferCtrl.callConfirmRelatedFunction);
router.patch("/update-transfer-line/:id", authenticateUser, transferCtrl.updateTransferLineById);

export default router.stack;
