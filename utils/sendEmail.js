import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
    const { data, error } = await resend.emails.send({
        from: "NaaduCart <onboarding@resend.dev>",
        to: [to],
        subject,
        text
    });

    if (error) {
        console.error("Resend email error:", error);
        throw new Error(error.message);
    }

    console.log("Email sent:", data);
};

export default sendEmail;