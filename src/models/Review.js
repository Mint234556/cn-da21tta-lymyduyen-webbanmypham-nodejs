const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Kết nối DB

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: true
});

module.exports = Review;
