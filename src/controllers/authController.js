// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Đảm bảo đường dẫn chính xác

// Hàm đăng ký
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Kiểm tra nếu email đã được đăng ký
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};
