import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String,
    },
    otpExpire:{
        type:Date
    },
    role:{
        type:String,
        default:"user",
        enum:["user","admin"]
    },
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }]
},{timestamps:true})
const User=mongoose.model("User",userSchema)
export default User