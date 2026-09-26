import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "products", // Cloudinary folder name
        allowed_formats: ["jpg", "jpeg", "png","webp"], // Allowed file formats
    },
});
const upload = multer({ storage: storage });

export default upload;