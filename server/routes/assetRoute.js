import express from "express";
import {assetCtrl} from "../controllers/assetController.js";
import {authenticateUser} from '../middleWare.js'


const router = express.Router();

router.post("/get-asset",authenticateUser,assetCtrl.searchAsset);
router.post("/get-asset-transfer",authenticateUser,assetCtrl.getAssetTransferLines);
router.post("/get-asset-inventory",authenticateUser,assetCtrl.getAssetInventoryLines);
router.post("/get-asset-adjustment",authenticateUser,assetCtrl.getAssetAdjustmentLines);
router.post("/get-asset-repair",authenticateUser,assetCtrl.getAssetRepairLines);

export default router.stack;