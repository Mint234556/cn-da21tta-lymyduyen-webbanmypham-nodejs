const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Kết nối DB
const Review = require('./Review'); // Quan hệ với bảng Review

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

// Thiết lập quan hệ giữa Product và Review
Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Product;
