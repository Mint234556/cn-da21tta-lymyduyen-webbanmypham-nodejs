const express = require('express');
const { connectDB, sequelize } = require('./src/config/db');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs'); // Thêm bcrypt
const User = require('./src/models/User'); // Import model User
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes'); // Import authRoutes
dotenv.config();
connectDB();

const app = express();

// Thiết lập middleware để phân tích dữ liệu từ form và JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Thiết lập view engine và đường dẫn tới các thư mục tĩnh
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'src/public')));

// Kiểm tra kết nối cơ sở dữ liệu
sequelize.authenticate()
    .then(() => console.log('Kết nối cơ sở dữ liệu thành công'))
    .catch(error => console.error('Không thể kết nối đến cơ sở dữ liệu:', error));

// Đồng bộ hóa mô hình với cơ sở dữ liệu
sequelize.sync({ alter: true })
    .then(() => console.log("All models were synchronized successfully."))
    .catch(error => console.error("Error synchronizing models:", error));

// Tạo admin mặc định
const createDefaultAdmin = async () => {
    try {
        const email = 'admin@example.com';
        const password = 'admin123';
        const username = 'admin';

        const existingAdmin = await User.findOne({ where: { email } });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                username,
                email,
                password: hashedPassword,
                role: 'admin', // Vai trò admin
            });
            console.log('Admin mặc định đã được tạo.');
        } else {
            console.log('Admin đã tồn tại.');
        }
    } catch (error) {
        console.error('Lỗi khi tạo admin mặc định:', error.message);
    }
};

// Gọi hàm tạo admin mặc định
createDefaultAdmin();

// Route trang chủ
app.get('/', (req, res) => {
    console.log('Rendering index page...');
    res.render('layouts/index'); // File index.ejs
});

// // Route hiển thị trang quản lý người dùng
// app.get('/user-management', (req, res) => {
//     res.render('layouts/usermanagement'); // Render trang usermanagement.ejs
// });

// Sử dụng các routes
app.use('/auth', authRoutes); // Route đăng ký và đăng nhập
app.use('/users', userRoutes); // Các tuyến liên quan đến người dùng

// Middleware xử lý lỗi (đặt ở cuối các route)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
