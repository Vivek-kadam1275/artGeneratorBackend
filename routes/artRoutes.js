import express from "express";
import { generateScribble, getImages, saveImage } from "../controllers/artController.js";
import { auth } from "../middlewares/authMiddleware.js";
const router = express.Router();



router.post('/saveImage', auth, saveImage);
router.get('/getImages', auth, getImages);




router.post("/scribble",generateScribble);


// router.post("/test-scribble", async (req, res) => {
//   const testPrompt = "a colorful turtle";
//   const testScribble =
//     "https://replicate.delivery/pbxt/IJE6zP4jtdwxe7SffC7te9DPHWHW99dMXED5AWamlBNcvxn0/user_1.png";

//     console.log(testPrompt);
//   try {
//     const output = await replicate.run(
//       "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
//       {
//         input: {
//           image: testScribble,
//           prompt: testPrompt,
//           image_resolution: "512",
//           scale: 7,
//         },
//       }
//     );

//     console.log("✅ Output from Replicate:", output[1].url());
//     return res.status(200).json({ result: output[0] });
//   } catch (err) {
//     console.error("❌ Replicate Error:", err);
//     res.status(500).json({ error: "Failed to generate" });
//   }
// });

export default router;