export const forgotPasswordTemplate = ({ name, otp }) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #0056b3;">Password Reset Request</h2>
    
    <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
    
    <p style="font-size: 16px;">
      We received a request to reset your password. Use the OTP code below to proceed with resetting your password:
    </p>

    <div style="background: #ffeb3b; font-size: 28px; padding: 20px; text-align: center; font-weight: bold; letter-spacing: 4px; color: #333; border-radius: 8px; margin: 20px 0;">
      ${otp}
    </div>

    <p style="font-size: 16px;">
      <strong>Note:</strong> This OTP is valid for <strong>1 hour</strong> only. Enter the OTP on the Binkeyit website to complete the password reset process. If you didn't request this, please ignore this email.
    </p>

    <hr style="border: none; height: 1px; background: #e0e0e0; margin: 30px 0;">
    
    <p style="font-size: 16px;">Thanks,</p>
    <p style="font-size: 16px; font-weight: bold; color: #0056b3;">The Binkeyit Team</p>
  </div>
    `;
};

{
  /* <div>
    <p>Dear, ${name}</p>
<p>You're requested a password reset. Please use following OTP code to reset your password.</p>
<div style="background:yellow; font-size:20px;padding:20px;text-align:center;font-weight : 800;">
    ${otp}
</div>
<p>This otp is valid for 1 hour only. Enter this otp in the Binkeyit website to proceed with resetting your password.</p>
<br/>
</br>

<p>Thanks</p>
<p>Binkeyit</p>
</div> */
}
