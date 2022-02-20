import express from 'express';
import config from 'config';
// import helmet from 'helmet';
import log from './utils/logger';
import router from './routes/index';
import connectToDB from './utils/db.connect';

const server = express().disable('x-powered-by');
// server.use(helmet());
server.use(express.json());
server.use(router);

const PORT = config.get('port');

server.listen(PORT, () => {
  log.info(`Server started at http://localhost:${PORT}`);
  connectToDB();
});
