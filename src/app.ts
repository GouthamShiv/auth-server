import fs from 'fs';
import path from 'path';
import https from 'https';
import express from 'express';
import config from 'config';
import helmet from 'helmet';
import log from './utils/logger';
import router from './routes/index';
import connectToDB from './utils/db.connect';

const server = express().disable('x-powered-by');
server.use(helmet());
server.use(express.json());
server.use(router);

const PORT = config.get('port');

// server.listen(PORT, () => {
//   log.info(`Server started at http://localhost:${PORT}`);
//   connectToDB();
// });

if (process.env.RUNTIME === 'local') {
  const sslServer = https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
    },
    server,
  );
  sslServer.listen(PORT, () => {
    log.info(`🔐 Server successfully started https://localhost:${PORT}`);
  });
  connectToDB();
} else {
  server.listen(PORT, () => {
    log.info(`🔐 Server successfully started on port ${PORT}`);
  });
  connectToDB();
}
