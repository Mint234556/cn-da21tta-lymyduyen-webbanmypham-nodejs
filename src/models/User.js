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
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Đảm bảo email là duy nhất
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

// Phương thức đăng ký
User.register = async function(username, email, password) {
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
        password: hashedPassword
    });

    return newUser;
};

module.exports = User;