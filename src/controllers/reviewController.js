const Review = require('../models/Review');

exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.create({
            productId: req.params.id,
            rating,
            comment,
        });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm đánh giá' });
    }
};
