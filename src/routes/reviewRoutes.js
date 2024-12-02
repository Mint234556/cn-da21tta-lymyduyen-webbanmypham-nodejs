const express = require('express');
const router = express.Router();
const { addReview } = require('../controllers/reviewController');

router.post('/:id/reviews', addReview);

module.exports = router;
