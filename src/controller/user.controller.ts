import { Request, Response } from 'express';
import config from 'config';
import log from '../utils/logger';
import { CreateUserInput, VerifyUserInput } from '../schema/user.schema';
import { createUser, findUserById } from '../service/user.service';
import { sendEmail } from '../utils/mailer';

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
  const { body } = req;

  try {
    const user = await createUser(body);
    const from = config.get<string>('fromEmail');

    await sendEmail({
      from,
      to: user.email,
      subject: 'Please verify your account',
      text: `Verification code: ${user.verificationCode}\nID: ${user.id}`,
    });

    log.info(`New user created with ID: ${user.email}`);
    res.status(201).json(`User successfully created with ID: ${user.id}`);
  } catch (e: any) {
    // to check if unique constraint has violated
    if (e.code === 11000) {
      log.error(`User already registered:\n${e}`);
      res.status(409).json(`Account already exists`);
    }
    log.error(`Error while creating user:\n${e}`);
    res.status(500).json(e);
  }
}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
  const { id } = req.params;
  const { verificationCode } = req.params;
  log.debug(`Verify User Handler, verifying user with ID: ${id}`);

  const user = await findUserById(id);

  if (!user) {
    log.warn(`No user with ID: ${id}`);
    return res.status(404).json(`No user available with ID: ${id}`);
  }

  if (user.verified) {
    log.warn(`User with ID: ${id} is already verified`);
    return res.json(`User with ID: ${id} is already verified`);
  }

  if (user.verificationCode === verificationCode) {
    log.debug(`Valid verification code, verifying user with ID: ${id}`);
    user.verified = true;
    await user.save();
    log.info(`User with ID: ${id} has been successfully verified!`);
    return res.json(`User with ID: ${id} has been successfully verified!`);
  }

  log.error(`Could not verify user with ID: ${id}`);
  return res.status(400).json(`Could not verify user with ID: ${id}`);
}
