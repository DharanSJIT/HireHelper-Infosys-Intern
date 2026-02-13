require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const UserSchema = require("./Models/User.js");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const authMiddleware = require("./middlewares/authMiddlewares.js");

const app = express();

connectDB();

app.use(cors());
app.use(express.urlencoded({extended:true, limit: '10mb'}));
app.use(express.json({limit: '10mb'}));

app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);

app.get("/api/dashboard",authMiddleware,(req,res)=>{
    res.json({ message: "Welcome to Dashboard" });
});

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});