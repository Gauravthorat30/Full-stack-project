import mongoose from "mongoose";
import {User , Admin} from "../model/User.model.js"
import crypto from "crypto"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


console.log("hii")
dotenv.config();


export const registerUser = async (req, res) => {




    const {name, email, password} = req.body;
    try {

    
        if(!name || !email || !password){
            
            return res.status(400).json({
                message : "All fields are required"
            })
            
        }
    }

    catch (error) {
        console.log("error in registering user", error)
        return res.status(500).json({
            message : "internal server error" 
        })
    }

    try {
        console.log(1)
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({ 
                message : "User aldready exist"
            })
        }

        console.log(2)

        await User.create({
            name,
            email,
            password
        })

        console.log(3)

        const existingUserToSaveToken = await User.findOne({name})
        
        console.log(4)
        const token = crypto.randomBytes(32).toString("hex") + Date.now();
        existingUserToSaveToken.verificationToken = token;
        existingUserToSaveToken.save();
        
        console.log(5)

        const transporter = nodemailer.createTransport({
            host : process.env.GMAIL_HOST,
            port : process.env.GMAIL_PORT,
            secure : false,
            auth : {
                user : process.env.GMAIL_SENDERMAIL,
                pass : process.env.GMAIL_PASSWORD
            }
            
        })
    
        console.log(5)

        const mailOptions = {
            from : process.env.GMAIL_SENDERMAIL,
            to : "gauravthorat42057@gmail.com",
            subject : "verify your email",
            html : `<p>Click <a href = "http://localhost:3000/api/user/verify?token=${token}&token2=2">here</a> to verify your account</p>` 
            }



    
        await transporter.sendMail(mailOptions)

        res.status(200).json({
            msg : "User registered and Mail send sucessfully for verification"
        })




    
    } catch (error) {
        return res.status(400).json({
            message : "user not registered"
        })
    }
    

    console.log(name , email , password);


}

export const verifyUser = async (req , res) => {

    
    console.log("10")
    try {

        const tokenSendByUser = req.query.token;
        const tokenSendByUser2 = req.query.token2;

        console.log(tokenSendByUser)
        console.log(tokenSendByUser2)

    
        const tokenMatched = await User.findOne({
            verificationToken : tokenSendByUser
        })
    
        if(tokenMatched){

            tokenMatched.isVerified = true
            await tokenMatched.save();

            await tokenMatched.updateOne(
                {$unset : {verificationToken : ""}}
            )

            res.status(200).json({
                msg : "User verified sucessfully"
            })
        }
        else{
            res.status(400).json({
                msg : "Invalid token"
            })
        }
        console.log("inside verify")
    
    } catch (error) {
        res.status(400).json({
            msg : "Error while verifying user"
        })
    }


}

export const login = async (req , res) => {

    try {
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                msg : "Incomplete credentials"
            })
        }
        

        const user = await User.findOne({email});


        if(!user){
            return res.status(400).json({
                msg : "User not found"
            })
        }


        const userPassword = user.password;
        const isPassMatched = await bcrypt.compare(password , userPassword);
        const isEmailMatched = user.email === email
        const isVerified = user.isVerified
    

        if(!isPassMatched || !isEmailMatched){
            return res.status(400).json({
                msg : "Invalid credentials"
            })
        }

        if(!isVerified){
            return res.status(400).json({
                msg : "Please verify yourself via email"
            })                                         
        }
        console.log(1)

        const cookie = jwt.sign({email : user.email , id : user._id} , process.env.JWT_PASSWORD , {expiresIn : "24h"});
        console.log(1)

        const cookieOptions = {
            secure : true,
            httponly : true,
            maxage : 1000*60*60*24
            
        }
        res.cookie("cookie" , cookie , cookieOptions)
        console.log(1)


        res.status(200).json({
            sucess : true,
            msg : "User logined sucessfully",
            cookie,
            user : {
                id : user._id,
                name : user.name,
                role : user.role
            }
        })



    } catch (error) {
        return res.status(400).json({
            msg : "Internal server error"
        })
    }


}



