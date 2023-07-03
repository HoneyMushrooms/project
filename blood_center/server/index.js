import express from 'express';
import dotenv from 'dotenv';
import db from './db.js';
import './models/models.js';
import router from './routers/router.js';
import cors from 'cors';
import errorMiddleware from './middleware/errorMiddleware.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json())
app.use('/api', router);
app.use(errorMiddleware);

try {
    await db.authenticate();
    await db.sync({ alter: true });
    app.listen(process.env.PORT, () => console.log(`Server started on the ${process.env.PORT} port`));
} catch(err) {
    console.error(`:( `, err);
}

