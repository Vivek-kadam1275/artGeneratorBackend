
import Image from "../models/imageModel.js";
import Replicate from "replicate";
import OpenAI from "openai";
import env from "dotenv";
env.config();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateDalle = async (req, res) => {
  try {
    const { prompt } = req.body;
    // console.log(prompt);
    // if (!prompt) {
    //   return res.status(400).json({ error: "Prompt is required" });
    // }

    const response = await openai.images.generate({
      prompt: `${prompt} , digital painting, artistic, high detail, colorful, in the style of fantasy art`,
      n: 1,
      size: "512x512",
    });

    const imageUrl = response.data[0].url;
    return res.status(200).json({
      success: true, imageUrl: imageUrl, message: "image generated successfully"
    });
  } catch (error) {

    console.log("Error in dalle controller");
    console.error("OpenAI error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Image generation failed, try again" });
  }
}



export const saveImage = async (req, res) => {
  try {
    // console.log("into saveImage")

    const { imageUrl, prompt } = req.body;
    const userId = req.user.id;
    const storeImage = await Image.create({
      imageUrl, prompt, userId
    })

    return res.status(200).json({
      success: true,
      message: "image stored in db successfully",
      data: storeImage,
    })


  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "error in inserting image to database",

    });
  }
}

export const getImages = async (req, res) => {
  try {
    // console.log(req);
    const userId = req.user.id;
    const imageData = await Image.find({ userId });
    // console.log(imageData);
    return res.status(200).json({
      success: true,
      message: "images fetched successfully",
      data: imageData,
    })

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "error in inserting image to database",

    });
  }
}



const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/114.0.0.0 Safari/537.36",
  },
});
export const generateScribble = async (req, res) => {
  try {
    const { prompt, scribble } = req.body;
    console.log(prompt, scribble);

    if (!prompt || !scribble) {
      return res.status(400).json({ error: "Prompt and scribble are required" });
    }

    const output = await replicate.run(
      "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
      {
        input: {
          image: scribble,
          prompt: prompt,
          image_resolution: "512",
          // 🔥 Main tuning knobs for style:
          scale: 3.5, // ⬅️ Lower = less literal to the sketch, more creative
          ddim_steps: 30, // ⬅️ More steps = richer detail
          eta: 0, // Usually leave as 0

          // 🎨 Positive prompt boost
          a_prompt: "masterpiece, highly detailed, digital painting, colorful lighting, fantasy art, trending on artstation",

          // 🚫 Negative prompt to remove bad generations
          n_prompt:
            "blurry, low quality, lowres, bad anatomy, distorted, grayscale, cropped, bad hands, poorly drawn, boring background",

          num_samples: "1" // keep 1
        },
      }
    );

    // ✅ Output should be an array of image URLs
    console.log("early output", output[0]);
    console.log("✅ Replicate Output:", output[1].url());

    // Send the first image back
    res.status(200).json({ result: output[1].url() });
  } catch (err) {
    console.error("❌ Error calling Replicate API:", err);
    res.status(500).json({ error: "Failed to generate image" });
  }

}


export const testScribble= async (req, res) => {
  const testPrompt = "a colorful turtle";
  const testScribble =
    "https://replicate.delivery/pbxt/IJE6zP4jtdwxe7SffC7te9DPHWHW99dMXED5AWamlBNcvxn0/user_1.png";

    console.log(testPrompt);
  try {
    const output = await replicate.run(
      "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
      {
        input: {
          image: testScribble,
          prompt: testPrompt,
          image_resolution: "512",
          scale: 7,
        },
      }
    );

    console.log("✅ Output from Replicate:", output[1].url());
    return res.status(200).json({ result: output[1].url() });
  } catch (err) {
    console.error("❌ Replicate Error:", err);
    res.status(500).json({ error: "Failed to generate" });
  }
}