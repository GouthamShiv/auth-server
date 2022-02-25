import { Request, Response } from 'express';
import config from 'config';
import { nanoid } from 'nanoid';
import log from '../utils/logger';
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from '../schema/user.schema';
import { createUser, findUserByEmail, findUserById } from '../service/user.service';
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

export async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInput>, res: Response) {
  const { email } = req.body;
  const message = `If a user with this email: ${email} is registered, you will receive a password reset email`;

  log.info(`User with email: ${email} requested for password reset`);

  const user = await findUserByEmail(email);

  if (!user) {
    log.warn(`No user with email: ${email}`);
    return res.status(200).json(message);
  }

  if (!user.verified) {
    log.warn(`User with email: ${email} trying to reset password before verification`);
    return res.json(`User yet to be verified`);
  }

  const passwordResetCode = nanoid();
  user.passwordResetCode = passwordResetCode;
  await user.save();
  log.info(`Password reset code successfully generated for email: ${email}`);

  const from = config.get<string>('fromEmail');

  await sendEmail({
    from,
    to: user.email,
    subject: 'Reset your password',
    text: `Password reset code: ${user.passwordResetCode}\nId: ${user.id}`,
  });
  log.info(`Password reset email sent to ${email}`);

  return res.json(message);
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>,
  res: Response,
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  const user = await findUserById(id);

  if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
    log.warn(`Password reset request failure for user with Id: ${id}`);
    return res.status(400).json(`Could not reset user password`);
  }

  user.passwordResetCode = null;
  user.password = password;

  await user.save();

  log.info(`Password reset successful for user with Id: ${id}`);
  return res.json(`Successfully updated user password`);
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.json(res.locals.user);
}
