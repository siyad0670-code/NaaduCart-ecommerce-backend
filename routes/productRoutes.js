import express from "express";
import { createProduct,getProducts,getSingleProduct ,updateProduct,deleteProduct } from "../controllers/productController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router=express.Router()
router.post("/" ,protect,isAdmin,upload.single("image"),createProduct)
router.get("/",getProducts)
router.get("/:id",getSingleProduct)
router.put("/:id",protect,isAdmin,upload.single("image"),updateProduct)
router.delete("/:id",protect,isAdmin ,upload.single("image"),deleteProduct)
export default router;