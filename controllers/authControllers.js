
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import env from "dotenv";
env.config();
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existUserName = await User.findOne({ username });
        if (existUserName) {
            return res.status(400).json({
                success: false,
                message: "username already exist"
            })
        }
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({
                success: false,
                message: "email already exist"
            })
        }

        var encryptedPassword = "";
        encryptedPassword = await bcrypt.hash(password, 10);
        // console.log(encryptedPassword);



        const createUser = await User.create({
            username, email, password: encryptedPassword
        })
        res.status(200).json({
            success: true,
            message: "user created successfully.. "
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error,
        })
    }

}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username,password);
        var existUser = await User.findOne({ username });
        if (!existUser) {
            return res.status(400).json({
                success: false,
                message: "You haven't registered yet...",
                exist: false,

            })
        }
        const pass = await bcrypt.compare(password, existUser.password);
        // console.log(pass);
        var payload = {
            id: existUser._id,
            name: existUser.username,
            email: existUser.email,
            isAvatarSet: existUser.isAvatarSet,
            avatarImage: existUser.avatarImage,
        }
        try {
            if (pass) {
                // create jwt token (payload-data,secretkey,optional)
                console.log("creating jwt token")
                const token = jwt.sign(payload, process.env.jwt_secret, {
                    expiresIn: "24h"
                });
                // console.log(existUser)

                existUser = existUser.toObject();
                // add token to existUser
                existUser.token = token;
                // console.log(existUser);
                // remove password from existUser
                existUser.password = undefined;
                // console.log(existUser);


                // create cookie

                const options = {
                    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                    httpOnly: true,
                    secure: true,  //  Required for HTTPS
                    sameSite: 'none'  //  Required for cross-origin cookies
                }
                // 
                return res.cookie("loginCookie", token, options).status(200).json({
                    success: true,
                    token: token,
                    user: existUser,
                    message: "login succesfull..."
                })
                console.log("created cookie")
            } else {
                return res.status(501).json({
                    success: false,
                    message: "incorrect password..."
                })
            }

        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Wrong password"
            });
        }



    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err,
        });
    }


}

export const verify = async (req, res) => {
    const token = req.cookies.loginCookie;
    console.log("verifying")
    console.log(token);
    if (!token) return res.status(401).json({ error: "Unauthorized", success: false });

    jwt.verify(token, process.env.jwt_secret, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token expired", success: false });
        res.json({
            success: true,
            userId: decoded.id,
            authenticated: true
        });
    });
}

export const logout = async (req, res) => {
    try {
        console.log("into logout");
        console.log(req.cookies.loginCookie);
        res.clearCookie("loginCookie", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            // domain: ".vercel.app" ,// ✅ Ensure it clears across subdomains
            // path: "/", // Ensure it's removed for all paths
        });
        console.log(req.cookies.loginCookie);
        res.json({
            success: true,
            message: "Logged out",

        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "unable to logout",

        });
    }
}

export const reqForgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${token}`;

        await sendEmail(user.email, "Password Reset", `Click to reset: ${resetUrl}`);
        res.json({ message: "Password reset email sent" });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "unable to send mail ",

        });
    }
}

export const resetPassword = async (req, res) => {
    try {

        const { token } = req.params;
        const { password } = req.body;
        // console.log("printing token and password",token,password);
        var encryptedPassword = "";
        encryptedPassword = await bcrypt.hash(password, 10);
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.password = encryptedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        // console.log("Printing user --->",user);
        await user.save();

        res.json({ message: "Password has been reset" });
    } catch (error) {

    }
}