const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Import sequelize

// Định nghĩa model Review
const Review = sequelize.define('Review', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = Review;
