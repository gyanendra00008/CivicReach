
const { BrevoClient } = require("@getbrevo/brevo");
require("dotenv").config();


const BREVO_API_KEY = (process.env.BREVO_API_KEY || "").trim();

if (!BREVO_API_KEY) {
    console.warn(
        " BREVO_API_KEY is not configured."
    );
} else {
    console.log(" Brevo API configured");
}

// Create Brevo client
const brevo = BREVO_API_KEY
    ? new BrevoClient({
          apiKey: BREVO_API_KEY,
      })
    : null;



const sendEmail = async (to, subject, text, html) => {
    if (!brevo) {
        console.error(
            "Brevo is not configured. Email not sent."
        );

        throw new Error("Email service is not configured");
    }

    try {
        console.log(` Sending email to: ${to}`);

        const result = await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: "CivicReach",
                email: process.env.EMAIL_USER,
            },

            to: [
                {
                    email: to,
                },
            ],

            subject: subject,

            textContent: text,

            htmlContent: html,
        });

        console.log(
            "Email sent successfully!"
        );

        console.log(
            "   Message ID:",
            result.messageId
        );

        return {
            success: true,
            messageId: result.messageId,
        };

    } catch (error) {
        console.error(
            "Failed to send email"
        );

        console.error(
            "   Error:",
            error.message || error
        );

        
        throw error;
    }
};




module.exports = { sendEmail };
