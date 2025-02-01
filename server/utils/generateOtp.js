// generate otp for forgot-password
export const generateOTP = () => {
  return Math.floor(Math.random() * 900000) + 100000; // Math.random() generates a decimal number between 0 (inclusive) and 1 (exclusive). Multiplying by 900000 scales the range from 0 to 899,999.999. Math.floor() removes the decimal part, ensuring an integer output. The function returns a random integer between 100,000 and 999,999, inclusive. This logic ensures a six-digit OTP, suitable for scenarios like authentication or account verification.
};
