import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app=express();
const allowedOrigins = [
  'https://tutedude-assign-1.onrender.com',
  'http://localhost:5173'  //for development
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // To allow cookies
}));

// Handle preflight requests for all routes
app.options('*', cors());
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
import userRouter from './routes/User.routes.js'
app.use('/auth',userRouter)

export default app;
