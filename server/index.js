import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";


import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
// Add other route imports as needed
import questionRoutes from "./routes/question.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Register your routes here
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
// Add other app.use() for more routes if needed
app.use("/questions", questionRoutes);

mongoose.connect(process.env.MONGO_URI, { })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
            console.log(`MONGO_URI: ${process.env.MONGO_URI}`);
        });
    })
    .catch((err) => console.log(err));