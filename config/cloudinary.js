import { v2 as cloudinary } from "cloudinary";
import env from "dotenv";
env.config();


export const cloudinaryConnect=()=>{
    try {
        cloudinary.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.SECRET_KEY,
        })

        console.log("cloudinary connection successfully..")
    } catch (error) {
        console.log("error in cloudinary connection",error);
    }
      
}