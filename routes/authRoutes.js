import express from "express";
import { login, logout, register, reqForgotPassword, resetPassword, verify } from "../controllers/authControllers.js";


const router=express.Router();


router.post('/signup',register);
router.post('/login',login);
router.get('/verify',verify);
router.get('/logout',logout);

router.post('/reqForgotPassword',reqForgotPassword);
router.post('/resetPassword/:token',resetPassword);

export default router;
