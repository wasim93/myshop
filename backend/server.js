import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import chalk from 'chalk';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(
    morgan(function (tokens, req, res) {
      // var LocalDateTime = new Date(tokens.date(req, res));
      // LocalDateTime.toString(); // "Wed Jun 29 2011 09:52:48 GMT-0700 (PST)"

      return (
        chalk.blue.bold(tokens.method(req, res)) +
        ' ' +
        chalk.green.bold(tokens.url(req, res)) +
        ' ' +
        chalk.red(tokens['response-time'](req, res)) +
        ' ' +
        chalk.magenta(tokens.date(req, res))
        // chalk.magenta(LocalDateTime)
      );
    })
  );
  // app.use(morgan('dev'));
}

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'PRODUCTION') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    chalk.white.bgMagenta
      .bold`Server is running in ${process.env.NODE_ENV} MODE on port ${PORT}`
  )
);
