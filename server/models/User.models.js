import mongoose, { mongo } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true 
    },
    refreshToken:{
        type:String
    },
    friends: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    friendRequests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    friendRequestsSent: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],

},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password=await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        username:this.username
    },
    process.env.ATS,
    {
        expiresIn:process.env.ATE
    }
)
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id
    },
    process.env.RTS,
    {
        expiresIn:process.env.RTE
    }
)
}

export const User=mongoose.model("User",userSchema)