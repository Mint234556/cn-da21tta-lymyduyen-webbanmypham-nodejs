const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Import sequelize từ db.js

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: true,
});

module.exports = Product;
