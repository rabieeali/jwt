import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import routes from './routes';
import { connectDB } from './configs/mongo.config';
import { notFoundHandler } from './lib/notFoundHandler';
import { errorHandler } from './lib/errorHandler';
import { corsOptions } from './configs/cors.config';
const { PORT } = process.env;

connectDB();
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use(routes);

// 404
app.all('*', notFoundHandler);
// error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server Is Running On Port ${PORT}`));
