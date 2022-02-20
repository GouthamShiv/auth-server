// import log from './logger';
import nodemailer, { SendMailOptions } from 'nodemailer';
import config from 'config';
import log from './logger';

// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   log.debug(`Test Account created with creds:\n${JSON.stringify(creds)}`);
// }

// createTestCreds();

const smtp = config.get<{
  user: string;
  auth: string;
  host: string;
  port: number;
  secure: boolean;
  secureConnection: boolean;
}>('smtp');

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_AUTH,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

export async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, 'Error sending email');
      return;
    }
    log.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
}
