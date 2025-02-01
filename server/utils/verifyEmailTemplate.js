const verificationEmailTemplate = ({ name, url }) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .email-header {
      background-color: #071263;
      padding: 20px;
      text-align: center;
      color: white;
      font-size: 24px;
      font-weight: bold;
    }

    .email-body {
      padding: 30px;
      font-size: 16px;
      color: #333333;
    }

    .email-body p {
      margin: 0 0 20px;
    }

    .verify-button {
      display: inline-block;
      background-color: #071263;
      color: white;
      text-decoration: none;
      padding: 15px 30px;
      font-size: 18px;
      font-weight: bold;
      border-radius: 5px;
      text-align: center;
    }

    .verify-button:hover {
      background-color: #0a1559;
    }

    .email-footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #777777;
    }

    @media (max-width: 600px) {
      .email-body {
        padding: 20px;
      }
    }
  </style>
</head>

<body>
  <div class="email-container">
    <!-- Header Section -->
    <div class="email-header">
      Binkeyit Email Verification
    </div>

    <!-- Body Section -->
    <div class="email-body">
      <p>Dear ${name},</p>
      <p>Thank you for registering with Binkeyit! Please verify your email address to complete the registration process.</p>
      <p style="text-align: center;">
        <a href="${url}" class="verify-button">Verify Email</a>
      </p>
      <p>If you did not request this, please ignore this email.</p>
    </div>

    <!-- Footer Section -->
    <div class="email-footer">
      &copy; ${new Date().getFullYear()} Binkeyit. All rights reserved.<br>
      <!-- Need help? <a href="mailto:support@Binkeyit.com">Contact Support</a> -->
    </div>
  </div>
</body>

</html>
  `;
};

export default verificationEmailTemplate;

// const verificationEmailTemplate = ({ name, url }) => {
//   return `
//     <p>Dear ${name}</p>
//     <p>Thank you for registering Binkeyit.</p>
//     <a href=${url} style="color: white; background: #071263; margin-top: 10px; padding: 20px">
//         Verify Email
//     </a>

//     `;
// };

// export default verificationEmailTemplate;
