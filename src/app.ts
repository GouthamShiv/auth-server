import express from 'express';
import config from 'config';
import helmet from 'helmet';
import connectToDB from './utils/db.connect';
import log from './utils/logger';

require('dotenv').config();

const server = express().disable('x-powered-by');
server.use(helmet());

const PORT = process.env.PORT || config.get('port');

server.listen(PORT, () => {
  log.info(`Server started at http://localhost:${PORT}`);
  connectToDB();
});
