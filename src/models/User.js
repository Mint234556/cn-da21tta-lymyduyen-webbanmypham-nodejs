const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50), // Giới hạn độ dài chuỗi
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255), // Giới hạn độ dài email
        allowNull: false,
        unique: true // Đảm bảo email là duy nhất
    },
    password: {
        type: DataTypes.STRING, // Không cần giới hạn độ dài vì mật khẩu sẽ được mã hóa
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'), // Chỉ nhận giá trị 'user' hoặc 'admin'
        defaultValue: 'user', // Mặc định là 'user'
        allowNull: false
    }
}, {
    timestamps: true
});

// Phương thức đăng ký
User.register = async function(username, email, password, role = 'user') {
    // Kiểm tra nếu email đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Email đã được sử dụng');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role // Gán vai trò (mặc định là 'user')
    });

    return newUser;
};

// Phương thức xác thực mật khẩu
User.authenticate = async function(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Người dùng không tồn tại');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Mật khẩu không chính xác');
    }

    return user;
};

module.exports = User;
