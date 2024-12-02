const CartItem = require('../models/CartItem');

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const existingCartItem = await CartItem.findOne({ where: { productId } });
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            return res.status(200).json({ message: "Cập nhật giỏ hàng thành công", cartItem: existingCartItem });
        }

        const cartItem = await CartItem.create({ productId, quantity });
        res.status(201).json({ message: "Đã thêm vào giỏ hàng", cartItem });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm vào giỏ hàng' });
    }
};
