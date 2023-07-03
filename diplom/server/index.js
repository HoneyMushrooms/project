import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './router/authRouter.js';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middleware/errorMiddleware.js';
import messageRouter from './router/messageRouter.js';
import { Server } from "socket.io";
import fileRouter from './router/fileRouter.js';
import compression from 'compression';
import helmet from 'helmet';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

const corsData = {
    credentials: true, 
    origin: process.env.CLIENT
}

app.use(helmet());
app.use(cors(corsData));
app.use(express.json());
app.use(express.static('file'));
app.use(cookieParser());
app.use(compression());
app.use(/\/api\/(message|file).*/, authMiddleware);
app.use('/api/auth/', authRouter);
app.use('/api/message/', messageRouter);
app.use('/api/file/', fileRouter);
app.use(errorMiddleware);

try {
    await mongoose.connect(process.env.DB_URL).then(() => console.log(`DB Connetion Successfull`))
    const server = app.listen(process.env.PORT, () => console.log(`Server started on the port ${process.env.PORT}`));
    const io = new Server(server, {cors: corsData});

    const onlineUsers = new Map();

    io.on("connection", (socket) => {
        
        socket.on("add-user", (id) => {
            onlineUsers.set(id, socket.id);
        });

        socket.on("send-msg", (data) => {
            const sendUserSocket = onlineUsers.get(data.to);
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit("msg-recieve", data.msg);
            }
        });
    });

} catch(e) {
    console.log(e.message, ` :( `)
}
