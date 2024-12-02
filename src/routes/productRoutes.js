const express = require('express');
const router = express.Router();
const { getProducts, getProductDetails } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProductDetails);

module.exports = router;
