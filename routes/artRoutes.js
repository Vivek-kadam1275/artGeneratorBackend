import express from "express";
import { generateDalle, generateScribble, getImages, saveImage, testScribble } from "../controllers/artController.js";
import { auth } from "../middlewares/authMiddleware.js";
const router = express.Router();



router.post('/saveImage', auth, saveImage);
router.get('/getImages', auth, getImages);




router.post("/dalle",generateDalle);
router.post("/scribble",generateScribble);



router.post("/test-scribble",testScribble);

export default router;