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
const accessTokenPrivateKey = `${process.env.ACC_TKN_PRI}`;
const accessTokenPublicKey = `${process.env.ACC_TKN_PUB}`;
const refreshTokenPrivateKey = `${process.env.REF_TKN_PRI}`;
const refreshTokenPublicKey = `${process.env.REF_TKN_PUB}`;
const accessTokenExpiry = `${process.env.ACC_TKN_EXP}`;
const refreshTokenExpiry = `${process.env.REF_TKN_EXP}`;

export default {
  port,
  dbUri,
  logLevel,
  smtp,
  fromEmail,
  accessTokenPrivateKey,
  accessTokenPublicKey,
  refreshTokenPrivateKey,
  refreshTokenPublicKey,
  accessTokenExpiry,
  refreshTokenExpiry,
};
