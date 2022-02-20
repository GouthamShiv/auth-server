require('dotenv').config();

const port = process.env.PORT;
const dbUri = `${process.env.DB_URI}`;
const logLevel = `${process.env.LOG_LEVEL}`;
const smtp = {
  host: `${process.env.SMTP_HOST}`,
  port: `${process.env.SMTP_PORT}`,
  secure: false,
};
const fromEmail = `${process.env.SMTP_FROM}`;

export default {
  port,
  dbUri,
  logLevel,
  smtp,
  fromEmail,
};
