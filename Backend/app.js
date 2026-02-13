require("dotenv").config();
const express = require("express");
const connectDB = require("./config/connectDB");
const UserSchema = require("./Models/User.js");
const authRoutes = require("./routes/authRoutes.js");
const authMiddleware = require("./middlewares/authMiddlewares.js");

const app = express();

connectDB();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use("/api/auth",authRoutes);

app.get("/api/dashboard",authMiddleware,(req,res)=>{
    res.json({ message: "Welcome to Dashboard" });
});

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});