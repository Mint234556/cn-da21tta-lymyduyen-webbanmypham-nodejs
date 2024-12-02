const express = require('express');
const router = express.Router();
const { addReview } = require('../controllers/reviewController');

// Thêm đánh giá cho sản phẩm
router.post('/:id/reviews', addReview);

module.exports = router;
