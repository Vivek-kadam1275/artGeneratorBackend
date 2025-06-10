
import { v2 as cloudinary } from "cloudinary";

import { v4 as uuidv4 } from 'uuid';

export const uploadCloudinary=async(imageUrl)=>{
     try {
      
      
      
        if (!imageUrl) {
            console.log("imaage not found");
            return;
        }

        // Fetch the image
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Convert to base64 string for Cloudinary
        const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;

        console.log("uploading");
        // Upload to Cloudinary
        const cloudRes = await cloudinary.uploader.upload(base64Image, {
            folder: 'uploadMediaTutorial',
            resource_type: 'image',
            public_id: uuidv4(),
        });

        console.log("uploaded..");

        return res.status(200).json({
            success: true,
            message: 'Image uploaded to Cloudinary successfully',
            url: cloudRes.secure_url,
        });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during upload',
        });
    }
}