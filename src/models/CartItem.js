const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Kết nối DB
const Product = require('./Product'); // Quan hệ với bảng Product

const CartItem = sequelize.define('CartItem', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
});

CartItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = CartItem;
