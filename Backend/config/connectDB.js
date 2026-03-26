const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    try {
        if (isConnected || mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("MongoDb connected");
    } catch (err) {
        console.error("Database connection failed:", err.message);
        throw err;
    }
};

module.exports = connectDB;
