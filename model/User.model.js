import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type : String
    },
    resetPasswordToken: {
        type : String
    },
    resetPasswordExpires: {
        type : Date
    }
},
{
    timestamps: true
}
)

const adminSchema = new mongoose.Schema({

})

userSchema.pre("save" ,async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10)
    }
    next()
})




const User = mongoose.model("User" , userSchema);
const Admin = mongoose.model("Admin" , adminSchema)


export {User , Admin}