import express from "express";
import { uploadImageToCloudinary } from "../controllers/uploadCloudinaryController.js";
const router=express.Router();


router.post('/uploadImageToCloudinary',uploadImageToCloudinary);

export default router;