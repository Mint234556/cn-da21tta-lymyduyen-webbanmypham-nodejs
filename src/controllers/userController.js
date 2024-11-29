const User = require('../models/User');

// Lấy danh sách người dùng
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'username', 'email', 'createdAt'] }); // Chỉ trả về các trường cần thiết
        // Render trang user-management.ejs và truyền danh sách người dùng vào
        res.render('layouts/user-management', { users });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// Tạo người dùng mới (dành cho admin)
exports.createUser = async (req, res) => {
    // Kiểm tra nếu người dùng không phải admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền tạo người dùng' });
    }

    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        const newUser = await User.register(username, email, password);
        res.status(201).json({ message: 'Người dùng được tạo thành công', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    // Kiểm tra nếu người dùng không phải admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền cập nhật người dùng' });
    }

    try {
        const { userId } = req.params;
        const { username, email } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();
        res.status(200).json({ message: 'Cập nhật người dùng thành công', user });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
    // Kiểm tra nếu người dùng không phải admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền xóa người dùng' });
    }

    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        await user.destroy();
        res.status(200).json({ message: 'Người dùng đã bị xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};
