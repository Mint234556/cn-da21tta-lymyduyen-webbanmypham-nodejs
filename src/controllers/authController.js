const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Hàm đăng ký
exports.register = async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;

    // Kiểm tra nếu email hoặc tên đăng nhập đã được đăng ký
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "Tên đăng nhập đã được sử dụng" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Hàm đăng nhập
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm người dùng dựa vào tên đăng nhập
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }

    // Tạo token cho người dùng, bao gồm thông tin role
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Lưu token vào cookie (httpOnly để bảo mật)
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    // Trả về phản hồi đăng nhập thành công
    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      role: user.role,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
