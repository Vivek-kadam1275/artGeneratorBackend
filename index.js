import express from "express";
import env from "dotenv";
import dbConnect from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadImageRoute.js";
import artRoute from "./routes/artRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
env.config();

 
import { cloudinaryConnect } from "./config/cloudinary.js";
 

const app=express();
const port=process.env.PORT;
app.use(express.json());

app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173","http://localhost:5174","https://modern-arter.netlify.app"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use('/api/auth', authRoutes);
app.use('/api/artGenerator',uploadRoutes);
// app.use('/api/artGenerator',avatarRoute);
app.use('/api/artGenerator',artRoute);

app.get("/",(req,res)=>{
    res.send("This is home page")
})

app.get("/my-ip", async (req, res) => {
  const ip = await fetch("https://ifconfig.me").then(r => r.text());
  res.send(`Your server IP is: ${ip}`);
});


cloudinaryConnect();
dbConnect().then(() => {
    app.listen(port,()=>{
        console.log(`server running on port ${port}`);
    })
}).catch(err => {
    console.error("Database connection failed:", err);
});
