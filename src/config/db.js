const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL successfully.');
    } catch (error) {
        console.error('Unable to connect to MySQL:', error);
    }
};

module.exports = { sequelize, connectDB };