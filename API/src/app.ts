import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

// import router
import habitRouter from './routes/habitRoutes';

const app = express();
app.use(cors());
app.use(express.json());

// app.use("route", router);
app.use("/habits", habitRouter);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});