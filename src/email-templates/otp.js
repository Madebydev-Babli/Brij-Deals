export default function OtpTemplate(otp) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="text-align: center; border-bottom: 2px solid #2F7D05; padding-bottom: 20px; margin-bottom: 20px;">
                <h2 style="color: #2F7D05; margin: 0; font-size: 24px; font-weight: bold;">Easy Loans Apply</h2>
            </div>
            <div style="color: #333333; font-size: 16px; line-height: 1.6;">
                <p>Hello,</p>
                <p>We received a request to verify your account. Please use the following One-Time Password (OTP) to proceed. This OTP is valid for the next 5 minutes.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 36px; font-weight: bold; color: #ffffff; background-color: #2F7D05; padding: 12px 24px; border-radius: 8px; letter-spacing: 6px;">${otp}</span>
                </div>
                <p>If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
            </div>
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888888; font-size: 14px;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Easy Loans Apply. All rights reserved.</p>
            </div>
        </div>
    `;
}