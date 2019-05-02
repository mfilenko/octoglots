import express from 'express';
import compression from 'compression';
import pino from 'express-pino-logger';
import {search} from './handlers/search';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(pino({level: process.env.LOGLEVEL || 'error'}, null));

// TODO: Caching middleware.
app.get('/users', search);

export default app;
