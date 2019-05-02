import express from 'express';
import compression from 'compression';
import pino from 'express-pino-logger';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(pino({level: process.env.LOGLEVEL || 'error'}, null));

app.get('/', (req, res) => res.send('Hello, World!'));

export default app;
