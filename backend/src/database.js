const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

const getDatabase = () => {
    if (mongoose.connection.readyState !== 1) {
        throw new Error("MongoDB is not connected.");
    }

    return mongoose.connection.db;
};

const closeDatabase = async () => {
    try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    } catch (error) {
        console.error("Error closing MongoDB:", error.message);
    }
};

module.exports = {
    connectDatabase,
    closeDatabase,
    getDatabase
};