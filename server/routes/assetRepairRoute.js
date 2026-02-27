import express from "express";
import { assetRepairCtrl } from "../controllers/assetRepairController.js";
import { authenticateUser } from "../middleWare.js";

const router = express.Router();

router.get("/get-asset-repair-list", authenticateUser, assetRepairCtrl.getAssetRepairList);
router.get("/get-asset-repair-by-id/:id", authenticateUser, assetRepairCtrl.getAssetRepairById);
router.get("/get-asset-repair-line/:id", authenticateUser, assetRepairCtrl.getAssetRepairLineList);
router.post("/asset-repair-confirm", authenticateUser, assetRepairCtrl.callConfirmRelatedFunction);
router.patch("/update-asset-repair-line/:id", authenticateUser, assetRepairCtrl.updateAssetRepairtLineById);

export default router.stack;
