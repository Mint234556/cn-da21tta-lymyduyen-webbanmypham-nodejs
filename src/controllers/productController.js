const Product = require('../models/Product');
const Review = require('../models/Review');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm' });
    }
};

// API hiển thị chi tiết sản phẩm và các đánh giá của sản phẩm
exports.getProductDetails = async (req, res) => {
    try {
        const productId = req.params.id;

        // Lấy sản phẩm cùng với các đánh giá liên quan
        const product = await Product.findByPk(productId, {
            include: [{
                model: Review,
                as: 'reviews',  // Đảm bảo rằng bạn đã thiết lập alias 'reviews' trong quan hệ giữa Product và Review
                attributes: ['user', 'comment'],  // Chỉ lấy những trường cần thiết từ bảng Review
            }],
        });

        // Kiểm tra xem sản phẩm có tồn tại không
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        // Trả về thông tin sản phẩm và các đánh giá
        res.json({
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image,
            },
            reviews: product.reviews,  // Các đánh giá liên quan
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết sản phẩm' });
    }
};
