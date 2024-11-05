const express = require('express');
const { connectDB, sequelize } = require('./src/config/db');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views')); // Đảm bảo đường dẫn tới views
app.use(express.static(path.join(__dirname, 'src/public'))); // Cấu hình thư mục tĩnh

app.get('/', (req, res) => {
    res.render('layouts/index'); // Đường dẫn tới index
});

// Import và sử dụng route đăng ký
app.use('/auth', require('./src/routes/authRoutes')); // Import đúng đường dẫn

// Đồng bộ hóa cơ sở dữ liệu
sequelize.sync({ alter: true })
    .then(() => {
        console.log("All models were synchronized successfully.");
    })
    .catch((error) => {
        console.error("Error synchronizing models:", error);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
