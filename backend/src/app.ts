import express, { Request, Response } from 'express';
import cors from 'cors';
import completionsRouter from './routes/completions';
import threadsRouter from './routes/threads';


const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/completions', completionsRouter);
app.use('/thread', threadsRouter);

export default app;