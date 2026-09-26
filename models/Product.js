import mongoose from "mongoose";

const productSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    public_id:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    discountPrice: {
    type: Number,
    default: null,
    },

    brand: {
    type: String,
    default: "",
    },

   isDeal: {
   type: Boolean,
   default: false,
   },

   isNewArrival: {
   type: Boolean,
   default: false,
   },

   isBestSeller: {
   type: Boolean,
   default: false,
   },

})
const Product=mongoose.model("Product",productSchema)
export default Product;