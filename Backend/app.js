    require("dotenv").config();
    const express = require("express");
    const cors = require("cors");
    const connectDB = require("./config/connectDB");
    const authRoutes = require("./routes/authRoutes.js");
    const taskRoutes = require("./routes/taskRoutes.js");
    const authMiddleware = require("./middlewares/authMiddlewares.js");
    const requestRoutes = require("./routes/requestRoutes.js");

    const app = express();

    app.use(cors());
    app.use(express.urlencoded({extended:true, limit: '10mb'}));
    app.use(express.json({limit: '10mb'}));

    app.use("/api/auth",authRoutes);
    app.use("/api/tasks",taskRoutes);
    app.use("/api/requests",requestRoutes);

    app.get("/api/dashboard",authMiddleware,(req,res)=>{
        res.json({ message: "Welcome to Dashboard" });
    });

    const PORT = process.env.PORT;

    const startServer = async () => {
        await connectDB();
        app.listen(PORT,()=>{
            console.log(`Server running on port ${PORT}`);
        });
    };

    startServer();
