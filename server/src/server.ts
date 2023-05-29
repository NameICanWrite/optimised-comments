import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import Joi from 'joi'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
import AppRouter from './router';
import connectDB from './config/database';
import helmet from 'helmet'
import http from 'http'
import { createWebSocketServer } from './webSocketServer';
dotenv.config()

const app = express()

const server = http.createServer(app)
const { wss, wsClients } = createWebSocketServer(server);
app.use(helmet())

app.set('wsClients', wsClients)

const router = new AppRouter(app);
// Connect to MongoDB
connectDB();

// console.log(process.env.CLIENT_ROOT_URL);

// Express configuration
app.use(cors({
  origin: ['http://localhost:3000', process.env.CLIENT_ROOT_URL],
  methods: ["GET", "POST", "OPTIONS", "PATCH", "PUT", 'DELETE'],
  credentials: true,
  exposedHeaders: ['Authorization']
}))
app.set('port', process.env.PORT || 5000);

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: {fileSize: 50 * 1024 * 1024}
}))

router.init();

const port = app.get('port');


// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err instanceof Joi.ValidationError) {
    res.status(400).send(err.message)
  }
  if (!res.statusCode) res.status(500)
  res.send(err.message || 'Internal error')
})

// eslint-disable-next-line no-console
server.listen(port, () => console.log(`Server started on port ${port}`));


