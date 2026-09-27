import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        await resend.emails.send({
            from: "NaaduCart <onboarding@resend.dev>",
            to: [process.env.EMAIL_USER],
            replyTo: email,
            subject:` NaaduCart Contact: ${subject}`,
            text: `Name: ${name}
            Email: ${email}
            Message:${message}`,
        });

        res.status(200).json({
            success: true,
            message: "Message sent successfully",
        });
    } catch (error) {
        console.error("CONTACT EMAIL ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message",
        });
    }
};