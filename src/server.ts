import errorHandler from 'errorhandler';

import app from './app';

if (!app.get('env').toLowerCase().startsWith('prod')) {
  app.use(errorHandler());
}

const server = app.listen(app.get('port'));

export default server;
