const Product = require('../models/Product');
const Review = require('../models/Review');

// Lấy danh sách tất cả sản phẩm
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm' });
    }
};

// Lấy chi tiết sản phẩm và đánh giá của sản phẩm
exports.getProductDetails = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByPk(productId, {
            include: [{
                model: Review,
                as: 'reviews',
                attributes: ['user', 'comment']
            }],
        });

        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        res.json({
            product,
            reviews: product.reviews
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết sản phẩm' });
    }
};
