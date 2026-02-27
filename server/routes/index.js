import express from "express";
import authRouter from "./authRoute.js";
import assetRouter from "./assetRoute.js";
import auditRouter from "./auditRoute.js";
import transferRouter from "./transferRoute.js";
import handoverRouter from "./purchaseHandoverRoute.js";
import assetRepairRouter from "./assetRepairRoute.js";

const router = express.Router();
router.stack = [...router.stack, ...authRouter, ...assetRouter, ...auditRouter, ...transferRouter, ...handoverRouter, ...assetRepairRouter];

export default router;
