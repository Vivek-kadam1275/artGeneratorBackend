 import mongoose, { model } from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        min:3,
        max:20,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        max:50,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        min:8,
        
        
    },
    isAvatarSet:{
        type:Boolean,
        default:false,
    },
    avatarImage:{
        type:String,
        default:"",
    }
})

export default mongoose.model("User",userSchema);