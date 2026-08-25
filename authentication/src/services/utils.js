function generateOtp(){
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

function getOtpHtml(otp, purpose = "registration"){
  const title = purpose === "login" ? "Two-Factor Authentication" : "Verify your email address";
  const message = purpose === "login"
    ? "We detected a login attempt for your Civic Reach account. Please use the verification code below to complete your sign-in:"
    : "Thank you for signing up for Civic Reach. Please use the verification code below to complete your registration process:";

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Civic Reach</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b; -webkit-font-smoothing: antialiased;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fafafa; width: 100%; height: 100%;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 460px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #f4f4f5; text-align: center;">
                  <span style="font-size: 16px; font-weight: 600; letter-spacing: 1px; color: #09090b; text-transform: uppercase;">Civic Reach</span>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 32px 32px 24px 32px;">
                  <h1 style="font-size: 18px; font-weight: 600; color: #09090b; margin: 0 0 16px 0; line-height: 1.4;">${title}</h1>
                  <p style="font-size: 14px; line-height: 22px; color: #3f3f46; margin: 0 0 24px 0;">
                    ${message}
                  </p>
                  
                  <!-- OTP Code Box -->
                  <div style="margin: 32px 0; text-align: center;">
                    <div style="display: inline-block; background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 6px; padding: 14px 28px;">
                      <span style="font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace; font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #09090b; margin-left: 6px;">${otp}</span>
                    </div>
                  </div>
                  
                  <p style="font-size: 13px; line-height: 20px; color: #71717a; margin: 0 0 16px 0;">
                    This code is valid for <strong>5 minutes</strong>. If you did not request this verification, please ignore this message.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 24px 32px 32px 32px; border-top: 1px solid #f4f4f5; text-align: center;">
                  <p style="font-size: 12px; color: #71717a; margin: 0 0 4px 0;">© 2026 Civic Reach. All rights reserved.</p>
                  <p style="font-size: 11px; color: #a1a1aa; margin: 0;">Building better communities together.</p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

module.exports = {
  generateOtp,
  getOtpHtml
};