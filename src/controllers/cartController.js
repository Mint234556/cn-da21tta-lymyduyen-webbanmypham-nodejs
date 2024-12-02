const CartItem = require('../models/CartItem');  // Giả sử bạn đã có mô hình CartItem trong Sequelize

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
        const existingCartItem = await CartItem.findOne({ where: { productId } });
        if (existingCartItem) {
            // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            return res.status(200).json({ message: "Cập nhật giỏ hàng thành công", cartItem: existingCartItem });
        }

        // Nếu sản phẩm chưa có trong giỏ hàng, tạo mới
        const cartItem = await CartItem.create({ productId, quantity });
        res.status(201).json({ message: "Đã thêm vào giỏ hàng", cartItem });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm vào giỏ hàng' });
    }
};
