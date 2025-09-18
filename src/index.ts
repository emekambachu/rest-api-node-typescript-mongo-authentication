import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

const MONGO_URL = 'mongodb+srv://xeddtech:Xeddtech_1990@clusterelearningtrainin.unpzxml.mongodb.net/rest_api_node_typescript?retryWrites=true&w=majority&appName=ClusterElearningTrainingReactNode';

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => {
    console.log(error);
});
