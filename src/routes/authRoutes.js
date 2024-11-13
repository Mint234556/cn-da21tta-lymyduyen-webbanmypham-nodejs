// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route hiển thị giao diện đăng ký
router.get('/register', (req, res) => {
    res.render('auth/register'); // Đường dẫn đến file register.ejs
});

// Route đăng ký
router.post('/register', authController.register);
//Route đăng nhập
router.post('/login', authController.login);
// Bạn có thể thêm các route khác cần xác thực ở đây
// Ví dụ: router.get('/protected', authMiddleware, protectedController);

module.exports = router;