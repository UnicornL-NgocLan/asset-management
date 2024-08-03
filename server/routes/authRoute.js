import express from "express";
import {authCtrl} from "../controllers/authController.js";
import {authenticateUser} from '../middleWare.js'


const router = express.Router();

router.post("/login", authCtrl.login);
router.post("/get-companies", authenticateUser ,authCtrl.getUserCompanies);
router.patch("/change-company", authenticateUser,authCtrl.changeOdooCompany);


export default router.stack;