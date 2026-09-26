import { Router } from "express";
import { login,signup,forgotPassword,resetPassword,verifyOtp,verifySignupOtp ,getWishlist,removeFromWishlist,addToWishlist} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import express from "express"
const router=express.Router()
router.post("/signup",signup)
router.post("/login",login)
router.post("/forgot-password",forgotPassword)
router.post("/verify-otp",verifyOtp)
router.post("/reset-password",resetPassword)
router.post("/verify-signup-otp",verifySignupOtp)
router.get("/wishlist",protect,getWishlist)
router.post("/wishlist/:productId",protect,addToWishlist)
router.delete("/wishlist/:productId",protect,removeFromWishlist)

export default router