const express = require('express');
const router = express.Router();
const { getProducts, getProductDetails } = require('../controllers/productController');

// Lấy danh sách sản phẩm
router.get('/', getProducts);
// Lấy chi tiết sản phẩm theo ID
router.get('/:id', getProductDetails);

module.exports = router;
