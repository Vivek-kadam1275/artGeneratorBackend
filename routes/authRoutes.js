import express from "express";
import { login, logout, register, verify } from "../controllers/authControllers.js";


const router=express.Router();


router.post('/signup',register);
router.post('/login',login);
router.get('/verify',verify);
router.get('/logout',logout);



export default router;
