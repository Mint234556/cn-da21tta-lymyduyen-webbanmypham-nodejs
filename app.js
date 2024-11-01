const express = require('express');
const { connectDB, sequelize } = require('./src/config/db');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views')); // Thay đổi đường dẫn ở đây
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index'); // Render view index.ejs
});

const User = require('./src/models/User'); // Update the path

sequelize.sync({ alter: true })
    .then(() => {
        console.log("All models were synchronized successfully.");
    })
    .catch((error) => {
        console.error("Error synchronizing models:", error);
    });

// Sử dụng các route (cần import các file route tại đây)
// app.use('/auth', require('./routes/authRoutes'));
// app.use('/products', require('./routes/productRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
