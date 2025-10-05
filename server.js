import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();



const app = express();
app.use(express.json());
app.use(morgan("dev"));

const corsOptions = {
  origin:"http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

//routes
app.use("/api", authRoutes);
app.use("/api", bookRoutes);
app.use("/api", reviewRoutes);


//rest api
app.get('/', (req, res) => {
  res.send('Hello World!');
})

const PORT = process.env.PORT || 4000;

connectDB();
app.listen(PORT,() => {
  console.log(`Server is running on port ${PORT}`.bgBlue);
})

