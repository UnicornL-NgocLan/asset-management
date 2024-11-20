import express from 'express';
import authRouter from './authRoute.js'
import assetRouter from './assetRoute.js'
import auditRouter from './auditRoute.js'

const router = express.Router();
router.stack = [
	...router.stack, 
    ...authRouter,
    ...assetRouter,
    ...auditRouter
]

export default router;