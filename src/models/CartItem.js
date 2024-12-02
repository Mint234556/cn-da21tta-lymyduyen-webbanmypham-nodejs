// src/models/CartItem.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CartItem = sequelize.define('CartItem', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
});

module.exports = CartItem;
