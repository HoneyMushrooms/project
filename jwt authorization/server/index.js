import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import apiRouter from "./router/apiRouter.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9999;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', apiRouter);
app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, () => console.log(`Server started on the port ${PORT}`));
    } catch(e) {
        console.log(`Server died with an error ${e.message}`);
    }
}

start();