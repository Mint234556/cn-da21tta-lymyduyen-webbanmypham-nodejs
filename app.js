const express = require('express');
const { connectDB, sequelize } = require('./src/config/db');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs'); // Thêm bcrypt
const jwt = require('jsonwebtoken'); // Thêm jwt
const User = require('./src/models/User'); // Import model User
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes'); // Import authRoutes
const productRoutes = require('./src/routes/productRoutes'); // Import product routes
const reviewRoutes = require('./src/routes/reviewRoutes'); // Import review routes
const cartRoutes = require('./src/routes/cartRoutes'); // Import cart routes
const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();

const app = express();

// Thiết lập middleware để phân tích dữ liệu từ form và JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

// Middleware kiểm tra token JWT
app.use((req, res, next) => {
    const token = req.cookies.authToken; // Lấy token từ cookie

    if (!token) {
        return next(); // Nếu không có token, tiếp tục xử lý yêu cầu
    }

    // Xác minh token
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key', (err, decoded) => {
        if (err) {
            return next(); // Nếu token không hợp lệ, tiếp tục yêu cầu
        }
        req.user = decoded; // Lưu thông tin người dùng vào req.user
        next();
    });
});

// Route trang chủ
app.get('/', (req, res) => {
    console.log('Rendering index page...');
    res.render('layouts/index', { user: req.user }); // Gửi thông tin người dùng nếu đã đăng nhập
});

app.get('/products', (req, res) => {
    res.render('layouts/products'); // Gửi tệp products.ejs
});

// Sử dụng các routes
app.use('/auth', authRoutes); // Route đăng ký và đăng nhập
app.use('/users', userRoutes); // Các tuyến liên quan đến người dùng
app.use('/api/products', productRoutes); // Route quản lý sản phẩm
app.use('/api/reviews', reviewRoutes); // Route quản lý đánh giá
app.use('/api/cart', cartRoutes); // Route quản lý giỏ hàng

const products = [
    { id: 1, name: "Sản phẩm 1", price: "100,000", description: "Mô tả sản phẩm 1", image: "/images/product1.jpg" },
    { id: 2, name: "Sản phẩm 2", price: "200,000", description: "Mô tả sản phẩm 2", image: "/images/product2.jpg" },
    // Thêm sản phẩm khác
];

const reviews = [
    { productId: 1, user: "Nguyen Van A", comment: "Sản phẩm rất tốt!" },
    { productId: 1, user: "Tran Thi B", comment: "Hài lòng với chất lượng." },
    // Đánh giá khác
];

// Route trang chi tiết sản phẩm
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    const productReviews = reviews.filter(r => r.productId === productId);

    if (!product) {
        return res.status(404).send("Sản phẩm không tồn tại");
    }

    res.render('layouts/productDetails', { product, reviews: productReviews });
});

// Middleware xử lý lỗi (đặt ở cuối các route)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
