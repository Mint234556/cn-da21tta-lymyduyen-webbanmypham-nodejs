// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Đăng ký người dùng
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kiểm tra xem tên người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully", userId: newUser.id });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Tạo token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};
