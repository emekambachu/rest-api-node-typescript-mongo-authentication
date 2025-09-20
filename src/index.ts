import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors({
    credentials: true,
}));
app.use(compression());
app.use(cookieParser());

app.use(bodyParser.json());
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router());

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

const MONGO_URL = process.env.MONGO_URL;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL).then(r => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (error: Error) => {
    console.log(error);
});