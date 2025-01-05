import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app=express();
const allowedOrigins = ['https://tutedude-assign-1.onrender.com'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,  // To allow sending cookies
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
import userRouter from './routes/User.routes.js'
app.use('/auth',userRouter)

export default app;
