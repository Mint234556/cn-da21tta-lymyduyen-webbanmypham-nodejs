const jwt = require('jsonwebtoken');

// Định nghĩa thông báo lỗi
const errorMessages = {
    unauthorized: 'Bạn chưa đăng nhập',
    forbidden: 'Bạn không có quyền truy cập',
    invalidToken: 'Token không hợp lệ hoặc đã hết hạn',
};

// Middleware xác thực và phân quyền
const authMiddleware = (roles = []) => (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Lấy token từ header (Bearer token)

    if (!token) {
        if (req.accepts('html')) {
            return res.redirect('/js/login'); // Chuyển hướng tới trang đăng nhập nếu không có token
        }
        return res.status(401).json({ message: errorMessages.unauthorized });
    }

    try {
        // Xác thực token và giải mã để lấy thông tin người dùng
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Thêm thông tin người dùng vào request

        // Kiểm tra vai trò (nếu yêu cầu roles)
        if (roles.length > 0 && !roles.includes(decoded.role)) {
            if (req.accepts('html')) {
                return res.render('layouts/error', { message: errorMessages.forbidden });
            }
            return res.status(403).json({ message: errorMessages.forbidden });
        }

        // Nếu mọi thứ hợp lệ, tiếp tục xử lý request
        next();
    } catch (error) {
        console.error('Lỗi xác thực token:', error.message); // Ghi log lỗi
        if (req.accepts('html')) {
            return res.render('layouts/error', { message: errorMessages.invalidToken });
        }
        return res.status(403).json({ message: errorMessages.invalidToken });
    }
};

module.exports = authMiddleware;
