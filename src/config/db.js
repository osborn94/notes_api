const mongoose = require('mongoose');
require('dotenv').config();


const MONGO_URL = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

module.exports = { connectDB };