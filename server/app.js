import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app=express();
app.use(cors({
    origin: 'https://tutedude-assign-1.onrender.com/',
  credentials: true,
}));

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
import userRouter from './routes/User.routes.js'
app.use('/auth',userRouter)

export default app;
