import express from "express";
import { purchaseHandoverCtrl } from "../controllers/purchaseHandoverController.js";
import { authenticateUser } from "../middleWare.js";

const router = express.Router();

router.get("/get-purchase-handover-list", authenticateUser, purchaseHandoverCtrl.getPHList);
router.get("/get-asset-purchase-handover-by-id/:id", authenticateUser, purchaseHandoverCtrl.getPHById);
router.get("/get-asset-purchase-handover-line/:id", authenticateUser, purchaseHandoverCtrl.getPHLineList);
router.post("/purchase-handover-confirm", authenticateUser, purchaseHandoverCtrl.callConfirmRelatedFunction);
router.patch("/update-purchase-handover-line/:id", authenticateUser, purchaseHandoverCtrl.updatePurchaseHandoverLineById);

export default router.stack;
