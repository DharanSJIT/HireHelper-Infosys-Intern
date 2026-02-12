require("dotenv").config();
const express = require("express");
const connectDB = require("./config/connectDB");
const UserSchema = require("./Models/User.js");
const authRoutes = require("./routes/authRoutes.js");

const app = express();

connectDB();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use("/api/auth",authRoutes);

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});