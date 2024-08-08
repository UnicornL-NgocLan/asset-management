import express from "express";
import {assetCtrl} from "../controllers/assetController.js";
import {authenticateUser} from '../middleWare.js'


const router = express.Router();

router.post("/get-asset",authenticateUser,assetCtrl.searchAsset);
router.post("/get-asset-transfer",authenticateUser,assetCtrl.getAssetTransferLines)

export default router.stack;