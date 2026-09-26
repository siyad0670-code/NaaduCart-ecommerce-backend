import express from "express";//express = veedu ondakunna company
import dotenv from "dotenv";//.env enna file read cheyan
import cors from "cors";//vere vetukark keran anuvadikuknu
import connectDB from "./config/db.js";//datbase connect cheynnu file
import productRoutes from "./routes/productRoutes.js";//productinete vazhi
import userRoutes from "./routes/userRoutes.js"//userinte vazhi
import orderRoutes from "./routes/orderRoutes.js"//orderinte vazhi
import paymentRoutes from "./routes/paymentRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
dotenv.config()//.env file 
connectDB()//mongodb coonect cheyan
const app= express()//vid undakki
app.use(cors())//access all permisssnno
app.use(express.json())//postman ayakunna json data mansilakan
app.use("/api/products",productRoutes)
app.use("/api/users",userRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/payments",paymentRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/contact",contactRoutes)
app.get("/",(req,res)=>{
    res.send("Ecommerce Bakend is running")
})
const PORT=process.env.PORT ;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`); 
    
})
