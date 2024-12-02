const express = require('express');
const router = express.Router();
const { addToCart } = require('../controllers/cartController');

// Thêm sản phẩm vào giỏ hàng
router.post('/', addToCart);

module.exports = router;
