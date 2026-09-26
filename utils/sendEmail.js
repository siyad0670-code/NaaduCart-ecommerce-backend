import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config()


const transport=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

const sendEmail=async (to,subject,text)=>{
    await transport.sendMail({
        from:process.env.EMAIL_USER,
        to,
        subject,
        text
    })
}
export default sendEmail