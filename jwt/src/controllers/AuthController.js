const jwtHelper = require("../helpers/jwt.helper");

// Biến cục bộ trên server này sẽ lưu trữ tạm danh sách token
// Trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
let tokenList = {};

// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1s";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET ||
  "access-token-secret-example-trungquandev.com-green-cat-a@";

// Thời gian sống của refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET ||
  "refresh-token-secret-example-trungquandev.com-green-cat-a@";

let login = async (req, res) => {
  try {
    console.log(
      `Đang giả lập hành động đăng nhập thành công với Email: ${req.body.email} và Password: ${req.body.password}`
    );

    console.log(`Thực hiện fake thông tin user...`);
    const userFakeData = {
      _id: "1234-5678-910JQK-tqd",
      name: "Son Nguyen",
      email: req.body.email,
    };

    console.log(`Thực hiện tạo mã Token, [thời gian sống 1 giờ.]`);
    const accessToken = await jwtHelper.generateToken(
      userFakeData,
      accessTokenSecret,
      accessTokenLife
    );

    console.log(`Thực hiện tạo mã Refresh Token, [thời gian sống 10 năm] =))`);
    const refreshToken = await jwtHelper.generateToken(
      userFakeData,
      refreshTokenSecret,
      refreshTokenLife
    );

    // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
    // lưu ý trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
    tokenList[refreshToken] = { accessToken, refreshToken };

    console.log(`Gửi Token và Refresh Token về cho client...`);
    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json(error);
  }
};

let refreshToken = async (req, res) => {
  // User gửi mã refresh token kèm theo trong body
  const refreshTokenFromClient = req.body.refreshToken;
  // console.log("tokenList: ", tokenList);

  // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
  if (refreshTokenFromClient && tokenList[refreshTokenFromClient]) {
    try {
      // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded
      const decoded = await jwtHelper.verifyToken(
        refreshTokenFromClient,
        refreshTokenSecret
      );

      // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
      // có thể mở comment dòng console.log bên dưới để xem là rõ nhé.
      // console.log("decoded: ", decoded);
      const userFakeData = decoded.data;

      console.log(
        `Thực hiện tạo mã Token trong bước gọi refresh Token, [thời gian sống vẫn là 1 giờ.]`
      );
      const accessToken = await jwtHelper.generateToken(
        userFakeData,
        accessTokenSecret,
        accessTokenLife
      );

      // gửi token mới về cho người dùng
      return res.status(200).json({ accessToken });
    } catch (error) {
      res.status(403).json({
        message: "Invalid refresh token.",
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: "No token provided - Refresh token.",
    });
  }
};

module.exports = {
  login: login,
  refreshToken: refreshToken,
};
