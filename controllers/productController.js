import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
export const createProduct=async (req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({message:"image required"})
        }
        console.log("uploaded file:",req.file);
        const imageUrl=req.file.path
        const publicId=req.file.filename
        
        
        const product=new Product({...req.body,image:imageUrl,public_id:publicId});
        
        await product.save()
        res.status(201).json({
            message:"product Added Successfully",
            product
        })
    }catch (error) {
    console.log("ERROR:");
    console.error(error);

    return res.status(500).json({
        success: false,
        message: error.message
    });
}
    }

export const getProducts = async (req, res) => {
    try {
        const { category, isDeal, isNewArrival, isBestSeller } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (isDeal !== undefined) {
            filter.isDeal = isDeal === "true";
        }

        if (isNewArrival !== undefined) {
            filter.isNewArrival = isNewArrival === "true";
        }

        if (isBestSeller !== undefined) {
            filter.isBestSeller = isBestSeller === "true";
        }

        const products = await Product.find(filter);

        res.json(products);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "failed to fetch products",
            error: error.message
        });
    }
};
export const getSingleProduct=async (req,res)=>{
    try{
        const product=await Product.findById(req.params.id)
        res.json(product)
    }catch(error){
        res.status(500).json({
            message:error.message
        })
}
}
export const updateProduct=async (req,res)=>{
    try{
        const product= await Product.findById(req.params.id)
        if(!product){
            return res.status(404).json({message:"product not found"})
        }
        
        if(!req.file){
            return res.status(400).json({message:"image required"})
        }
        await cloudinary.uploader.destroy(product.public_id)
        const imageUrl=req.file.path
        const publicId=req.file.filename
        product.image=imageUrl
        product.public_id=publicId
        product.title=req.body.title || product.title
        product.description=req.body.description || product.description
        product.price=req.body.price || product.price
        product.category=req.body.category || product.category
        product.stock=req.body.stock || product.stock
        await product.save()
        res.json({message:"product updated successfully",product})
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
export const deleteProduct =async (req,res)=>{
    try{
        const product=await Product.findById(req.params.id)
        if(!product){
            return res.status(404).json({message:"product not found"})
        }
        await cloudinary.uploader.destroy(product.public_id)
        await product.deleteOne()
        res.json({message:"product deleted successfully"})
    }catch(error){
        res.json({message:error.message})
    }
}