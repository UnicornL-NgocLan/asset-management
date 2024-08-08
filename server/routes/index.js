import express from 'express';
import authRouter from './authRoute.js'
import assetRouter from './assetRoute.js'

const router = express.Router();
router.stack = [
	...router.stack, 
    ...authRouter,
    ...assetRouter
]

export default router;