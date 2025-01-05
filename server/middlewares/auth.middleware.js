import jwt from 'jsonwebtoken'
import { User } from '../models/User.models.js'

export const verifyJWT=async(req,res,next)=>{
    try{
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            return res.status(401).json({success:false,message:"Token not found while logging out"}) 
        }
        const decodedToken=jwt.verify(token,process.env.ATS)
        const user=await User.findById(decodedToken?._id).select("-refreshToken")
        if(!user){
            return res.status(401).json({success:false,message:"User not found while logging out"})           
        }
        req.user=user;
        next();
    }catch(error){
        return res.status(401).json({success:false,message:"Something went wrong while jwt verification"})
    }
}