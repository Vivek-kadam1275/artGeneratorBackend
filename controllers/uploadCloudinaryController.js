

 
import { v2 as cloudinary } from "cloudinary";

import { v4 as uuidv4 } from 'uuid';
export const uploadImageToCloudinary = async (req, res) => {
    try {
        // console.log(req.body);
        const { imageUrl } = req.body;
        // console.log(imageUrl,name,email,tags);
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'No image URL provided',
            });
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

        // Upload to Cloudinary
        const cloudRes = await cloudinary.uploader.upload(base64Image, {
            folder: 'uploadMediaTutorial',
            resource_type: 'image',
            public_id: uuidv4(),
        });

        // // Store info in DB
        // await Upload.create({
        //     name,
        //     email,
        //     tags,
        //     url: cloudRes.secure_url,
        // });

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
     
};