import express from 'express';
import authRouter from './authRoute.js'

const router = express.Router();
router.stack = [
	...router.stack, 
    ...authRouter
]

export default router;