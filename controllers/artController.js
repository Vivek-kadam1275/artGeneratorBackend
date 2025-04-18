
import Image from "../models/imageModel.js";
export const saveImage= async (req, res) => {
    try {
        // console.log("into saveImage")
       
        const {imageUrl,prompt}=req.body;
        const userId=req.user.id;
        const storeImage=await Image.create({
            imageUrl,prompt,userId
        })

        return res.status(200).json({
            success:true,
            message:"image stored in db successfully",
            data:storeImage,
        })
        

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "error in inserting image to database",

        });
    }
}

export const getImages=async(req,res)=>{
    try {
        console.log(req);
       const userId=req.user.id;
        const imageData= await Image.find({userId})
        console.log(imageData);
        return res.status(200).json({
            success:true,
            message:"images fetched successfully",
            data:imageData,
        })

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "error in inserting image to database",

        });
    }
}