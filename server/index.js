import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cvRoutes from './routes/cv.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/cv', cvRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
