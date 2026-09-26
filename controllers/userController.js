import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import sendEmail from "../utils/sendEmail.js";
export const signup=async (req,res)=>{
    try{
        const {name,email,password}=req.body
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            })
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const newUser =new User({
            name,
            email,
            password:hashedPassword,
            isVerified:false
        })
        await newUser.save()
         const otp=Math.floor(100000+ Math.random()*900000).toString()
        newUser.otp=otp
        newUser.otpExpire=Date.now()+5*60*1000
        await newUser.save();
        await sendEmail(newUser.email,
            "Email verification OTP",
        `Your OTP is ${otp}.it is valid for 5 minute`)
         res.status(200).json({
            message:"Signup successful. OTP sent to your email for verification"
        })
    
    }catch(error){
        res.status(404).json({
            message:error.message
        })
    }
}
export const login=async (req,res)=>{
    try{
        const {email,password}=req.body
        const user = await User.findOne({email})
       
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
         if(!user.isVerified){
            return res.status(400).json({message:"Please verify your email first"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"invalid password"})
        }
        const token=jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )
        res.status(200).json({
            message:"login successful",user:{
                token,
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
    
    
}
export const forgotPassword=async (req,res)=>{
    try{
        const {email}=req.body
        const user=await User.findOne({email})
        if(!user){
         return res.status(404).json({
                message:"user is not found"
            })
        }
        const otp=Math.floor(100000+ Math.random()*900000).toString()
        user.otp=otp
        user.otpExpire=Date.now()+5*60*1000
        await user.save();
        await sendEmail(user.email,
            "Password Reset OTP",
        `Your OTP is ${otp}.it is valid for 5 minute`)
         res.status(200).json({
            message:"OTP sent to your email"
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
export  const verifyOtp=async (req,res)=>{
    try{
        const {email,otp}=req.body
        const user=await User.findOne({email})
        if(!user){
          return res.status(404).json({
                message:"user is not found"
            })
        }
        if(user.otp !== otp){
            return res.status(400).json({
                message:"Invalid OTP"
            })
        }
        if(user.otpExpire <  Date.now()){
            return res.status(400).json({
                message:"OTP has expired"
            })
        }
        const resetToken=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"10m"}
        )
        res.status(200).json({
            message:"OTP verified successfully",
            resetToken
        })

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
export const resetPassword=async (req,res)=>{
    try{
        const {newPassword}=req.body
        if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
            return res.status(401).json({
                message:"no token provided"
            })
        }
        const token=req.headers.authorization.split(" ")[1]
        
        
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
       
        const user=await User.findById(decoded.id)
      
        if(!user){
           return res.status(404).json({
                message:"user is not found"
            })
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(newPassword,salt)
        user.password=hashedPassword
        user.otp=null
        user.otpExpire=null
        await user.save()
        res.status(200).json({
            message:"Password reset successful"
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
export const verifySignupOtp=async (req,res)=>{
    try{
        const {email,otp}=req.body
        const user=await User.findOne({email})
        if(user.isVerified){
            return res.status(400).json({
                message:"Email is already verified"
            })
        }
        if(!user){
            return res.status(404).json({
                message:"user is not found"
            })
        }
        if(user.otp !== otp){
            return res.status(400).json({
                message:"Invalid OTP"
            })
        }
        if(!user.otpExpire  || user.otpExpire < Date.now()){
            return res.status(400).json({
                message:"OTP has expired"
            })
        }
        user.isVerified=true
        user.otp=null
        user.otpExpire=null
        await user.save()
        res.status(200).json({
            message:"Email verified successfully"
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
// GET /api/users/wishlist
export const getWishlist = async (req, res) => {
try {
const user = await User.findById(req.user._id).populate("wishlist");

if (!user) {
return res.status(404).json({ message: "User not found", wishlist: [] });
}

// point 29: empty ആണെങ്കിലും []
res.status(200).json({ wishlist: user.wishlist || [] });
} catch (error) {
console.error("getWishlist error:", error);
// 501 അല്ല, 500 ആണ് ശരി
res.status(500).json({
message: "Failed to fetch wishlist",
error: error.message,
});
}
};

// POST /api/users/wishlist/:productId
export const addToWishlist = async (req, res) => {
try {
const { productId } = req.params;
const user = await User.findById(req.user._id);

// ObjectId vs string compare ചെയ്യാൻ toString
if (!Array.isArray(user.wishlist)) {
user.wishlist = [];
}

const already = user.wishlist.some(
(id) => id.toString() === productId
);
if (!already) {
user.wishlist.push(productId);
await user.save();
}

await user.populate("wishlist");
res.status(200).json({
message: "Product added to wishlist",
wishlist: user.wishlist,
});
} catch (error) {
    console.log(error);
    
    
res.status(500).json({
message: "Failed to add product to wishlist",
error: error.message,
});
}
};

// DELETE /api/users/wishlist/:productId
export const removeFromWishlist = async (req, res) => {
try {
const { productId } = req.params;
const user = await User.findById(req.user._id);

user.wishlist = user.wishlist.filter(
(id) => id.toString() !== productId
);
await user.save();
await user.populate("wishlist");

res.status(200).json({
message: "Product removed from wishlist",
wishlist: user.wishlist,
});
} catch (error) {
res.status(500).json({
message: "Failed to remove product from wishlist",
error: error.message,
});
}
};