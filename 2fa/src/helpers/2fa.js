import qrcode from "qrcode";
import otplib from "otplib";

/** Gọi ra để sử dụng đối tượng "authenticator" của thằng otplib */
const { authenticator } = otplib;

/** 
 *  Tạo mã secret key ứng với từng user để phục vụ việc tạo otp token.
*/
const generateUniqueSecret = () => {
  return authenticator.generateSecret();
};

/** Tạo mã OTP token */
const generateOTPToken = (username, serviceName, secret) => {
  return authenticator.keyuri(username, serviceName, secret);
};

/** Kiểm tra mã OTP token có hợp lệ hay không
 * Có 2 method "verify" hoặc "check", 
 * các bạn có thể thử dùng một trong 2 tùy thích.
 */
const verifyOTPToken = (token, secret) => {
  return authenticator.verify({ token, secret });
  // return authenticator.check(token, secret)
};

/** Tạo QR code từ mã OTP để gửi về cho user sử dụng app quét mã */
const generateQRCode = async (otpAuth) => {
  try {
    const QRCodeImageUrl = await qrcode.toDataURL(otpAuth);
    return `<img src='${QRCodeImageUrl}' alt='qr-code-img-trungquandev' />`;
  } catch (error) {
    console.log("Could not generate QR code", error);
    return;
  }
};

export {
  generateUniqueSecret,
  verifyOTPToken,
  generateOTPToken,
  generateQRCode,
};
