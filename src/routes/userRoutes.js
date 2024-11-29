const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware kiểm tra xác thực

// Route hiển thị trang quản lý người dùng (Chỉ admin mới có quyền truy cập)
router.get('/user-management', authMiddleware(['admin']), (req, res) => {
    res.render('layouts/usermanagement'); // Đường dẫn tới file usermanagement.ejs
});

// Lấy danh sách người dùng (Chỉ admin mới có quyền truy cập)
router.get('/list', authMiddleware(['admin']), getAllUsers);

// Tạo người dùng mới (admin)
router.post('/', authMiddleware(['admin']), createUser);

// Cập nhật thông tin người dùng (Chỉ admin mới có quyền truy cập)
router.put('/:userId', authMiddleware(['admin']), updateUser);

// Xóa người dùng (Chỉ admin mới có quyền truy cập)
router.delete('/:userId', authMiddleware(['admin']), deleteUser);

module.exports = router;
