import express from "express";
import { getImages, saveImage } from "../controllers/artController.js";
import { auth } from "../middlewares/authMiddleware.js";
const router=express.Router();


router.post('/saveImage',auth,saveImage);
router.get('/getImages',auth,getImages);

export default router;