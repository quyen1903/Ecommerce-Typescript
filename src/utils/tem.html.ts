const htmlToken = ()=>{
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 50px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 10px 0;
      background-color: #4caf50;
      color: white;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
    }
    h1 {
      color: #333;
      text-align: center;
    }
    p {
      font-size: 16px;
      color: #555;
    }
    .otp-code {
      display: block;
      width: fit-content;
      margin: 20px auto;
      font-size: 24px;
      letter-spacing: 5px;
      padding: 10px;
      border: 2px dashed #4caf50;
      color: #4caf50;
    }
    .verify-button {
      display: block;
      width: fit-content;
      padding: 12px 20px;
      margin: 30px auto;
      background-color: #4caf50;
      color: white;
      text-decoration: none;
      font-size: 18px;
      border-radius: 5px;
    }
    .verify-button:hover {
      background-color: #45a049;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Email Verification</h2>
    </div>
    <div class="content">
      <h1>Hello,</h1>
      <p>Thank you for signing up! Please verify your email address by entering the following OTP code:</p>
      <div class="otp-code">123456</div>
      <p>Alternatively, you can click the button below to verify your email:</p>
      <a href="{{verificationLink}}" class="verify-button">Verify Email</a>
      <p>This code will expire in 10 minutes. If you didn’t request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`
}