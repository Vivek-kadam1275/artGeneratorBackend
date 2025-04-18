 import mongoose from "mongoose";

const imageSchema=new mongoose.Schema({
    imageUrl:{
        type:String,
        required:true,
        trim:true,
    },
    prompt:{
        type:String,
        required:true,
        trim:true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
    
})

export default mongoose.model("Image",imageSchema);