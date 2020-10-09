import express from 'express';
import dotenv from 'dotenv';
import chalk from 'chalk';
import connectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    chalk.blue
      .bold`Server is running in ${process.env.NODE_ENV} MODE on port ${PORT}`
  )
);
