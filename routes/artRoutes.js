import express from "express";
import { art } from "../controllers/artController.js";
const router=express.Router();


router.post('/art',art);

export default router;