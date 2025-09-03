import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

// import router
//import habitRoutes from './routes/habitRoutes';
import userRoutes from './routes/userRoutes';
import habitRoutes from './routes/habitRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(cors());
app.use(express.json());

// app.use("route", router);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/habits", habitRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});