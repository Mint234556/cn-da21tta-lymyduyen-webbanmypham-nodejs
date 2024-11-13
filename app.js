const express = require('express');
const { connectDB, sequelize } = require('./src/config/db');
const dotenv = require('dotenv');
const path = require('path');

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

// Định nghĩa route chính
app.get('/', (req, res) => {
    res.render('layouts/index'); // Đường dẫn đến file index.ejs
});

// Import và sử dụng route đăng ký
app.use('/auth', require('./src/routes/authRoutes'));

// Middleware xử lý lỗi (đặt ở cuối các route)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
