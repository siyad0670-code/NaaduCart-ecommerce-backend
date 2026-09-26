import jwt from "jsonwebtoken";//id card meachine
import User from "../models/User.js";//user model
//veetile security guard aanu ithh
export const protect=async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
           
            
            token=req.headers.authorization.split(" ")[1];//1 split cheythu token mathraam adukal
            
            const decoded=jwt.verify(token,process.env.JWT_SECRET)// 2original anoo check
            
            
            req.user =await User.findById(decoded.id).select("-password")
            next()
        }catch(error){
            
            return res.status(401).json({message:error.message})
        }
    }
    if(!token){
        return res.status(401).json({message:"no Token  ,vitill keran patilla"})
    }
}
export const isAdmin=(req,res,next)=>{
    if(req.user && req.user.role === "admin"){
        next()
    }else{
        return res.status(403).json({message:"ne admin alla,ith admin room ann!!"})
    }
}

